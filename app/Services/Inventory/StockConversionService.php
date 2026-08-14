<?php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\ProductUnit;
use RuntimeException;

class StockConversionService
{
    public function getSellableUnit(
        Product $product,
        int $unitId
    ): ProductUnit {
        return ProductUnit::query()
            ->where('product_id', $product->id)
            ->where('unit_id', $unitId)
            ->where('is_sellable', true)
            ->firstOrFail();
    }

    public function getPurchasableUnit(
        Product $product,
        int $unitId
    ): ProductUnit {
        return ProductUnit::query()
            ->where('product_id', $product->id)
            ->where('unit_id', $unitId)
            ->where('is_purchasable', true)
            ->firstOrFail();
    }

    public function getConversionFactor(
        Product $product,
        int $unitId
    ): float {
        $productUnit = ProductUnit::query()
            ->where('product_id', $product->id)
            ->where('unit_id', $unitId)
            ->firstOrFail();

        $factor = (float) $productUnit->conversion_factor;

        if ($factor <= 0) {
            throw new RuntimeException(
                "Conversion factor produk {$product->name} tidak valid."
            );
        }

        return $factor;
    }

    public function toBaseQuantity(
        Product $product,
        int $unitId,
        float $quantity
    ): float {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        return $quantity *
            $this->getConversionFactor(
                $product,
                $unitId
            );
    }

    public function fromBaseQuantity(
        Product $product,
        int $unitId,
        float $baseQuantity
    ): float {
        if ($baseQuantity < 0) {
            throw new RuntimeException(
                'Base quantity tidak boleh negatif.'
            );
        }

        return $baseQuantity /
            $this->getConversionFactor(
                $product,
                $unitId
            );
    }
}