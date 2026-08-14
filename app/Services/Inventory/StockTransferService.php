<?php

namespace App\Services\Inventory;

use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Product;
use App\Services\DocumentNumberService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockTransferService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected StockService $stockService,
        protected StockMovementService $movementService,
    ) {}

    public function create(array $data): StockTransfer
    {
        return DB::transaction(
            function () use ($data) {

                if (
                    $data['from_warehouse_id'] ===
                    $data['to_warehouse_id']
                ) {
                    throw new RuntimeException(
                        'Gudang asal dan tujuan tidak boleh sama.'
                    );
                }

                $number =
                    $this->documentNumber->generate(
                        $data['store_id'],
                        'stock_transfer',
                        'TRF'
                    );

                $transfer =
                    StockTransfer::create([
                        'transfer_number' =>
                            $number,

                        'transfer_date' =>
                            $data['transfer_date']
                            ?? now(),

                        'store_id' =>
                            $data['store_id'],

                        'from_warehouse_id' =>
                            $data[
                                'from_warehouse_id'
                            ],

                        'to_warehouse_id' =>
                            $data[
                                'to_warehouse_id'
                            ],

                        'user_id' =>
                            $data['user_id']
                            ?? auth()->id(),

                        'status' =>
                            'completed',

                        'notes' =>
                            $data['notes'] ?? null,
                    ]);

                foreach ($data['items'] as $item) {

                    $product =
                        Product::findOrFail(
                            $item['product_id']
                        );

                    $quantity =
                        (float) $item['quantity'];

                    $conversionFactor =
                        (float) (
                            $item[
                                'conversion_factor'
                            ] ?? 1
                        );

                    $baseQuantity =
                        $quantity *
                        $conversionFactor;

                    $this->stockService->decrease(
                        $product,
                        $data[
                            'from_warehouse_id'
                        ],
                        $baseQuantity,
                        $item['batch_id']
                            ?? null
                    );

                    $this->stockService->increase(
                        $product,
                        $data[
                            'to_warehouse_id'
                        ],
                        $baseQuantity,
                        $item['batch_id']
                            ?? null,
                        $item['unit_cost']
                            ?? $product
                                ->purchase_price
                    );

                    StockTransferItem::create([
                        'stock_transfer_id' =>
                            $transfer->id,

                        'product_id' =>
                            $product->id,

                        'unit_id' =>
                            $item['unit_id'],

                        'batch_id' =>
                            $item['batch_id']
                            ?? null,

                        'quantity' =>
                            $quantity,

                        'conversion_factor' =>
                            $conversionFactor,

                        'base_quantity' =>
                            $baseQuantity,

                        'unit_cost' =>
                            $item['unit_cost']
                            ?? $product
                                ->purchase_price,
                    ]);
                }

                return $transfer->load([
                    'items.product',
                    'fromWarehouse',
                    'toWarehouse',
                ]);
            }
        );
    }
}