<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Account;

class AccountController extends Controller
{
    public function index()
    {
        // tree untuk table
        $accounts = Account::with('children')
            ->whereNull('parent_id')
            ->orderBy('code')
            ->get();

        // flat untuk select parent
        $parents = Account::orderBy('code')->get();

        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
            'parents' => $parents, 
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:accounts,code',
            'name' => 'required',
            'type' => 'required',
        ]);

        Account::create($request->all());

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account created');
    }

    public function update(Request $request, Account $account)
    {
        $request->validate([
            'code' => 'required|unique:accounts,code,' . $account->id,
            'name' => 'required',
            'type' => 'required',
        ]);

        $account->update($request->all());

        return redirect()
            ->route('accounts.index')
            ->with('success', 'Account updated');
    }

    public function destroy(Account $account)
    {
        if ($account->children()->exists()) {
            return back()->with('error', 'Cannot delete parent account');
        }

        $account->delete();

        return back()->with('success', 'Account deleted');
    }
}