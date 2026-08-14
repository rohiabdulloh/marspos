<?php

namespace App\Data\Payment;

class SalePaymentItemData
{
    public function __construct(
        public int $paymentMethodId,
        public float $amount,
        public ?string $referenceNumber = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(
        array $data
    ): self {
        return new self(
            paymentMethodId: (int) $data['payment_method_id'],
            amount: (float) $data['amount'],
            referenceNumber:
                $data['reference_number'] ?? null,
            notes:
                $data['notes'] ?? null,
        );
    }
}