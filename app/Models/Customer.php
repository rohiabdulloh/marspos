<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'customer_type_id',
        'phone',
        'email',
        'address',
        'city',            
        'province',         
        'postal_code',     
        'credit_limit',
        'credit_term_days', 
        'notes',           
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'credit_limit' => 'decimal:2',
            'credit_term_days' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function customerType()
    {
        return $this->belongsTo(CustomerType::class);
    }
    
    public function saleReturns()
    {
        return $this->hasMany(SaleReturn::class);
    }

    public function receivables()
    {
        return $this->hasMany(Receivable::class);
    }

    public function receivablePayments()
    {
        return $this->hasMany(ReceivablePayment::class);
    }
}
