<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'key',
        'value',
        'type',
        'description',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function getTypedValueAttribute()
    {
        return match ($this->type) {
            'integer' => (int) $this->value,
            'decimal' => (float) $this->value,
            'boolean' => filter_var(
                $this->value,
                FILTER_VALIDATE_BOOLEAN
            ),
            'json' => json_decode(
                $this->value,
                true
            ),
            default => $this->value,
        };
    }
}
