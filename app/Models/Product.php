<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'sku',
        'barcode',
        'description',
        'base_unit_id',
        'purchase_price',
        'selling_price',
        'minimum_stock',
        'is_active',
        'track_stock',
        'track_batch',
        'track_expiry',
    ];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'minimum_stock' => 'decimal:3',
            'is_active' => 'boolean',
            'track_stock' => 'boolean',
            'track_batch' => 'boolean',
            'track_expiry' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function baseUnit()
    {
        return $this->belongsTo(
            Unit::class,
            'base_unit_id'
        );
    }

    public function productUnits()
    {
        return $this->hasMany(ProductUnit::class);
    }

    public function units()
    {
        return $this->belongsToMany(
            Unit::class,
            'product_units'
        )
        ->withPivot([
            'conversion_factor',
            'is_base',
        ])
        ->withTimestamps();
    }

    public function prices()
    {
        return $this->hasMany(ProductPrice::class);
    }

    public function batches()
    {
        return $this->hasMany(ProductBatch::class);
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

    public function stockOpnameItems()
    {
        return $this->hasMany(StockOpnameItem::class);
    }

    public function stockTransferItems()
    {
        return $this->hasMany(StockTransferItem::class);
    }

    public function saleReturnItems()
    {
        return $this->hasMany(SaleReturnItem::class);
    }

    public function purchaseReturnItems()
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }

    public function discountProducts()
    {
        return $this->hasMany(DiscountProduct::class);
    }

    public function discounts()
    {
        return $this->belongsToMany(
            Discount::class,
            'discount_products'
        )
        ->withTimestamps();
    }

    public function promotionProducts()
    {
        return $this->hasMany(PromotionProduct::class);
    }

    public function promotions()
    {
        return $this->belongsToMany(
            Promotion::class,
            'promotion_products'
        )
        ->withTimestamps();
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
}
