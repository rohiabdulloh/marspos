<?php

namespace App\Services\Pricing;

use App\Models\Product;
use App\Models\Customer;
use RuntimeException;

class PricingService
{
    public function __construct(
        protected ProductPriceService $priceService,
        protected DiscountService $discountService,
        protected PromotionService $promotionService,
    ) {}

    public function calculateItem(
        Product $product,
        int $unitId,
        float $quantity,
        ?Customer $customer = null,
        array $discount = []
    ): array {

        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity harus lebih besar dari 0.'
            );
        }

        $unitPrice =
            $this->priceService->getPrice(
                $product,
                $unitId,
                $customer,
                $quantity
            );

        $subtotal =
            $unitPrice * $quantity;

        /*
         * Diskon manual.
         */
        $manualDiscount =
            $this->discountService->calculate(
                $subtotal,
                $discount['percentage']
                    ?? null,
                $discount['amount']
                    ?? null
            );

        /*
         * Diskon promo.
         */
        $promotionDiscount =
            $this->promotionService->getDiscount(
                $product,
                $quantity,
                $subtotal -
                    $manualDiscount,
                $customer
            );

        $totalDiscount =
            min(
                $subtotal,
                $manualDiscount +
                $promotionDiscount
            );

        $afterDiscount =
            $subtotal -
            $totalDiscount;

        /*
         * Pajak bisa dikembangkan
         * menggunakan TaxService.
         */
        $taxPercentage =
            (float) (
                $discount['tax_percentage']
                ?? 0
            );

        $taxAmount =
            round(
                $afterDiscount *
                ($taxPercentage / 100),
                2
            );

        $total =
            $afterDiscount +
            $taxAmount;

        return [
            'unit_price' =>
                $unitPrice,

            'quantity' =>
                $quantity,

            'subtotal' =>
                $subtotal,

            'discount_amount' =>
                $totalDiscount,

            'promotion_discount' =>
                $promotionDiscount,

            'tax_percentage' =>
                $taxPercentage,

            'tax_amount' =>
                $taxAmount,

            'total' =>
                $total,
        ];
    }
}