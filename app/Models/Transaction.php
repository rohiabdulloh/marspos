<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'type',
        'date',
        'reference',
        'amount',
        'journal_id'
    ];

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
