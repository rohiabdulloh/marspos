<?php
namespace App\Http\Controllers\Master;

use App\Models\Supplier;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\SupplierRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Supplier::query();

        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('suppliers/index', [
            'suppliers' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(SupplierRequest $request)
    {
        Supplier::create($request->validated());

        return back()->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function update(SupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return back()->with('success', 'Supplier berhasil diperbarui.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return back()->with('success', 'Supplier berhasil dihapus.');
    }

    public function restore($id)
    {
        $supplier = Supplier::onlyTrashed()->findOrFail($id);
        $supplier->restore();

        return redirect()->back()->with('success', 'Supplier berhasil dipulihkan.');
    }
    
    public function forceDelete($id)
    {
        $supplier = Supplier::onlyTrashed()->findOrFail($id);
        $supplier->forceDelete();

        return redirect()->back()->with('success', 'Supplier berhasil dihapus permanen.');
    }
}