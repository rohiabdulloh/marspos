<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'unit_id',
        'price_type',
        'price',
        'minimum_quantity',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'minimum_quantity' => 'decimal:3',
        'is_active' => 'boolean',
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
