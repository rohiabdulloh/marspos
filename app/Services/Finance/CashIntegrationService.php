<?php

namespace App\Services\Finance;

use App\Models\Sale;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

class CashIntegrationService
{
    public function __construct(
        protected CashService $cashService
    ) {}

    public function recordSalePayment(
        Sale $sale,
        float $amount,
        int $cashAccountId,
        array $data = []
    ): void {

        $cashAccount =
            \App\Models\CashAccount::findOrFail(
                $cashAccountId
            );

        $this->cashService->deposit(
            $cashAccount,
            $amount,
            [
                'transaction_type' =>
                    'sale_payment',

                'reference_type' =>
                    Sale::class,

                'reference_id' =>
                    $sale->id,

                'reference_number' =>
                    $sale->invoice_number,

                'category' =>
                    'sales',

                'description' =>
                    'Pembayaran penjualan ' .
                    $sale->invoice_number,

                'user_id' =>
                    $data['user_id']
                    ?? auth()->id(),
            ]
        );
    }

    public function recordPurchasePayment(
        Purchase $purchase,
        float $amount,
        int $cashAccountId,
        array $data = []
    ): void {

        $cashAccount =
            \App\Models\CashAccount::findOrFail(
                $cashAccountId
            );

        $this->cashService->withdraw(
            $cashAccount,
            $amount,
            [
                'transaction_type' =>
                    'purchase_payment',

                'reference_type' =>
                    Purchase::class,

                'reference_id' =>
                    $purchase->id,

                'reference_number' =>
                    $purchase->invoice_number,

                'category' =>
                    'purchases',

                'description' =>
                    'Pembayaran pembelian ' .
                    $purchase->invoice_number,

                'user_id' =>
                    $data['user_id']
                    ?? auth()->id(),
            ]
        );
    }
}