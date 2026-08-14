<?php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockService
{
    public function __construct(
        protected StockConversionService $conversionService
    ) {}

    /**
     * Mendapatkan stock berdasarkan product,
     * warehouse dan batch.
     */
    public function getStock(
        Product $product,
        int $warehouseId,
        ?int $batchId = null
    ): ProductStock {
        $query = ProductStock::query()
            ->where('product_id', $product->id)
            ->where('warehouse_id', $warehouseId);

        if ($batchId !== null) {
            $query->where('batch_id', $batchId);
        } else {
            $query->whereNull('batch_id');
        }

        return $query->firstOrCreate(
            [
                'product_id' => $product->id,
                'warehouse_id' => $warehouseId,
                'batch_id' => $batchId,
            ],
            [
                'quantity' => 0,
                'reserved_quantity' => 0,
                'average_cost' => 0,
            ]
        );
    }

    /**
     * Menambah stok.
     *
     * Quantity menggunakan unit transaksi,
     * sedangkan quantity pada ProductStock
     * disimpan dalam base unit.
     */
    public function increase(
        Product $product,
        int $warehouseId,
        float $quantity,
        int $unitId,
        ?int $batchId = null,
        ?float $unitCost = null
    ): array {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        /*
         * Pastikan unit merupakan unit yang
         * dapat digunakan untuk pembelian.
         */
        $this->conversionService->getPurchasableUnit(
            $product,
            $unitId
        );

        $conversionFactor =
            $this->conversionService->getConversionFactor(
                $product,
                $unitId
            );

        /*
         * Konversi quantity transaksi
         * menjadi base quantity.
         */
        $baseQuantity =
            $quantity * $conversionFactor;

        /*
         * Harga beli per base unit.
         *
         * Contoh:
         * 1 Karung = 25 Kg
         * harga Karung = 250.000
         *
         * base cost = 10.000/Kg
         */
        $baseUnitCost = null;

        if ($unitCost !== null) {
            if ($unitCost < 0) {
                throw new RuntimeException(
                    'Harga unit tidak boleh negatif.'
                );
            }

            $baseUnitCost =
                $unitCost / $conversionFactor;
        }

        return DB::transaction(
            function () use (
                $product,
                $warehouseId,
                $quantity,
                $unitId,
                $batchId,
                $baseQuantity,
                $conversionFactor,
                $baseUnitCost
            ) {
                /*
                 * Ambil / buat stock record.
                 */
                $stock = $this->getStock(
                    $product,
                    $warehouseId,
                    $batchId
                );

                /*
                 * Lock record agar aman dari
                 * concurrent transaction.
                 */
                $stock = ProductStock::query()
                    ->where('id', $stock->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $beforeQuantity =
                    (float) $stock->quantity;

                $oldAverageCost =
                    (float) $stock->average_cost;

                /*
                 * Hitung average cost baru.
                 */
                $averageCost =
                    $oldAverageCost;

                if (
                    $baseUnitCost !== null &&
                    $baseQuantity > 0
                ) {
                    $oldStockValue =
                        $beforeQuantity *
                        $oldAverageCost;

                    $newStockValue =
                        $baseQuantity *
                        $baseUnitCost;

                    $newQuantity =
                        $beforeQuantity +
                        $baseQuantity;

                    if ($newQuantity > 0) {
                        $averageCost =
                            (
                                $oldStockValue +
                                $newStockValue
                            ) / $newQuantity;
                    } else {
                        $averageCost =
                            $baseUnitCost;
                    }
                }

                $afterQuantity =
                    $beforeQuantity +
                    $baseQuantity;

                $stock->update([
                    'quantity' =>
                        $afterQuantity,

                    'average_cost' =>
                        $averageCost,
                ]);

                return [
                    'stock' =>
                        $stock->fresh(),

                    'quantity' =>
                        $quantity,

                    'base_quantity' =>
                        $baseQuantity,

                    'conversion_factor' =>
                        $conversionFactor,

                    'before_quantity' =>
                        $beforeQuantity,

                    'after_quantity' =>
                        $afterQuantity,

                    'average_cost' =>
                        (float) $averageCost,

                    'base_unit_cost' =>
                        $baseUnitCost,
                ];
            }
        );
    }

    /**
     * Mengurangi stok.
     *
     * Quantity menggunakan unit transaksi,
     * sedangkan ProductStock menggunakan base unit.
     */
    public function decrease(
        Product $product,
        int $warehouseId,
        float $quantity,
        int $unitId,
        ?int $batchId = null
    ): array {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        /*
         * Pastikan unit merupakan unit yang
         * dapat digunakan untuk penjualan.
         */
        $this->conversionService->getSellableUnit(
            $product,
            $unitId
        );

        $conversionFactor =
            $this->conversionService->getConversionFactor(
                $product,
                $unitId
            );

        /*
         * Konversi quantity ke base unit.
         */
        $baseQuantity =
            $quantity * $conversionFactor;

        return DB::transaction(
            function () use (
                $product,
                $warehouseId,
                $quantity,
                $unitId,
                $batchId,
                $baseQuantity,
                $conversionFactor
            ) {
                /*
                 * Ambil stock.
                 */
                $stock = $this->getStock(
                    $product,
                    $warehouseId,
                    $batchId
                );

                /*
                 * Lock record.
                 */
                $stock = ProductStock::query()
                    ->where('id', $stock->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $beforeQuantity =
                    (float) $stock->quantity;

                $reservedQuantity =
                    (float) $stock->reserved_quantity;

                /*
                 * Stok yang benar-benar tersedia.
                 */
                $availableQuantity =
                    $beforeQuantity -
                    $reservedQuantity;

                if (
                    $availableQuantity < $baseQuantity
                ) {
                    throw new RuntimeException(
                        "Stok {$product->name} tidak mencukupi. " .
                        "Tersedia {$availableQuantity} " .
                        "base unit, membutuhkan {$baseQuantity}."
                    );
                }

                $afterQuantity =
                    $beforeQuantity -
                    $baseQuantity;

                $stock->update([
                    'quantity' =>
                        $afterQuantity,
                ]);

                return [
                    'stock' =>
                        $stock->fresh(),

                    'quantity' =>
                        $quantity,

                    'base_quantity' =>
                        $baseQuantity,

                    'conversion_factor' =>
                        $conversionFactor,

                    'before_quantity' =>
                        $beforeQuantity,

                    'after_quantity' =>
                        $afterQuantity,

                    'average_cost' =>
                        (float) $stock->average_cost,

                    'available_quantity' =>
                        $availableQuantity,
                ];
            }
        );
    }

    /**
     * Mendapatkan stok tersedia
     * dalam unit tertentu.
     */
    public function availableQuantity(
        Product $product,
        int $warehouseId,
        int $unitId,
        ?int $batchId = null
    ): float {
        /*
         * Pastikan unit valid untuk penjualan.
         */
        $this->conversionService->getSellableUnit(
            $product,
            $unitId
        );

        $stock = ProductStock::query()
            ->where('product_id', $product->id)
            ->where('warehouse_id', $warehouseId);

        if ($batchId !== null) {
            $stock->where('batch_id', $batchId);
        } else {
            $stock->whereNull('batch_id');
        }

        $stock = $stock->first();

        if (!$stock) {
            return 0;
        }

        $availableBaseQuantity =
            max(
                0,
                (float) $stock->quantity -
                (float) $stock->reserved_quantity
            );

        return $this->conversionService
            ->fromBaseQuantity(
                $product,
                $unitId,
                $availableBaseQuantity
            );
    }

    /**
     * Mendapatkan stok fisik
     * dalam base unit.
     */
    public function physicalQuantity(
        Product $product,
        int $warehouseId,
        ?int $batchId = null
    ): float {
        $stock = ProductStock::query()
            ->where('product_id', $product->id)
            ->where('warehouse_id', $warehouseId);

        if ($batchId !== null) {
            $stock->where('batch_id', $batchId);
        } else {
            $stock->whereNull('batch_id');
        }

        return (float) (
            $stock->value('quantity') ?? 0
        );
    }

    /**
     * Mendapatkan reserved quantity.
     */
    public function reservedQuantity(
        Product $product,
        int $warehouseId,
        ?int $batchId = null
    ): float {
        $stock = ProductStock::query()
            ->where('product_id', $product->id)
            ->where('warehouse_id', $warehouseId);

        if ($batchId !== null) {
            $stock->where('batch_id', $batchId);
        } else {
            $stock->whereNull('batch_id');
        }

        return (float) (
            $stock->value('reserved_quantity') ?? 0
        );
    }

    /**
     * Reserve stok.
     *
     * Berguna untuk:
     * - quotation
     * - sales order
     * - pesanan yang belum dibayar
     */
    public function reserve(
        Product $product,
        int $warehouseId,
        float $quantity,
        int $unitId,
        ?int $batchId = null
    ): array {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        $this->conversionService->getSellableUnit(
            $product,
            $unitId
        );

        $conversionFactor =
            $this->conversionService->getConversionFactor(
                $product,
                $unitId
            );

        $baseQuantity =
            $quantity * $conversionFactor;

        return DB::transaction(
            function () use (
                $product,
                $warehouseId,
                $quantity,
                $unitId,
                $batchId,
                $baseQuantity,
                $conversionFactor
            ) {
                $stock = $this->getStock(
                    $product,
                    $warehouseId,
                    $batchId
                );

                $stock = ProductStock::query()
                    ->where('id', $stock->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $physical =
                    (float) $stock->quantity;

                $reserved =
                    (float) $stock->reserved_quantity;

                $available =
                    $physical - $reserved;

                if ($available < $baseQuantity) {
                    throw new RuntimeException(
                        "Stok {$product->name} tidak cukup untuk di-reserve."
                    );
                }

                $stock->update([
                    'reserved_quantity' =>
                        $reserved +
                        $baseQuantity,
                ]);

                return [
                    'stock' =>
                        $stock->fresh(),

                    'quantity' =>
                        $quantity,

                    'base_quantity' =>
                        $baseQuantity,

                    'conversion_factor' =>
                        $conversionFactor,

                    'reserved_quantity' =>
                        $stock->reserved_quantity,
                ];
            }
        );
    }

    /**
     * Membatalkan reservation.
     */
    public function releaseReservation(
        Product $product,
        int $warehouseId,
        float $quantity,
        int $unitId,
        ?int $batchId = null
    ): array {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        $conversionFactor =
            $this->conversionService->getConversionFactor(
                $product,
                $unitId
            );

        $baseQuantity =
            $quantity * $conversionFactor;

        return DB::transaction(
            function () use (
                $product,
                $warehouseId,
                $quantity,
                $batchId,
                $baseQuantity,
                $conversionFactor
            ) {
                $stock = $this->getStock(
                    $product,
                    $warehouseId,
                    $batchId
                );

                $stock = ProductStock::query()
                    ->where('id', $stock->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $reserved =
                    (float) $stock->reserved_quantity;

                if ($baseQuantity > $reserved) {
                    throw new RuntimeException(
                        'Jumlah release melebihi reserved stock.'
                    );
                }

                $newReserved =
                    $reserved -
                    $baseQuantity;

                $stock->update([
                    'reserved_quantity' =>
                        $newReserved,
                ]);

                return [
                    'stock' =>
                        $stock->fresh(),

                    'quantity' =>
                        $quantity,

                    'base_quantity' =>
                        $baseQuantity,

                    'conversion_factor' =>
                        $conversionFactor,

                    'reserved_quantity' =>
                        $newReserved,
                ];
            }
        );
    }

    /**
     * Menyesuaikan stok secara manual.
     *
     * Digunakan untuk stock opname.
     */
    public function adjust(
        Product $product,
        int $warehouseId,
        float $newQuantity,
        ?int $batchId = null
    ): array {
        if ($newQuantity < 0) {
            throw new RuntimeException(
                'Quantity stok tidak boleh negatif.'
            );
        }

        return DB::transaction(
            function () use (
                $product,
                $warehouseId,
                $newQuantity,
                $batchId
            ) {
                $stock = $this->getStock(
                    $product,
                    $warehouseId,
                    $batchId
                );

                $stock = ProductStock::query()
                    ->where('id', $stock->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $beforeQuantity =
                    (float) $stock->quantity;

                $reservedQuantity =
                    (float) $stock->reserved_quantity;

                if (
                    $newQuantity <
                    $reservedQuantity
                ) {
                    throw new RuntimeException(
                        'Stok baru tidak boleh lebih kecil dari reserved quantity.'
                    );
                }

                $difference =
                    $newQuantity -
                    $beforeQuantity;

                $stock->update([
                    'quantity' =>
                        $newQuantity,
                ]);

                return [
                    'stock' =>
                        $stock->fresh(),

                    'before_quantity' =>
                        $beforeQuantity,

                    'after_quantity' =>
                        $newQuantity,

                    'difference' =>
                        $difference,

                    'reserved_quantity' =>
                        $reservedQuantity,
                ];
            }
        );
    }
}