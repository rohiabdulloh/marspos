<?php

namespace App\Services\POS;

use App\Data\Payment\SalePaymentData;
use App\Models\PaymentMethod;
use App\Models\Receivable;
use App\Models\Sale;
use App\Models\SalePayment;
use App\Services\Finance\CashTransactionService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SalePaymentService
{
    public function __construct(
        protected CashTransactionService $cashService
    ) {}

    public function pay(
        SalePaymentData $data
    ): Sale {

        return DB::transaction(
            function () use ($data) {

                $sale = Sale::query()
                    ->lockForUpdate()
                    ->findOrFail(
                        $data->saleId
                    );

                /*
                 * Jangan menerima pembayaran
                 * untuk transaksi cancelled.
                 */
                if ($sale->status === 'cancelled') {
                    throw new RuntimeException(
                        'Transaksi penjualan sudah dibatalkan.'
                    );
                }

                /*
                 * Hitung total yang sudah dibayar.
                 */
                $alreadyPaid =
                    (float) $sale->paid_amount;

                $remaining =
                    max(
                        0,
                        (float) $sale->total -
                        $alreadyPaid
                    );

                if ($remaining <= 0) {
                    throw new RuntimeException(
                        'Transaksi sudah lunas.'
                    );
                }

                if (empty($data->payments)) {
                    throw new RuntimeException(
                        'Minimal satu metode pembayaran.'
                    );
                }

                /*
                 * Total pembayaran baru.
                 */
                $paymentTotal =
                    collect($data->payments)
                        ->sum('amount');

                if ($paymentTotal <= 0) {
                    throw new RuntimeException(
                        'Jumlah pembayaran harus lebih besar dari 0.'
                    );
                }

                /*
                 * Jangan sampai pembayaran melebihi
                 * sisa tagihan.
                 */
                if ($paymentTotal > $remaining) {
                    throw new RuntimeException(
                        'Jumlah pembayaran melebihi sisa tagihan.'
                    );
                }

                foreach ($data->payments as $paymentData) {

                    $this->processPayment(
                        $sale,
                        $paymentData,
                        $data
                    );
                }

                /*
                 * Update paid amount.
                 */
                $newPaid =
                    $alreadyPaid +
                    $paymentTotal;

                $total =
                    (float) $sale->total;

                $paymentStatus = match (true) {
                    $newPaid <= 0 =>
                        'unpaid',

                    $newPaid < $total =>
                        'partial',

                    default =>
                        'paid',
                };

                $sale->update([
                    'paid_amount' =>
                        $newPaid,

                    'payment_status' =>
                        $paymentStatus,
                ]);

                /*
                 * Jika lunas, selesaikan
                 * status transaksi.
                 */
                if ($paymentStatus === 'paid') {
                    $sale->update([
                        'status' =>
                            'completed',
                    ]);
                }

                return $sale->fresh([
                    'items',
                    'payments',
                    'customer',
                ]);
            }
        );
    }

    protected function processPayment(
        Sale $sale,
        $paymentData,
        SalePaymentData $data
    ): SalePayment {

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

        /*
         * Simpan payment.
         */
        $payment = SalePayment::create([
            'sale_id' =>
                $sale->id,

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
         * Jika metode pembayaran
         * menghasilkan uang masuk,
         * catat CashTransaction.
         *
         * Piutang tidak masuk kas
         * sebelum benar-benar dibayar.
         */
        if ($method->is_cash) {

            $this->cashService->income(
                storeId:
                    $sale->store_id,

                amount:
                    $paymentData->amount,

                referenceType:
                    SalePayment::class,

                referenceId:
                    $payment->id,

                description:
                    "Pembayaran penjualan {$sale->invoice_number}",

                transactionDate:
                    $data->paymentDate
                    ?? now()
            );
        }

        return $payment;
    }
}