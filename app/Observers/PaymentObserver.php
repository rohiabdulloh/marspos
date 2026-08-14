<?php

namespace App\Observers;

use App\Models\Payment;
use App\Services\PaymentJournalService;
use App\Services\PaymentStatusService;

class PaymentObserver
{
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        app(PaymentJournalService::class)
            ->createJournal($payment);
        
        app(PaymentStatusService::class)
            ->sync($payment);
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        app(PaymentJournalService::class)
            ->syncJournal($payment);
                    
        app(PaymentStatusService::class)
            ->sync($payment);
    }

    /**
     * Handle the Payment "deleted" event.
     */
    public function deleted(Payment $payment): void
    {
        app(PaymentJournalService::class)
            ->voidJournal($payment);
        
        app(PaymentStatusService::class)
            ->sync($payment);
    }

    /**
     * Handle the Payment "restored" event.
     */
    public function restored(Payment $payment): void
    {
        //
    }

    /**
     * Handle the Payment "force deleted" event.
     */
    public function forceDeleted(Payment $payment): void
    {
        //
    }
}
