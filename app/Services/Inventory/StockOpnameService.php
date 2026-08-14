<?php

namespace App\Services\Inventory;

use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Models\Product;
use App\Services\DocumentNumberService;
use Illuminate\Support\Facades\DB;

class StockOpnameService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected StockService $stockService,
        protected StockMovementService $movementService,
    ) {}

    public function create(array $data): StockOpname
    {
        return DB::transaction(
            function () use ($data) {

                $number =
                    $this->documentNumber->generate(
                        $data['store_id'],
                        'stock_opname',
                        'OPN'
                    );

                $opname =
                    StockOpname::create([
                        'opname_number' =>
                            $number,

                        'opname_date' =>
                            $data['opname_date']
                            ?? now(),

                        'store_id' =>
                            $data['store_id'],

                        'warehouse_id' =>
                            $data['warehouse_id'],

                        'user_id' =>
                            $data['user_id']
                            ?? auth()->id(),

                        'status' =>
                            'completed',

                        'notes' =>
                            $data['notes'] ?? null,

                        'completed_at' =>
                            now(),

                        'completed_by' =>
                            auth()->id(),
                    ]);

                foreach ($data['items'] as $item) {

                    $product =
                        Product::findOrFail(
                            $item['product_id']
                        );

                    $systemQuantity =
                        $this->stockService->getStock(
                            $product->id,
                            $data['warehouse_id'],
                            $item['batch_id']
                                ?? null
                        );

                    $physicalQuantity =
                        (float) $item[
                            'physical_quantity'
                        ];

                    $difference =
                        $physicalQuantity -
                        $systemQuantity;

                    $unitCost =
                        (float) (
                            $item['unit_cost']
                            ?? $product
                                ->purchase_price
                        );

                    $differenceValue =
                        $difference *
                        $unitCost;

                    StockOpnameItem::create([
                        'stock_opname_id' =>
                            $opname->id,

                        'product_id' =>
                            $product->id,

                        'unit_id' =>
                            $item['unit_id'],

                        'batch_id' =>
                            $item['batch_id']
                            ?? null,

                        'system_quantity' =>
                            $systemQuantity,

                        'physical_quantity' =>
                            $physicalQuantity,

                        'difference_quantity' =>
                            $difference,

                        'unit_cost' =>
                            $unitCost,

                        'difference_value' =>
                            $differenceValue,

                        'notes' =>
                            $item['notes'] ?? null,
                    ]);

                    if ($difference > 0) {

                        $this->stockService->increase(
                            $product,
                            $data['warehouse_id'],
                            $difference,
                            $item['batch_id']
                                ?? null,
                            $unitCost
                        );

                    } elseif ($difference < 0) {

                        $this->stockService->decrease(
                            $product,
                            $data['warehouse_id'],
                            abs($difference),
                            $item['batch_id']
                                ?? null
                        );
                    }

                    if ($difference != 0) {

                        $this->movementService->record([
                            'product_id' =>
                                $product->id,

                            'warehouse_id' =>
                                $data[
                                    'warehouse_id'
                                ],

                            'unit_id' =>
                                $item['unit_id'],

                            'batch_id' =>
                                $item['batch_id']
                                ?? null,

                            'movement_type' =>
                                'opname',

                            'reference_type' =>
                                StockOpname::class,

                            'reference_id' =>
                                $opname->id,

                            'reference_number' =>
                                $opname
                                    ->opname_number,

                            'quantity' =>
                                $difference,

                            'base_quantity' =>
                                $difference,

                            'before_quantity' =>
                                $systemQuantity,

                            'after_quantity' =>
                                $physicalQuantity,

                            'unit_cost' =>
                                $unitCost,

                            'total_cost' =>
                                abs($difference) *
                                $unitCost,

                            'user_id' =>
                                $opname->user_id,
                        ]);
                    }
                }

                return $opname->load(
                    'items.product'
                );
            }
        );
    }
}