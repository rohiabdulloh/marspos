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
        'base_unit_id',
        'sku',
        'barcode',
        'name',
        'type',
        'description',
        'purchase_price',
        'selling_price',
        'minimum_stock',
        'maximum_stock',
        'has_batch',
        'has_expiry',
        'image',
        'is_active',
    ];

    protected $casts = [
        'has_batch' => 'boolean',
        'has_expiry' => 'boolean',
        'is_active' => 'boolean',
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'minimum_stock' => 'decimal:3',
        'maximum_stock' => 'decimal:3',
    ];

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
            'product_units',
            'product_id',
            'unit_id'
        )
        ->using(ProductUnit::class) 
        ->withPivot([
            'id',
            'conversion_factor',
            'purchase_price',
            'selling_price',
            'is_purchase_unit',
            'is_sale_unit',
            'is_default',
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
