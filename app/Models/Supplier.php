<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address'
    ];

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function purchaseTransactions()
    {
        return $this->hasMany(Transaction::class)
            ->where('type', 'purchase');
    }

    public function getTotalPayableAttribute()
    {
        return $this->transactions()
            ->where('type', 'purchase')
            ->sum('total_credit');
    }

}
