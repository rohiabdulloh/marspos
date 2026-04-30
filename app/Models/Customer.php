<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address'
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }    

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
    
    public function getTotalTransactionAttribute()
    {
        return $this->transactions()->sum('total_debit');
    }

    public function salesTransactions()
    {
        return $this->hasMany(Transaction::class)
            ->where('type', 'sales');
    }
}