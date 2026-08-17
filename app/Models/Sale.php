<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'transaction_date',
        'store_id',
        'warehouse_id',
        'customer_id',
        'user_id',
        'sale_type',
        'status',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'shipping_cost',
        'rounding_amount',
        'grand_total',
        'paid_amount',
        'change_amount',
        'due_amount',
        'reference_number',
        'notes',
        'cancellation_reason',
        'cancelled_at',
        'cancelled_by',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'datetime',

            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'rounding_amount' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'change_amount' => 'decimal:2',
            'due_amount' => 'decimal:2',

            'cancelled_at' => 'datetime',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(
            User::class,
            'cancelled_by'
        );
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments()
    {
        return $this->hasMany(SalePayment::class);
    }

    public function returns()
    {
        return $this->hasMany(SaleReturn::class);
    }

    public function receivable()
    {
        return $this->hasOne(Receivable::class);
    }
}
