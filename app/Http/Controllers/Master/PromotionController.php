<?php
namespace App\Http\Controllers\Master;

use App\Models\Promotion;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\PromotionRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        // Muat relasi products beserta kolom yang dibutuhkan
        $query = Promotion::with('products:id,sku,name');

        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('promotions/index', [
            'promotions' => $query->paginate($perPage)->withQueryString(),
            // Kirim data produk untuk pilihan di form
            'products' => Product::select('id', 'sku', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(PromotionRequest $request)
    {
        $data = $request->validated();
        $products = $data['products'] ?? [];
        unset($data['products']);

        $promotion = Promotion::create($data);
        
        // Simpan relasi ke tabel promotion_products
        if (!empty($products)) {
            $promotion->products()->sync($products);
        }

        return back()->with('success', 'Promo berhasil ditambahkan.');
    }

    public function update(PromotionRequest $request, Promotion $promotion)
    {
        $data = $request->validated();
        $products = $data['products'] ?? [];
        unset($data['products']);

        $promotion->update($data);
        
        // Perbarui relasi produk (otomatis tambah/hapus yang tidak dicentang)
        $promotion->products()->sync($products);

        return back()->with('success', 'Promo berhasil diperbarui.');
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return back()->with('success', 'Promo berhasil dihapus.');
    }

    public function restore($id)
    {
        $promotion = Promotion::onlyTrashed()->findOrFail($id);
        $promotion->restore();

        return redirect()->back()->with('success', 'Promo berhasil dipulihkan.');
    }
    
    public function forceDelete($id)
    {
        $promotion = Promotion::onlyTrashed()->findOrFail($id);
        $promotion->products()->detach(); // Lepas relasi sebelum hapus permanen
        $promotion->forceDelete();

        return redirect()->back()->with('success', 'Promo berhasil dihapus permanen.');
    }
}