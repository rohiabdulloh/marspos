<?php

namespace App\Services\Pricing;

use App\Models\Product;
use App\Models\Customer;

class PromotionService
{
    public function getDiscount(
        Product $product,
        float $quantity,
        float $subtotal,
        ?Customer $customer = null
    ): float {
        /*
         * Tempat untuk mengambil promotion
         * aktif dari database.
         *
         * Untuk sementara return 0.
         */

        return 0;
    }
}