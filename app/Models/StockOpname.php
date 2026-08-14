<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    use HasFactory;

    protected $fillable = [
        'opname_number',
        'opname_date',
        'store_id',
        'warehouse_id',
        'user_id',
        'status',
        'notes',
        'completed_at',
        'completed_by',
    ];

    protected function casts(): array
    {
        return [
            'opname_date' => 'datetime',
            'completed_at' => 'datetime',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function completedBy()
    {
        return $this->belongsTo(
            User::class,
            'completed_by'
        );
    }

    public function items()
    {
        return $this->hasMany(StockOpnameItem::class);
    }
}
