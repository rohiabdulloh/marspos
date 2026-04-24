<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'parent_id',
        'is_active'
    ];

    protected $with = ['entries'];

    public function getTotalDebitAttribute()
    {
        return $this->entries->sum('debit');
    }

    public function getTotalCreditAttribute()
    {
        return $this->entries->sum('credit');
    }

    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
    
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
