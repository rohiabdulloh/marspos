<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Bill;

class PaymentStatusService
{
    public function sync(Payment $payment)
    {
        if ($payment->invoice_id) {
            $this->updateInvoice($payment);
        }

        if ($payment->bill_id) {
            $this->updateBill($payment);
        }
    }

    private function updateInvoice(Payment $payment)
    {
        $invoice = Invoice::find($payment->invoice_id);

        $paid = Payment::where('invoice_id', $invoice->id)
            ->sum('amount');

        if ($paid >= $invoice->total) {
            $invoice->status = 'paid';
        } elseif ($paid > 0) {
            $invoice->status = 'sent'; // atau partial
        } else {
            $invoice->status = 'draft';
        }

        $invoice->save();
    }

    private function updateBill(Payment $payment)
    {
        $bill = Bill::find($payment->bill_id);

        $paid = Payment::where('bill_id', $bill->id)
            ->sum('amount');

        if ($paid >= $bill->total) {
            $bill->status = 'paid';
        } elseif ($paid > 0) {
            $bill->status = 'unpaid';
        } else {
            $bill->status = 'draft';
        }

        $bill->save();
    }
}