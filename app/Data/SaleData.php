<?php

namespace App\Data;

class SaleData
{
    /**
     * @param SaleItemData[] $items
     */
    public function __construct(
        public int $storeId,
        public int $warehouseId,
        public array $items,
        public ?int $customerId = null,
        public string $saleType = 'cash',
        public float $shippingCost = 0,
        public float $roundingAmount = 0,
        public float $paidAmount = 0,
        public ?string $transactionDate = null,
        public ?string $referenceNumber = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(
        array $data
    ): self {

        $items = array_map(
            fn (array $item) =>
                SaleItemData::fromArray($item),
            $data['items']
        );

        return new self(
            storeId:
                $data['store_id'],

            warehouseId:
                $data['warehouse_id'],

            items:
                $items,

            customerId:
                $data['customer_id'] ?? null,

            saleType:
                $data['sale_type']
                ?? 'cash',

            shippingCost:
                (float) (
                    $data['shipping_cost']
                    ?? 0
                ),

            roundingAmount:
                (float) (
                    $data['rounding_amount']
                    ?? 0
                ),

            paidAmount:
                (float) (
                    $data['paid_amount']
                    ?? 0
                ),

            transactionDate:
                $data['transaction_date']
                ?? null,

            referenceNumber:
                $data['reference_number']
                ?? null,

            notes:
                $data['notes']
                ?? null,
        );
    }
}