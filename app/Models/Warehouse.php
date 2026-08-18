<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'code',
        'name',
        'phone',
        'address',
        'is_main',
        'is_active',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function stockOpnames()
    {
        return $this->hasMany(StockOpname::class);
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(
            StockTransfer::class,
            'from_warehouse_id'
        );
    }

    public function incomingTransfers()
    {
        return $this->hasMany(
            StockTransfer::class,
            'to_warehouse_id'
        );
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
}
