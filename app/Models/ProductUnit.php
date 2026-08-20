<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductUnit extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'unit_id',
        'conversion_factor',
        'purchase_price',
        'selling_price',
        'is_purchase_unit',
        'is_sale_unit',
        'is_default',
    ];

    protected $casts = [
        'conversion_factor' => 'decimal:3',
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'is_purchase_unit' => 'boolean',
        'is_sale_unit' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
