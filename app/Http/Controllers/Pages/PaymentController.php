<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\Account;
use App\Models\Supplier;
use App\Models\Customer;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('payments/index', [
            'payments' => Payment::with([
                'invoice',
                'bill',
                'customer',
                'supplier',
                'account'
            ])->latest()->get(),

            'invoices' => Invoice::where('status', '!=', 'paid')->get(),
            'bills' => Bill::where('status', '!=', 'paid')->get(),

            'customers' => Customer::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),

            'accounts' => Account::orderBy('code')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:receive,pay',
            'date' => 'required|date',
            'amount' => 'required|numeric',

            'invoice_id' => 'nullable|exists:invoices,id',
            'bill_id' => 'nullable|exists:bills,id',

            'customer_id' => 'nullable|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',

            'account_id' => 'nullable|exists:accounts,id',
        ]);

        Payment::create($request->all());

        return back()->with('success', 'Payment created');
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'type' => 'required|in:receive,pay',
            'date' => 'required|date',
            'amount' => 'required|numeric',
        ]);

        $payment->update($request->all());

        return back()->with('success', 'Payment updated');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return back()->with('success', 'Payment deleted');
    }
}