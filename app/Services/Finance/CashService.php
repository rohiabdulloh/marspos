<?php

namespace App\Services\Finance;

use App\Models\CashAccount;
use App\Models\CashTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CashService
{
    public function deposit(
        CashAccount $account,
        float $amount,
        array $data = []
    ): CashTransaction {

        return DB::transaction(
            function () use (
                $account,
                $amount,
                $data
            ) {

                if ($amount <= 0) {
                    throw new RuntimeException(
                        'Nominal harus lebih besar dari 0.'
                    );
                }

                $account =
                    CashAccount::lockForUpdate()
                        ->findOrFail(
                            $account->id
                        );

                $before =
                    $this->getBalance($account);

                $after =
                    $before + $amount;

                return CashTransaction::create([
                    'cash_account_id' =>
                        $account->id,

                    'user_id' =>
                        $data['user_id']
                        ?? auth()->id(),

                    'transaction_type' =>
                        $data['transaction_type']
                        ?? 'income',

                    'transaction_date' =>
                        $data['transaction_date']
                        ?? now(),

                    'reference_type' =>
                        $data['reference_type']
                        ?? null,

                    'reference_id' =>
                        $data['reference_id']
                        ?? null,

                    'reference_number' =>
                        $data['reference_number']
                        ?? null,

                    'amount' =>
                        $amount,

                    'balance_before' =>
                        $before,

                    'balance_after' =>
                        $after,

                    'category' =>
                        $data['category']
                        ?? null,

                    'description' =>
                        $data['description']
                        ?? null,
                ]);
            }
        );
    }

    public function withdraw(
        CashAccount $account,
        float $amount,
        array $data = []
    ): CashTransaction {

        return DB::transaction(
            function () use (
                $account,
                $amount,
                $data
            ) {

                if ($amount <= 0) {
                    throw new RuntimeException(
                        'Nominal harus lebih besar dari 0.'
                    );
                }

                $account =
                    CashAccount::lockForUpdate()
                        ->findOrFail(
                            $account->id
                        );

                $before =
                    $this->getBalance($account);

                if ($before < $amount) {
                    throw new RuntimeException(
                        'Saldo kas tidak mencukupi.'
                    );
                }

                $after =
                    $before - $amount;

                return CashTransaction::create([
                    'cash_account_id' =>
                        $account->id,

                    'user_id' =>
                        $data['user_id']
                        ?? auth()->id(),

                    'transaction_type' =>
                        $data['transaction_type']
                        ?? 'expense',

                    'transaction_date' =>
                        $data['transaction_date']
                        ?? now(),

                    'reference_type' =>
                        $data['reference_type']
                        ?? null,

                    'reference_id' =>
                        $data['reference_id']
                        ?? null,

                    'reference_number' =>
                        $data['reference_number']
                        ?? null,

                    'amount' =>
                        -$amount,

                    'balance_before' =>
                        $before,

                    'balance_after' =>
                        $after,

                    'category' =>
                        $data['category']
                        ?? null,

                    'description' =>
                        $data['description']
                        ?? null,
                ]);
            }
        );
    }

    public function getBalance(
        CashAccount $account
    ): float {

        $last =
            $account->transactions()
                ->latest('id')
                ->first();

        return $last
            ? (float) $last->balance_after
            : (float) $account->opening_balance;
    }
}