<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Bill;
use App\Models\Supplier;

class BillController extends Controller
{
    public function index()
    {
        return Inertia::render('bills/index', [
            'bills' => Bill::with('supplier')->latest()->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bill_number' => 'required|unique:bills',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'total' => 'required|numeric',
            'status' => 'required',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        Bill::create($request->all());

        return back()->with('success', 'Bill created');
    }

    public function update(Request $request, Bill $bill)
    {
        $request->validate([
            'bill_number' => 'required|unique:bills,bill_number,' . $bill->id,
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'total' => 'required|numeric',
            'status' => 'required',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $bill->update($request->all());

        return back()->with('success', 'Bill updated');
    }

    public function destroy(Bill $bill)
    {
        $bill->delete();

        return back()->with('success', 'Bill deleted');
    }
}