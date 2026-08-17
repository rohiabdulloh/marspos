<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function productUnits()
    {
        return $this->hasMany(ProductUnit::class);
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_units'
        )
        ->withPivot([
            'conversion_factor',
            'is_base',
        ])
        ->withTimestamps();
    }

    public function productPrices()
    {
        return $this->hasMany(ProductPrice::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
