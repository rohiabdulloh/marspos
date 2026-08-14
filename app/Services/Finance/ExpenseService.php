<?php

namespace App\Services\Finance;

use App\Models\Expense;
use App\Services\DocumentNumberService;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected CashService $cashService,
    ) {}

    public function create(array $data): Expense
    {
        return DB::transaction(
            function () use ($data) {

                $number =
                    $this->documentNumber->generate(
                        $data['store_id'],
                        'expense',
                        'EXP'
                    );

                $expense =
                    Expense::create([
                        'expense_number' =>
                            $number,

                        'expense_date' =>
                            $data['expense_date']
                            ?? now(),

                        'store_id' =>
                            $data['store_id'],

                        'cash_account_id' =>
                            $data['cash_account_id'],

                        'expense_category_id' =>
                            $data[
                                'expense_category_id'
                            ],

                        'user_id' =>
                            $data['user_id']
                            ?? auth()->id(),

                        'amount' =>
                            $data['amount'],

                        'reference_number' =>
                            $data[
                                'reference_number'
                            ] ?? null,

                        'description' =>
                            $data[
                                'description'
                            ] ?? null,

                        'attachment' =>
                            $data[
                                'attachment'
                            ] ?? null,

                        'status' =>
                            'paid',
                    ]);

                $this->cashService->withdraw(
                    $expense->cashAccount,
                    $expense->amount,
                    [
                        'transaction_type' =>
                            'expense',

                        'reference_type' =>
                            Expense::class,

                        'reference_id' =>
                            $expense->id,

                        'reference_number' =>
                            $expense
                                ->expense_number,

                        'category' =>
                            'expense',

                        'description' =>
                            $expense
                                ->description,

                        'user_id' =>
                            $expense->user_id,
                    ]
                );

                return $expense->load(
                    'category'
                );
            }
        );
    }
}