<?php
namespace App\Services;

use App\Models\Payment;
use App\Models\Journal;
use App\Models\JournalEntry;
use DB;

class PaymentJournalService
{
    public function syncJournal(Payment $payment)
    {
        return DB::transaction(function () use ($payment) {
            Journal::where('payment_id', $payment->id)
                ->where('status', 'posted')
                ->update(['status' => 'void']);

            return $this->createJournal($payment);
        });
    }
    
    public function voidJournal(Payment $payment)
    {
        Journal::where('payment_id', $payment->id)
            ->where('status', 'posted')
            ->update([
                'status' => 'void'
            ]);
    }

    public function createJournal(Payment $payment)
    {
        return DB::transaction(function () use ($payment) {

            $journal = Journal::create([
                'payment_id' => $payment->id, // 🔥 WAJIB
                'date' => $payment->date,
                'reference' => $payment->reference,
                'description' => 'Payment #' . $payment->id,
                'status' => 'posted',
            ]);

            // =========================
            // RECEIVE (Customer bayar)
            // =========================
            if ($payment->type === 'receive') {

                // CASH / BANK (DEBIT)
                $this->entry($journal->id, $payment->account_id, $payment->amount, 0);

                // ACCOUNTS RECEIVABLE (CREDIT)
                $this->entry($journal->id, $this->getReceivableAccount(), 0, $payment->amount);
            }

            // =========================
            // PAY (Bayar supplier)
            // =========================
            if ($payment->type === 'pay') {

                // ACCOUNTS PAYABLE (DEBIT)
                $this->entry($journal->id, $this->getPayableAccount(), $payment->amount, 0);

                // CASH / BANK (CREDIT)
                $this->entry($journal->id, $payment->account_id, 0, $payment->amount);
            }

            return $journal;
        });
    }

    // helper biar clean
    private function entry($journalId, $accountId, $debit, $credit)
    {
        JournalEntry::create([
            'journal_id' => $journalId,
            'account_id' => $accountId,
            'debit' => $debit,
            'credit' => $credit,
        ]);
    }

    private function getReceivableAccount()
    {
        return 3; // Accounts Receivable
    }

    private function getPayableAccount()
    {
        return 4; // Accounts Payable
    }
}