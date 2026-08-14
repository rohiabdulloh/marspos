<?php

namespace App\Data;

class PurchaseData
{
    /**
     * @param PurchaseItemData[] $items
     */
    public function __construct(
        public int $storeId,
        public int $warehouseId,
        public int $supplierId,
        public array $items,
        public ?string $transactionDate = null,
        public ?string $supplierInvoiceNumber = null,
        public float $shippingCost = 0,
        public float $otherCost = 0,
        public float $roundingAmount = 0,
        public float $paidAmount = 0,
        public ?string $paymentMethod = null,
        public ?int $cashAccountId = null,
        public ?string $referenceNumber = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        $items = array_map(
            fn (array $item) =>
                PurchaseItemData::fromArray($item),
            $data['items']
        );

        return new self(
            storeId: (int) $data['store_id'],

            warehouseId: (int) $data['warehouse_id'],

            supplierId: (int) $data['supplier_id'],

            items: $items,

            transactionDate:
                $data['transaction_date']
                ?? null,

            supplierInvoiceNumber:
                $data['supplier_invoice_number']
                ?? null,

            shippingCost:
                (float) (
                    $data['shipping_cost']
                    ?? 0
                ),

            otherCost:
                (float) (
                    $data['other_cost']
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

            paymentMethod:
                $data['payment_method']
                ?? null,

            cashAccountId:
                isset($data['cash_account_id'])
                    ? (int) $data['cash_account_id']
                    : null,

            referenceNumber:
                $data['reference_number']
                ?? null,

            notes:
                $data['notes']
                ?? null,
        );
    }
}