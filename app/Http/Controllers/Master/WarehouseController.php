<?php
namespace App\Http\Controllers\Master;

use App\Models\Warehouse;
use App\Models\Store;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\WarehouseRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Warehouse::with('store:id,name');

        if ($status === 'trash') {
            $query->onlyTrashed();
        }
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('warehouses/index', [
            'warehouses' => $query->paginate($perPage)->withQueryString(),
            'stores' => Store::select('id', 'name')->get(),
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(WarehouseRequest $request)
    {
        // Jika warehouse ini diset sebagai gudang utama, reset gudang utama lain di store yang sama
        if ($request->is_main) {
            Warehouse::where('store_id', $request->store_id)->update(['is_main' => false]);
        }

        Warehouse::create($request->validated());

        return back()->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function update(WarehouseRequest $request, Warehouse $warehouse)
    {
        if ($request->is_main) {
            Warehouse::where('store_id', $request->store_id)->update(['is_main' => false]);
        }

        $warehouse->update($request->validated());

        return back()->with('success', 'Gudang berhasil diperbarui.');
    }

    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();

        return back()->with('success', 'Gudang berhasil dihapus.');
    }
}