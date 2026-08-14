<?php

namespace App\Data;

class PurchaseItemData
{
    public function __construct(
        public int $productId,
        public int $unitId,
        public float $quantity,
        public float $unitPrice,
        public ?int $batchId = null,
        public ?string $batchNumber = null,
        public ?string $productionDate = null,
        public ?string $expiryDate = null,
        public float $discountAmount = 0,
        public float $discountPercentage = 0,
        public float $taxAmount = 0,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: (int) $data['product_id'],

            unitId: (int) $data['unit_id'],

            quantity: (float) $data['quantity'],

            unitPrice: (float) $data['unit_price'],

            batchId: isset($data['batch_id'])
                ? (int) $data['batch_id']
                : null,

            batchNumber:
                $data['batch_number'] ?? null,

            productionDate:
                $data['production_date'] ?? null,

            expiryDate:
                $data['expiry_date'] ?? null,

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

            taxAmount:
                (float) (
                    $data['tax_amount']
                    ?? 0
                ),

            notes:
                $data['notes'] ?? null,
        );
    }
}