<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Customer;

class InvoiceController extends Controller
{
    public function index()
    {
        return Inertia::render('invoices/index', [
            'invoices' => Invoice::with('customer')->latest()->get(),
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_number' => 'required|unique:invoices',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'total' => 'required|numeric',
            'status' => 'required',
            'customer_id' => 'required|exists:customers,id',
        ]);

        Invoice::create($request->all());

        return back()->with('success', 'Invoice created');
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'invoice_number' => 'required|unique:invoices,invoice_number,' . $invoice->id,
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'total' => 'required|numeric',
            'status' => 'required',
            'customer_id' => 'required|exists:customers,id',
        ]);

        $invoice->update($request->all());

        return back()->with('success', 'Invoice updated');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return back()->with('success', 'Invoice deleted');
    }
}