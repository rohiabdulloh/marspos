<?php

namespace App\Services\Purchase;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Services\DocumentNumberService;
use App\Services\Inventory\StockMovementService;
use App\Services\Inventory\StockService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PurchaseReturnService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected StockService $stockService,
        protected StockMovementService $movementService,
    ) {}

    public function create(
        Purchase $purchase,
        array $data
    ): PurchaseReturn {

        return DB::transaction(
            function () use (
                $purchase,
                $data
            ) {

                if (
                    $purchase->status === 'cancelled'
                ) {
                    throw new RuntimeException(
                        'Pembelian sudah dibatalkan.'
                    );
                }

                $number =
                    $this->documentNumber->generate(
                        $purchase->store_id,
                        'purchase_return',
                        'PR'
                    );

                $return =
                    PurchaseReturn::create([
                        'return_number' =>
                            $number,

                        'return_date' =>
                            $data['return_date']
                            ?? now(),

                        'purchase_id' =>
                            $purchase->id,

                        'store_id' =>
                            $purchase->store_id,

                        'warehouse_id' =>
                            $purchase->warehouse_id,

                        'supplier_id' =>
                            $purchase->supplier_id,

                        'user_id' =>
                            auth()->id(),

                        'status' =>
                            'completed',

                        'subtotal' =>
                            0,

                        'discount_amount' =>
                            0,

                        'tax_amount' =>
                            0,

                        'total' =>
                            0,

                        'refund_amount' =>
                            0,

                        'refund_method' =>
                            $data[
                                'refund_method'
                            ] ?? null,

                        'reason' =>
                            $data['reason']
                            ?? null,

                        'notes' =>
                            $data['notes']
                            ?? null,
                    ]);

                $subtotal = 0;

                foreach ($data['items'] as $item) {

                    $purchaseItem =
                        PurchaseItem::findOrFail(
                            $item[
                                'purchase_item_id'
                            ]
                        );

                    $quantity =
                        (float) $item[
                            'quantity'
                        ];

                    /*
                     * Hitung total yang
                     * sudah diretur sebelumnya.
                     */
                    $alreadyReturned =
                        (float)
                        $purchaseItem
                            ->returnItems()
                            ->sum(
                                'quantity'
                            );

                    $remaining =
                        (float)
                        $purchaseItem->quantity -
                        $alreadyReturned;

                    if ($quantity > $remaining) {
                        throw new RuntimeException(
                            "Jumlah retur {$purchaseItem->product_name} melebihi jumlah yang dapat diretur."
                        );
                    }

                    $conversionFactor =
                        (float)
                        $purchaseItem
                            ->conversion_factor;

                    $baseQuantity =
                        $quantity *
                        $conversionFactor;

                    $itemSubtotal =
                        $quantity *
                        (float)
                        $purchaseItem->unit_price;

                    $subtotal +=
                        $itemSubtotal;

                    PurchaseReturnItem::create([
                        'purchase_return_id' =>
                            $return->id,

                        'purchase_item_id' =>
                            $purchaseItem->id,

                        'product_id' =>
                            $purchaseItem
                                ->product_id,

                        'unit_id' =>
                            $purchaseItem
                                ->unit_id,

                        'batch_id' =>
                            $purchaseItem
                                ->batch_id
                                ?? null,

                        'product_name' =>
                            $purchaseItem
                                ->product_name,

                        'quantity' =>
                            $quantity,

                        'conversion_factor' =>
                            $conversionFactor,

                        'base_quantity' =>
                            $baseQuantity,

                        'unit_price' =>
                            $purchaseItem
                                ->unit_price,

                        'subtotal' =>
                            $itemSubtotal,

                        'discount_amount' =>
                            0,

                        'tax_amount' =>
                            0,

                        'total' =>
                            $itemSubtotal,

                        'reason' =>
                            $data['reason']
                            ?? null,
                    ]);

                    /*
                     * Kurangi stok.
                     */
                    $stock =
                        $this->stockService->decrease(
                            $purchaseItem->product,
                            $purchase
                                ->warehouse_id,
                            $baseQuantity,
                            $purchaseItem
                                ->batch_id
                                ?? null
                        );

                    $before =
                        (float)
                        $stock->quantity +
                        $baseQuantity;

                    $after =
                        (float)
                        $stock->quantity;

                    $this->movementService->record([
                        'product_id' =>
                            $purchaseItem
                                ->product_id,

                        'warehouse_id' =>
                            $purchase
                                ->warehouse_id,

                        'unit_id' =>
                            $purchaseItem
                                ->unit_id,

                        'batch_id' =>
                            $purchaseItem
                                ->batch_id
                                ?? null,

                        'movement_type' =>
                            'purchase_return',

                        'reference_type' =>
                            PurchaseReturn::class,

                        'reference_id' =>
                            $return->id,

                        'reference_number' =>
                            $return
                                ->return_number,

                        'quantity' =>
                            -$quantity,

                        'base_quantity' =>
                            -$baseQuantity,

                        'before_quantity' =>
                            $before,

                        'after_quantity' =>
                            $after,

                        'unit_cost' =>
                            $purchaseItem
                                ->unit_price,

                        'total_cost' =>
                            $purchaseItem
                                ->unit_price *
                            $baseQuantity,

                        'user_id' =>
                            auth()->id(),
                    ]);
                }

                $return->update([
                    'subtotal' =>
                        $subtotal,

                    'total' =>
                        $subtotal,

                    'refund_amount' =>
                        $subtotal,
                ]);

                return $return->load(
                    'items.product'
                );
            }
        );
    }
}