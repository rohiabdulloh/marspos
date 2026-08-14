<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'phone',
        'email',
        'address',
        'payment_term',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'payment_term' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function purchaseReturns()
    {
        return $this->hasMany(PurchaseReturn::class);
    }

    public function payables()
    {
        return $this->hasMany(Payable::class);
    }

    public function payablePayments()
    {
        return $this->hasMany(PayablePayment::class);
    }
}
