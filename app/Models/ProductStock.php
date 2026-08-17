<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'batch_id',
        'quantity',
        'reserved_quantity',
        'average_cost',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:3',
            'reserved_quantity' => 'decimal:3',
            'average_cost' => 'decimal:2',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function batch()
    {
        return $this->belongsTo(ProductBatch::class, 'batch_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function getAvailableQuantityAttribute(): float
    {
        return max(
            0,
            (float) $this->quantity - (float) $this->reserved_quantity
        );
    }

    public function getStockValueAttribute(): float
    {
        return (float) $this->quantity * (float) $this->average_cost;
    }
}
