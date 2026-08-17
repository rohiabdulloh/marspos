<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'supplier_invoice_number',
        'transaction_date',
        'store_id',
        'warehouse_id',
        'supplier_id',
        'user_id',
        'status',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'shipping_cost',
        'other_cost',
        'grand_total',
        'paid_amount',
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
            'other_cost' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
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

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
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
        return $this->hasMany(PurchaseItem::class);
    }

    public function payments()
    {
        return $this->hasMany(PurchasePayment::class);
    }

    public function returns()
    {
        return $this->hasMany(PurchaseReturn::class);
    }

    public function payable()
    {
        return $this->hasOne(Payable::class);
    }
}
