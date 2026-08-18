<?php
namespace App\Http\Controllers\Master;

use App\Models\Store;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\StoreRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Store::query();

        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('stores/index', [
            'stores' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(StoreRequest $request)
    {
        Store::create($request->validated());

        return back()->with('success', 'Toko berhasil ditambahkan.');
    }

    public function update(StoreRequest $request, Store $store)
    {
        $store->update($request->validated());

        return back()->with('success', 'Toko berhasil diperbarui.');
    }

    public function destroy(Store $store)
    {
        $store->delete();

        return back()->with('success', 'Toko berhasil dihapus.');
    }

    public function restore($id)
    {
        $store = Store::onlyTrashed()->findOrFail($id);
        $store->restore();

        return redirect()->back()->with('success', 'Toko berhasil dipulihkan.');
    }
    
    public function forceDelete($id)
    {
        $store = Store::onlyTrashed()->findOrFail($id);
        $store->forceDelete();

        return redirect()->back()->with('success', 'Toko berhasil dihapus permanen.');
    }
}