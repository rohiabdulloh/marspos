<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'parent_id',
        'is_active'
    ];

    // Relasi ke parent (hierarki akun)
    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    // Relasi ke child akun
    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    // Relasi ke journal entries
    public function journalEntries()
    {
        return $this->hasMany(JournalEntry::class);
    }
}
