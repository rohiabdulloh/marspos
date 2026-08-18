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
        'city',
        'province',
        'postal_code',
        'contact_person',
        'payment_term_days',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'payment_term_days' => 'integer',
    ];

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
