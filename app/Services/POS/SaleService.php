<?php

namespace App\Services\POS;

use App\Data\SaleData;
use App\Data\SaleItemData;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Services\AuditLogService;
use App\Services\DocumentNumberService;
use App\Services\Inventory\StockMovementService;
use App\Services\Inventory\StockService;
use App\Services\Pricing\PricingService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SaleService
{
    public function __construct(
        protected DocumentNumberService $documentNumber,
        protected StockService $stockService,
        protected StockMovementService $movementService,
        protected PricingService $pricingService,
        protected AuditLogService $auditLog,
    ) {}

    /**
     * Membuat transaksi penjualan.
     */
    public function create(SaleData $data): Sale
    {
        return DB::transaction(function () use ($data) {

            $customer = $data->customerId
                ? Customer::findOrFail($data->customerId)
                : null;

            /*
             * Validasi minimal item.
             */
            if (empty($data->items)) {
                throw new RuntimeException(
                    'Transaksi harus memiliki minimal satu produk.'
                );
            }

            /*
             * Generate nomor invoice.
             */
            $invoiceNumber = $this->documentNumber->generate(
                $data->storeId,
                'sale',
                'INV'
            );

            /*
             * Buat header transaksi terlebih dahulu.
             */
            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,

                'store_id' => $data->storeId,

                'warehouse_id' => $data->warehouseId,

                'customer_id' => $data->customerId,

                'user_id' => auth()->id(),

                'sale_type' => $data->saleType,

                'transaction_date' =>
                    $data->transactionDate ?? now(),

                'reference_number' =>
                    $data->referenceNumber,

                'subtotal' => 0,

                'discount_amount' => 0,

                'tax_amount' => 0,

                'shipping_cost' =>
                    $data->shippingCost,

                'rounding_amount' =>
                    $data->roundingAmount,

                'total' => 0,

                'paid_amount' =>
                    $data->paidAmount,

                'change_amount' => 0,

                'status' => 'completed',

                'payment_status' => 'unpaid',

                'notes' => $data->notes,
            ]);

            $subtotal = 0;
            $discountAmount = 0;
            $taxAmount = 0;

            /*
             * Proses item satu per satu.
             */
            foreach ($data->items as $itemData) {

                $result = $this->processItem(
                    $sale,
                    $itemData,
                    $customer,
                    $data->warehouseId
                );

                $subtotal += $result['subtotal'];

                $discountAmount +=
                    $result['discount_amount'];

                $taxAmount +=
                    $result['tax_amount'];
            }

            /*
             * Hitung total transaksi.
             */
            $total =
                $subtotal
                - $discountAmount
                + $taxAmount
                + $data->shippingCost
                + $data->roundingAmount;

            if ($total < 0) {
                $total = 0;
            }

            /*
             * Hitung status pembayaran.
             */
            $paidAmount = min(
                $data->paidAmount,
                $total
            );

            $changeAmount = max(
                0,
                $data->paidAmount - $total
            );

            $paymentStatus = match (true) {
                $paidAmount <= 0 => 'unpaid',
                $paidAmount < $total => 'partial',
                default => 'paid',
            };

            /*
             * Update header.
             */
            $sale->update([
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

                'change_amount' =>
                    $changeAmount,

                'payment_status' =>
                    $paymentStatus,
            ]);

            /*
             * Audit log.
             */
            $this->auditLog->create(
                action: 'create',
                modelType: Sale::class,
                modelId: $sale->id,
                newValues: $sale->fresh()->toArray(),
                description:
                    "Membuat transaksi penjualan {$invoiceNumber}"
            );

            return $sale->fresh([
                'items',
                'customer',
                'store',
                'warehouse',
            ]);
        });
    }

    /**
     * Proses satu item penjualan.
     */
    protected function processItem(
        Sale $sale,
        SaleItemData $itemData,
        ?Customer $customer,
        int $warehouseId
    ): array {

        $product = Product::findOrFail(
            $itemData->productId
        );

        /*
         * Pastikan quantity valid.
         */
        if ($itemData->quantity <= 0) {
            throw new RuntimeException(
                "Quantity produk {$product->name} tidak valid."
            );
        }

        /*
         * Hitung harga melalui PricingService.
         */
        $pricing = $this->pricingService->calculateItem(
            product: $product,

            unitId: $itemData->unitId,

            quantity: $itemData->quantity,

            customer: $customer,

            discount: [
                'amount' =>
                    $itemData->discountAmount,

                'percentage' =>
                    $itemData->discountPercentage,

                'tax_percentage' =>
                    $itemData->taxPercentage,
            ]
        );

        /*
         * Quantity stok.
         *
         * StockService yang bertanggung
         * jawab terhadap konversi unit.
         */
        $stockResult = $this->stockService->decrease(
            product: $product,
            warehouseId: $warehouseId,
            quantity: $itemData->quantity,
            unitId: $itemData->unitId,
            batchId: $itemData->batchId
        );

        /*
         * Catat stock movement.
         */
        $this->movementService->record([
            'product_id' =>
                $product->id,
        
            'warehouse_id' =>
                $warehouseId,
        
            'unit_id' =>
                $itemData->unitId,
        
            'batch_id' =>
                $itemData->batchId,
        
            'movement_type' =>
                'sale',
        
            'reference_type' =>
                Sale::class,
        
            'reference_id' =>
                $sale->id,
        
            'reference_number' =>
                $sale->invoice_number,
        
            'quantity' =>
                -$stockResult['quantity'],
        
            'base_quantity' =>
                -$stockResult['base_quantity'],
        
            'conversion_factor' =>
                $stockResult['conversion_factor'],
        
            'before_quantity' =>
                $stockResult['before_quantity'],
        
            'after_quantity' =>
                $stockResult['after_quantity'],
        
            'unit_cost' =>
                $product->cost_price ?? 0,
        
            'total_cost' =>
                ($product->cost_price ?? 0)
                * $stockResult['base_quantity'],
        
            'user_id' =>
                auth()->id(),
        ]);

        /*
         * Simpan item.
         */
        SaleItem::create([
            'sale_id' =>
                $sale->id,

            'product_id' =>
                $product->id,

            'unit_id' =>
                $itemData->unitId,

            'batch_id' =>
                $itemData->batchId,

            'product_name' =>
                $product->name,

            'quantity' =>
                $itemData->quantity,

            'unit_price' =>
                $pricing['unit_price'],

            'subtotal' =>
                $pricing['subtotal'],

            'discount_amount' =>
                $pricing['discount_amount'],

            'tax_percentage' =>
                $pricing['tax_percentage'],

            'tax_amount' =>
                $pricing['tax_amount'],

            'total' =>
                $pricing['total'],

            'notes' =>
                $itemData->notes,
        ]);

        return $pricing;
    }
}