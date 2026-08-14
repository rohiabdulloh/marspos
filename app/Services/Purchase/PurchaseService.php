<?php

namespace App\Services\Purchase;

use App\Data\PurchaseData;
use App\Data\PurchaseItemData;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Services\AuditLogService;
use App\Services\DocumentNumberService;
use App\Services\Inventory\StockMovementService;
use App\Services\Inventory\StockService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class PurchaseService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected StockService $stockService,
        protected StockMovementService $movementService,
        protected AuditLogService $auditLog,
    ) {}

    /**
     * Membuat transaksi pembelian.
     */
    public function create(PurchaseData $data): Purchase
    {
        return DB::transaction(function () use ($data) {

            if (empty($data->items)) {
                throw new RuntimeException(
                    'Pembelian harus memiliki minimal satu produk.'
                );
            }

            /*
             * Generate nomor pembelian.
             */
            $invoiceNumber =
                $this->documentNumber->generate(
                    $data->storeId,
                    'purchase',
                    'PO'
                );

            /*
             * Buat header pembelian.
             */
            $purchase = Purchase::create([
                'invoice_number' =>
                    $invoiceNumber,

                'store_id' =>
                    $data->storeId,

                'warehouse_id' =>
                    $data->warehouseId,

                'supplier_id' =>
                    $data->supplierId,

                'user_id' =>
                    auth()->id(),

                'transaction_date' =>
                    $data->transactionDate
                    ?? now(),

                'supplier_invoice_number' =>
                    $data->supplierInvoiceNumber,

                'subtotal' =>
                    0,

                'discount_amount' =>
                    0,

                'tax_amount' =>
                    0,

                'shipping_cost' =>
                    $data->shippingCost,

                'other_cost' =>
                    $data->otherCost,

                'rounding_amount' =>
                    $data->roundingAmount,

                'total' =>
                    0,

                'paid_amount' =>
                    $data->paidAmount,

                'status' =>
                    'completed',

                'payment_status' =>
                    'unpaid',

                'notes' =>
                    $data->notes,
            ]);

            $subtotal = 0;
            $discountAmount = 0;
            $taxAmount = 0;

            /*
             * Proses item.
             */
            foreach ($data->items as $itemData) {

                $result =
                    $this->processItem(
                        $purchase,
                        $itemData,
                        $data->warehouseId
                    );

                $subtotal +=
                    $result['subtotal'];

                $discountAmount +=
                    $result['discount_amount'];

                $taxAmount +=
                    $result['tax_amount'];
            }

            /*
             * Total pembelian.
             */
            $total =
                $subtotal
                - $discountAmount
                + $taxAmount
                + $data->shippingCost
                + $data->otherCost
                + $data->roundingAmount;

            if ($total < 0) {
                $total = 0;
            }

            /*
             * Pembayaran.
             */
            $paidAmount = min(
                $data->paidAmount,
                $total
            );

            $paymentStatus = match (true) {
                $paidAmount <= 0 =>
                    'unpaid',

                $paidAmount < $total =>
                    'partial',

                default =>
                    'paid',
            };

            /*
             * Update header.
             */
            $purchase->update([
                'subtotal' =>
                    $subtotal,

                'discount_amount' =>
                    $discountAmount,

                'tax_amount' =>
                    $taxAmount,

                'total' =>
                    $total,

                'paid_amount' =>
                    $paidAmount,

                'payment_status' =>
                    $paymentStatus,
            ]);

            /*
             * Audit log.
             */
            $this->auditLog->create(
                action: 'create',
                modelType: Purchase::class,
                modelId: $purchase->id,
                newValues:
                    $purchase->fresh()->toArray(),
                description:
                    "Membuat transaksi pembelian {$invoiceNumber}"
            );

            return $purchase->fresh([
                'items',
                'supplier',
                'store',
                'warehouse',
            ]);
        });
    }

    /**
     * Proses satu item pembelian.
     */
    protected function processItem(
        Purchase $purchase,
        PurchaseItemData $itemData,
        int $warehouseId
    ): array {

        $product = Product::findOrFail(
            $itemData->productId
        );

        if ($itemData->quantity <= 0) {
            throw new RuntimeException(
                "Quantity produk {$product->name} tidak valid."
            );
        }

        if ($itemData->unitPrice < 0) {
            throw new RuntimeException(
                "Harga beli produk {$product->name} tidak valid."
            );
        }

        /*
         * Hitung subtotal.
         */
        $subtotal =
            $itemData->quantity *
            $itemData->unitPrice;

        /*
         * Diskon nominal.
         */
        $discountAmount =
            $itemData->discountAmount;

        /*
         * Jika menggunakan diskon persentase.
         */
        if (
            $itemData->discountPercentage > 0
        ) {
            $discountAmount =
                $subtotal *
                (
                    $itemData->discountPercentage
                    / 100
                );
        }

        $discountAmount = min(
            max(0, $discountAmount),
            $subtotal
        );

        /*
         * Pajak.
         *
         * PurchaseItemData saat ini
         * menerima taxAmount langsung.
         */
        $taxAmount =
            max(
                0,
                $itemData->taxAmount
            );

        /*
         * Total item.
         */
        $total =
            $subtotal
            - $discountAmount
            + $taxAmount;

        /*
         * Buat / ambil batch.
         */
        $batch = $this->resolveBatch(
            $purchase,
            $itemData
        );

        /*
         * Tambahkan stok.
         */
        $stockResult = $this->stockService->increase(
            product: $product,
            warehouseId: $warehouseId,
            quantity: $itemData->quantity,
            unitId: $itemData->unitId,
            batchId: $batch?->id,
            unitCost: $itemData->unitPrice
        );

        /*
         * Stock movement.
         */
        $this->movementService->record([
            'product_id' =>
                $product->id,
        
            'warehouse_id' =>
                $warehouseId,
        
            'unit_id' =>
                $itemData->unitId,
        
            'batch_id' =>
                $batch?->id,
        
            'movement_type' =>
                'purchase',
        
            'reference_type' =>
                Purchase::class,
        
            'reference_id' =>
                $purchase->id,
        
            'reference_number' =>
                $purchase->invoice_number,
        
            'quantity' =>
                $stockResult['quantity'],
        
            'base_quantity' =>
                $stockResult['base_quantity'],
        
            'conversion_factor' =>
                $stockResult['conversion_factor'],
        
            'before_quantity' =>
                $stockResult['before_quantity'],
        
            'after_quantity' =>
                $stockResult['after_quantity'],
        
            'unit_cost' =>
                $itemData->unitPrice,
        
            'total_cost' =>
                $itemData->unitPrice
                *
                $stockResult['base_quantity'],
        
            'user_id' =>
                auth()->id(),
        ]);

        /*
         * Simpan item pembelian.
         */
        PurchaseItem::create([
            'purchase_id' =>
                $purchase->id,

            'product_id' =>
                $product->id,

            'unit_id' =>
                $itemData->unitId,

            'batch_id' =>
                $batch?->id,

            'product_name' =>
                $product->name,

            'quantity' =>
                $itemData->quantity,

            'unit_price' =>
                $itemData->unitPrice,

            'subtotal' =>
                $subtotal,

            'discount_amount' =>
                $discountAmount,

            'tax_amount' =>
                $taxAmount,

            'total' =>
                $total,

            'notes' =>
                $itemData->notes,
        ]);

        return [
            'subtotal' =>
                $subtotal,

            'discount_amount' =>
                $discountAmount,

            'tax_amount' =>
                $taxAmount,

            'total' =>
                $total,
        ];
    }

    /**
     * Membuat atau mencari batch produk.
     */
    protected function resolveBatch(
        Purchase $purchase,
        PurchaseItemData $itemData
    ): ?ProductBatch {

        /*
         * Jika batch_id diberikan,
         * gunakan batch tersebut.
         */
        if ($itemData->batchId) {
            return ProductBatch::findOrFail(
                $itemData->batchId
            );
        }

        /*
         * Jika tidak ada nomor batch,
         * tidak perlu membuat batch.
         */
        if (!$itemData->batchNumber) {
            return null;
        }

        /*
         * Buat batch baru.
         */
        return ProductBatch::create([
            'product_id' =>
                $itemData->productId,

            'batch_number' =>
                $itemData->batchNumber,

            'production_date' =>
                $itemData->productionDate,

            'expiry_date' =>
                $itemData->expiryDate,

            'warehouse_id' =>
                $purchase->warehouse_id,

            'quantity' =>
                0,

            'status' =>
                'active',
        ]);
    }
}