<?php

namespace App\Services\Finance;

use App\Models\Receivable;
use App\Models\Sale;
use App\Models\ReceivablePayment;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReceivableService
{
    public function createFromSale(
        Sale $sale
    ): ?Receivable {

        if (
            (float) $sale->due_amount <= 0
        ) {
            return null;
        }

        if (!$sale->customer_id) {
            throw new RuntimeException(
                'Penjualan kredit harus memiliki pelanggan.'
            );
        }

        return Receivable::create([
            'customer_id' =>
                $sale->customer_id,

            'sale_id' =>
                $sale->id,

            'invoice_number' =>
                $sale->invoice_number,

            'transaction_date' =>
                $sale->transaction_date,

            'due_date' =>
                $sale->transaction_date
                    ->copy()
                    ->addDays(
                        $sale->customer
                            ->payment_term ?? 0
                    ),

            'original_amount' =>
                $sale->grand_total,

            'paid_amount' =>
                $sale->paid_amount,

            'remaining_amount' =>
                $sale->due_amount,

            'status' =>
                $sale->paid_amount > 0
                    ? 'partial'
                    : 'unpaid',
        ]);
    }

    public function pay(
        Receivable $receivable,
        array $data
    ): ReceivablePayment {

        return DB::transaction(
            function () use (
                $receivable,
                $data
            ) {

                $receivable =
                    Receivable::lockForUpdate()
                        ->findOrFail(
                            $receivable->id
                        );

                $amount =
                    (float) $data['amount'];

                if (
                    $amount <= 0 ||
                    $amount >
                    $receivable->remaining_amount
                ) {
                    throw new RuntimeException(
                        'Nominal pembayaran tidak valid.'
                    );
                }

                $payment =
                    ReceivablePayment::create([
                        'receivable_id' =>
                            $receivable->id,

                        'customer_id' =>
                            $receivable->customer_id,

                        'user_id' =>
                            $data['user_id']
                            ?? auth()->id(),

                        'amount' =>
                            $amount,

                        'payment_method' =>
                            $data['payment_method'],

                        'reference_number' =>
                            $data['reference_number']
                            ?? null,

                        'paid_at' =>
                            $data['paid_at']
                            ?? now(),

                        'notes' =>
                            $data['notes']
                            ?? null,
                    ]);

                $receivable->increment(
                    'paid_amount',
                    $amount
                );

                $receivable->refresh();

                $receivable->update([
                    'remaining_amount' =>
                        max(
                            0,
                            $receivable->original_amount -
                            $receivable->paid_amount
                        ),

                    'status' =>
                        $receivable->remaining_amount <= 0
                            ? 'paid'
                            : 'partial',
                ]);

                return $payment;
            }
        );
    }
}