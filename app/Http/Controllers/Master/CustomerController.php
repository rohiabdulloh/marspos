<?php
namespace App\Http\Controllers\Master;

use App\Models\Customer;
use App\Models\CustomerType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\CustomerRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Customer::with('customerType:id,name');

        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('customers/index', [
            'customers' => $query->paginate($perPage)->withQueryString(),
            'customerTypes' => CustomerType::select('id', 'name')->get(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(CustomerRequest $request)
    {
        Customer::create($request->validated());

        return back()->with('success', 'Customer berhasil ditambahkan.');
    }

    public function update(CustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return back()->with('success', 'Customer berhasil diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return back()->with('success', 'Customer berhasil dihapus.');
    }

    public function restore($id)
    {
        $customer = Customer::onlyTrashed()->findOrFail($id);
        $customer->restore();

        return redirect()->back()->with('success', 'Customer berhasil dipulihkan.');
    }
    
    public function forceDelete($id)
    {
        $customer = Customer::onlyTrashed()->findOrFail($id);
        $customer->forceDelete();

        return redirect()->back()->with('success', 'Customer berhasil dihapus permanen.');
    }
}