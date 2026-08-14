<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentSquence extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'document_type',
        'prefix',
        'period',
        'last_number',
        'padding',
    ];

    protected function casts(): array
    {
        return [
            'last_number' => 'integer',
            'padding' => 'integer',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
