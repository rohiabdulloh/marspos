<?php

namespace App\Services\Pricing;

class DiscountService
{
    public function calculate(
        float $subtotal,
        ?float $percentage = null,
        ?float $amount = null
    ): float {
        if ($amount !== null) {
            return min(
                max(0, $amount),
                $subtotal
            );
        }

        if ($percentage !== null) {
            $percentage = min(
                max(0, $percentage),
                100
            );

            return round(
                $subtotal * ($percentage / 100),
                2
            );
        }

        return 0;
    }

    public function calculatePercentage(
        float $subtotal,
        float $percentage
    ): float {
        return $this->calculate(
            $subtotal,
            $percentage,
            null
        );
    }

    public function calculateAmount(
        float $subtotal,
        float $amount
    ): float {
        return $this->calculate(
            $subtotal,
            null,
            $amount
        );
    }
}