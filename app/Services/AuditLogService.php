<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService
{
    public function create(
        string $action,
        ?string $modelType = null,
        ?int $modelId = null,
        array $oldValues = [],
        array $newValues = [],
        ?string $description = null
    ): AuditLog {

        return AuditLog::create([
            'user_id' =>
                auth()->id(),

            'action' =>
                $action,

            'model_type' =>
                $modelType,

            'model_id' =>
                $modelId,

            'old_values' =>
                empty($oldValues)
                    ? null
                    : $oldValues,

            'new_values' =>
                empty($newValues)
                    ? null
                    : $newValues,

            'description' =>
                $description,

            'ip_address' =>
                request()->ip(),

            'user_agent' =>
                request()->userAgent(),

            'created_at' =>
                now(),
        ]);
    }
}