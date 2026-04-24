<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'type',
        'date',
        'amount',
        'customer_id',
        'supplier_id',
        'journal_id'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
