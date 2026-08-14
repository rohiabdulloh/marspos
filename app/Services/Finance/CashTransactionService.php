<?php

namespace App\Services\Finance;

use App\Models\CashTransaction;
use Illuminate\Support\Facades\DB;

class CashTransactionService
{
    public function income(
        int $storeId,
        float $amount,
        string $referenceType,
        int $referenceId,
        string $description,
        ?int $cashAccountId = null,
        ?string $transactionDate = null,
    ): CashTransaction {
        return CashTransaction::create([
            'store_id' =>
                $storeId,

            'cash_account_id' =>
                $cashAccountId,

            'transaction_type' =>
                'income',

            'amount' =>
                $amount,

            'reference_type' =>
                $referenceType,

            'reference_id' =>
                $referenceId,

            'transaction_date' =>
                $transactionDate ?? now(),

            'description' =>
                $description,

            'user_id' =>
                auth()->id(),
        ]);
    }

    public function expense(
        int $storeId,
        float $amount,
        string $referenceType,
        int $referenceId,
        string $description,
        ?int $cashAccountId = null,
        ?string $transactionDate = null,
    ): CashTransaction {
        return CashTransaction::create([
            'store_id' =>
                $storeId,

            'cash_account_id' =>
                $cashAccountId,

            'transaction_type' =>
                'expense',

            'amount' =>
                $amount,

            'reference_type' =>
                $referenceType,

            'reference_id' =>
                $referenceId,

            'transaction_date' =>
                $transactionDate ?? now(),

            'description' =>
                $description,

            'user_id' =>
                auth()->id(),
        ]);
    }
}