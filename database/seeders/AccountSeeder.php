<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Account;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ASSETS
        $assets = Account::create([
            'code' => '1000',
            'name' => 'Assets',
            'type' => 'asset',
        ]);

        Account::create([
            'code' => '1100',
            'name' => 'Cash',
            'type' => 'asset',
            'parent_id' => $assets->id
        ]);

        Account::create([
            'code' => '1200',
            'name' => 'Bank',
            'type' => 'asset',
            'parent_id' => $assets->id
        ]);

        Account::create([
            'code' => '1300',
            'name' => 'Accounts Receivable',
            'type' => 'asset',
            'parent_id' => $assets->id
        ]);

        // LIABILITIES
        $liabilities = Account::create([
            'code' => '2000',
            'name' => 'Liabilities',
            'type' => 'liability',
        ]);

        Account::create([
            'code' => '2100',
            'name' => 'Accounts Payable',
            'type' => 'liability',
            'parent_id' => $liabilities->id
        ]);

        // EQUITY
        $equity = Account::create([
            'code' => '3000',
            'name' => 'Equity',
            'type' => 'equity',
        ]);

        Account::create([
            'code' => '3100',
            'name' => 'Owner Capital',
            'type' => 'equity',
            'parent_id' => $equity->id
        ]);

        // REVENUE
        $revenue = Account::create([
            'code' => '4000',
            'name' => 'Revenue',
            'type' => 'revenue',
        ]);

        Account::create([
            'code' => '4100',
            'name' => 'Sales Revenue',
            'type' => 'revenue',
            'parent_id' => $revenue->id
        ]);

        // EXPENSE
        $expense = Account::create([
            'code' => '5000',
            'name' => 'Expenses',
            'type' => 'expense',
        ]);

        Account::create([
            'code' => '5100',
            'name' => 'Salary Expense',
            'type' => 'expense',
            'parent_id' => $expense->id
        ]);

        Account::create([
            'code' => '5200',
            'name' => 'Office Expense',
            'type' => 'expense',
            'parent_id' => $expense->id
        ]);
        
    }
}
