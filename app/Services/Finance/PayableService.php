<?php

namespace App\Services\Finance;

use App\Models\Payable;
use App\Models\Purchase;
use App\Models\PayablePayment;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PayableService
{
    public function createFromPurchase(
        Purchase $purchase
    ): ?Payable {

        if (
            (float) $purchase->due_amount <= 0
        ) {
            return null;
        }

        return Payable::create([
            'supplier_id' =>
                $purchase->supplier_id,

            'purchase_id' =>
                $purchase->id,

            'invoice_number' =>
                $purchase->invoice_number,

            'transaction_date' =>
                $purchase->transaction_date,

            'due_date' =>
                $purchase->transaction_date
                    ->copy()
                    ->addDays(
                        $purchase->supplier
                            ->payment_term ?? 0
                    ),

            'original_amount' =>
                $purchase->grand_total,

            'paid_amount' =>
                $purchase->paid_amount,

            'remaining_amount' =>
                $purchase->due_amount,

            'status' =>
                $purchase->paid_amount > 0
                    ? 'partial'
                    : 'unpaid',
        ]);
    }

    public function pay(
        Payable $payable,
        array $data
    ): PayablePayment {

        return DB::transaction(
            function () use (
                $payable,
                $data
            ) {

                $payable =
                    Payable::lockForUpdate()
                        ->findOrFail(
                            $payable->id
                        );

                $amount =
                    (float) $data['amount'];

                if (
                    $amount <= 0 ||
                    $amount >
                    $payable->remaining_amount
                ) {
                    throw new RuntimeException(
                        'Nominal pembayaran tidak valid.'
                    );
                }

                $payment =
                    PayablePayment::create([
                        'payable_id' =>
                            $payable->id,

                        'supplier_id' =>
                            $payable->supplier_id,

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

                $payable->increment(
                    'paid_amount',
                    $amount
                );

                $payable->refresh();

                $payable->update([
                    'remaining_amount' =>
                        max(
                            0,
                            $payable->original_amount -
                            $payable->paid_amount
                        ),

                    'status' =>
                        $payable->remaining_amount <= 0
                            ? 'paid'
                            : 'partial',
                ]);

                return $payment;
            }
        );
    }
}