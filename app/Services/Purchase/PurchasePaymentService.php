<?php

namespace App\Services\Purchase;

use App\Data\Payment\PurchasePaymentData;
use App\Models\PaymentMethod;
use App\Models\Purchase;
use App\Models\PurchasePayment;
use App\Services\Finance\CashTransactionService;
use App\Services\Finance\PayableService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PurchasePaymentService
{
    public function __construct(
        protected CashTransactionService $cashService,
        protected PayableService $payableService,
    ) {}

    public function pay(
        PurchasePaymentData $data
    ): Purchase {

        return DB::transaction(
            function () use ($data) {

                $purchase = Purchase::query()
                    ->lockForUpdate()
                    ->findOrFail(
                        $data->purchaseId
                    );

                if (
                    $purchase->status === 'cancelled'
                ) {
                    throw new RuntimeException(
                        'Pembelian sudah dibatalkan.'
                    );
                }

                $alreadyPaid =
                    (float) $purchase->paid_amount;

                $remaining =
                    max(
                        0,
                        (float) $purchase->total -
                        $alreadyPaid
                    );

                if ($remaining <= 0) {
                    throw new RuntimeException(
                        'Pembelian sudah lunas.'
                    );
                }

                if (empty($data->payments)) {
                    throw new RuntimeException(
                        'Minimal satu metode pembayaran.'
                    );
                }

                $paymentTotal =
                    collect($data->payments)
                        ->sum('amount');

                if ($paymentTotal <= 0) {
                    throw new RuntimeException(
                        'Jumlah pembayaran tidak valid.'
                    );
                }

                if ($paymentTotal > $remaining) {
                    throw new RuntimeException(
                        'Pembayaran melebihi sisa hutang.'
                    );
                }

                foreach (
                    $data->payments
                    as $paymentData
                ) {

                    $this->processPayment(
                        $purchase,
                        $paymentData,
                        $data
                    );
                }

                $newPaid =
                    $alreadyPaid +
                    $paymentTotal;

                $total =
                    (float) $purchase->total;

                $paymentStatus = match (true) {
                    $newPaid <= 0 =>
                        'unpaid',

                    $newPaid < $total =>
                        'partial',

                    default =>
                        'paid',
                };

                $purchase->update([
                    'paid_amount' =>
                        $newPaid,

                    'payment_status' =>
                        $paymentStatus,
                ]);

                $this->payableService->syncFromPurchase(
                    $purchase->fresh()
                );

                return $purchase->fresh([
                    'items',
                    'payments',
                    'supplier',
                ]);
            }
        );
    }

    protected function processPayment(
        Purchase $purchase,
        $paymentData,
        PurchasePaymentData $data
    ): PurchasePayment {

        if ($paymentData->amount <= 0) {
            throw new RuntimeException(
                'Jumlah pembayaran harus lebih besar dari 0.'
            );
        }

        $method =
            PaymentMethod::findOrFail(
                $paymentData->paymentMethodId
            );

        if (!$method->is_active) {
            throw new RuntimeException(
                "Metode pembayaran {$method->name} tidak aktif."
            );
        }

        $payment = PurchasePayment::create([
            'purchase_id' =>
                $purchase->id,

            'payment_method_id' =>
                $method->id,

            'amount' =>
                $paymentData->amount,

            'reference_number' =>
                $paymentData->referenceNumber,

            'payment_date' =>
                $data->paymentDate ?? now(),

            'notes' =>
                $paymentData->notes
                ?? $data->notes,

            'user_id' =>
                auth()->id(),
        ]);

        /*
         * Pembelian adalah uang keluar.
         */
        if ($method->is_cash) {

            $this->cashService->expense(
                storeId:
                    $purchase->store_id,

                amount:
                    $paymentData->amount,

                referenceType:
                    PurchasePayment::class,

                referenceId:
                    $payment->id,

                description:
                    "Pembayaran pembelian {$purchase->invoice_number}",

                transactionDate:
                    $data->paymentDate
                    ?? now()
            );
        }

        return $payment;
    }
}