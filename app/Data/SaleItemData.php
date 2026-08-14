<?php

namespace App\Data;

class SaleItemData
{
    public function __construct(
        public int $productId,
        public int $unitId,
        public float $quantity,
        public ?int $batchId = null,
        public ?float $unitPrice = null,
        public float $discountAmount = 0,
        public float $discountPercentage = 0,
        public ?float $taxPercentage = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(
        array $data
    ): self {
        return new self(
            productId: $data['product_id'],
            unitId: $data['unit_id'],
            quantity: (float) $data['quantity'],
            batchId: $data['batch_id'] ?? null,
            unitPrice:
                isset($data['unit_price'])
                    ? (float) $data['unit_price']
                    : null,
            discountAmount:
                (float) (
                    $data['discount_amount']
                    ?? 0
                ),
            discountPercentage:
                (float) (
                    $data['discount_percentage']
                    ?? 0
                ),
            taxPercentage:
                isset($data['tax_percentage'])
                    ? (float) $data['tax_percentage']
                    : null,
            notes:
                $data['notes'] ?? null,
        );
    }
}