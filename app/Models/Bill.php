<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = [
        'bill_number',
        'date',
        'due_date',
        'total',
        'status',
        'supplier_id'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
