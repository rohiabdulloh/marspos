<?php

namespace App\Services;

use App\Models\DocumentSequence;
use Illuminate\Support\Facades\DB;

class DocumentNumberService
{
    public function generate(
        int $storeId,
        string $documentType,
        string $prefix,
        ?string $period = null,
        int $padding = 6
    ): string {
        $period ??= now()->format('Ym');

        return DB::transaction(function () use (
            $storeId,
            $documentType,
            $prefix,
            $period,
            $padding
        ) {
            $sequence = DocumentSequence::lockForUpdate()
                ->where('store_id', $storeId)
                ->where('document_type', $documentType)
                ->where('period', $period)
                ->first();

            if (!$sequence) {
                $sequence = DocumentSequence::create([
                    'store_id' => $storeId,
                    'document_type' => $documentType,
                    'prefix' => $prefix,
                    'period' => $period,
                    'last_number' => 0,
                    'padding' => $padding,
                ]);
            }

            $sequence->increment('last_number');

            $number = str_pad(
                $sequence->last_number,
                $sequence->padding,
                '0',
                STR_PAD_LEFT
            );

            return "{$sequence->prefix}-{$sequence->period}-{$number}";
        });
    }
}