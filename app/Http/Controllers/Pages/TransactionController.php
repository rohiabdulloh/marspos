<?php
namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Supplier;

class TransactionController extends Controller
{
    public function index()
    {        
        return Inertia::render('transactions/index', [
            'transactions' => Transaction::with(['customer', 'supplier', 'items'])
                ->latest()
                ->get(),
            
            'customers' => Customer::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'accounts' => Account::orderBy('code')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'date' => 'required|date',
            'reference' => 'nullable|string',
            'customer_id' => 'nullable|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'description' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit' => 'required|numeric',
            'items.*.credit' => 'required|numeric',
        ]);

        $transaction = Transaction::create($data);

        $debit = 0;
        $credit = 0;

        foreach ($data['items'] as $item) {
            $transaction->items()->create($item);

            $debit += $item['debit'];
            $credit += $item['credit'];
        }

        $transaction->update([
            'total_debit' => $debit,
            'total_credit' => $credit,
        ]);

        return back()->with('success', 'Transaction created');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'date' => 'required|date',
            'reference' => 'nullable|string',
            'customer_id' => 'nullable|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'description' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit' => 'required|numeric',
            'items.*.credit' => 'required|numeric',
        ]);

        $transaction->update($data);

        $transaction->items()->delete();

        $debit = 0;
        $credit = 0;

        foreach ($data['items'] as $item) {
            $transaction->items()->create($item);

            $debit += $item['debit'];
            $credit += $item['credit'];
        }

        $transaction->update([
            'total_debit' => $debit,
            'total_credit' => $credit,
        ]);

        return back()->with('success', 'Transaction updated');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return back()->with('success', 'Deleted');
    }
}