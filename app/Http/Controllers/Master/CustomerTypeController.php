<?php
namespace App\Http\Controllers\Master;

use App\Models\CustomerType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\CustomerTypeRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CustomerTypeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = CustomerType::query();

        // Server-side Search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Server-side Sorting
        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('customer-types/index', [
            'customerTypes' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(CustomerTypeRequest $request)
    {
        CustomerType::create($request->validated());

        return back()->with('success', 'Tipe customer berhasil ditambahkan.');
    }

    public function update(CustomerTypeRequest $request, CustomerType $customerType)
    {
        $customerType->update($request->validated());

        return back()->with('success', 'Tipe customer berhasil diperbarui.');
    }

    public function destroy(CustomerType $customerType)
    {
        $customerType->delete();

        return back()->with('success', 'Tipe customer berhasil dihapus.');
    }
}