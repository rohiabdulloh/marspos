<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'type',
        'buy_quantity',
        'get_quantity',
        'discount_value',
        'discount_type',
        'minimum_purchase',
        'start_at',
        'end_at',
        'usage_limit',
        'usage_count',
        'is_active',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'buy_quantity' => 'decimal:3',
            'get_quantity' => 'decimal:3',
            'discount_value' => 'decimal:2',
            'minimum_purchase' => 'decimal:2',
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'usage_limit' => 'integer',
            'usage_count' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_products'
        )
        ->withTimestamps();
    }

    public function promotionProducts()
    {
        return $this->hasMany(PromotionProduct::class);
    }
}
