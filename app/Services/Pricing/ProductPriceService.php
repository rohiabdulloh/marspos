<?php

namespace App\Services\Pricing;

use App\Models\ProductPrice;
use App\Models\Product;
use App\Models\Customer;
use RuntimeException;

class ProductPriceService
{
    public function getPrice(
        Product $product,
        int $unitId,
        ?Customer $customer = null,
        float $quantity = 1
    ): float {
        $query = ProductPrice::query()
            ->where('product_id', $product->id)
            ->where('unit_id', $unitId)
            ->where('is_active', true)
            ->where(function ($query) {
                $query
                    ->whereNull('start_date')
                    ->orWhereDate(
                        'start_date',
                        '<=',
                        now()
                    );
            })
            ->where(function ($query) {
                $query
                    ->whereNull('end_date')
                    ->orWhereDate(
                        'end_date',
                        '>=',
                        now()
                    );
            });

        $prices = $query
            ->orderByDesc('priority')
            ->get();

        if ($prices->isEmpty()) {
            throw new RuntimeException(
                "Harga produk {$product->name} tidak ditemukan."
            );
        }

        /*
         * Jika customer memiliki price level,
         * gunakan harga tersebut.
         */
        if ($customer && $customer->price_type) {
            $customerPrice = $prices->firstWhere(
                'price_type',
                $customer->price_type
            );

            if ($customerPrice) {
                return $this->applyQuantityPrice(
                    $customerPrice,
                    $quantity
                );
            }
        }

        /*
         * Default retail.
         */
        $price = $prices->firstWhere(
            'price_type',
            'retail'
        );

        if (!$price) {
            $price = $prices->first();
        }

        return $this->applyQuantityPrice(
            $price,
            $quantity
        );
    }

    protected function applyQuantityPrice(
        ProductPrice $price,
        float $quantity
    ): float {
        /*
         * Jika ProductPrice memiliki
         * minimum_quantity.
         */
        if (
            isset($price->minimum_quantity) &&
            $quantity < $price->minimum_quantity
        ) {
            return (float) $price->price;
        }

        return (float) $price->price;
    }
}