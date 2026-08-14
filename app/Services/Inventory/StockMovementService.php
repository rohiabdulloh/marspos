<?php

namespace App\Services\Inventory;

use App\Models\StockMovement;

class StockMovementService
{
    public function record(array $data): StockMovement
    {
        return StockMovement::create([
            'product_id' => $data['product_id'],
            'warehouse_id' => $data['warehouse_id'],
            'unit_id' => $data['unit_id'] ?? null,
            'batch_id' => $data['batch_id'] ?? null,

            'movement_type' => $data['movement_type'],

            'reference_type' =>
                $data['reference_type'] ?? null,

            'reference_id' =>
                $data['reference_id'] ?? null,

            'reference_number' =>
                $data['reference_number'] ?? null,

            'quantity' =>
                $data['quantity'],

            'base_quantity' =>
                $data['base_quantity'],

            'before_quantity' =>
                $data['before_quantity'],

            'after_quantity' =>
                $data['after_quantity'],

            'unit_cost' =>
                $data['unit_cost'] ?? 0,

            'total_cost' =>
                $data['total_cost'] ?? 0,

            'user_id' =>
                $data['user_id'] ?? auth()->id(),

            'movement_date' =>
                $data['movement_date'] ?? now(),

            'notes' =>
                $data['notes'] ?? null,
        ]);
    }
}