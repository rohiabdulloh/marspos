<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_number',
        'expense_date',
        'store_id',
        'cash_account_id',
        'expense_category_id',
        'user_id',
        'amount',
        'reference_number',
        'description',
        'attachment',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'datetime',
            'amount' => 'decimal:2',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function cashAccount()
    {
        return $this->belongsTo(CashAccount::class);
    }

    public function category()
    {
        return $this->belongsTo(
            ExpenseCategory::class,
            'expense_category_id'
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
