<?php

namespace App\Data\Payment;

class PurchasePaymentData
{
    /**
     * @param PurchasePaymentItemData[] $payments
     */
    public function __construct(
        public int $purchaseId,
        public array $payments,
        public ?string $paymentDate = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(
        array $data
    ): self {
        return new self(
            purchaseId:
                (int) $data['purchase_id'],

            payments: array_map(
                fn (array $payment) =>
                    PurchasePaymentItemData::fromArray(
                        $payment
                    ),
                $data['payments'] ?? []
            ),

            paymentDate:
                $data['payment_date'] ?? null,

            notes:
                $data['notes'] ?? null,
        );
    }
}