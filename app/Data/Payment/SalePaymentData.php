<?php

namespace App\Data\Payment;

class SalePaymentData
{
    /**
     * @param SalePaymentItemData[] $payments
     */
    public function __construct(
        public int $saleId,
        public array $payments,
        public float $cashReceived = 0,
        public ?string $paymentDate = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(
        array $data
    ): self {
        return new self(
            saleId: (int) $data['sale_id'],

            payments: array_map(
                fn (array $payment) =>
                    SalePaymentItemData::fromArray(
                        $payment
                    ),
                $data['payments'] ?? []
            ),

            cashReceived:
                (float) (
                    $data['cash_received'] ?? 0
                ),

            paymentDate:
                $data['payment_date'] ?? null,

            notes:
                $data['notes'] ?? null,
        );
    }
}