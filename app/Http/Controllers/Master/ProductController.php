<?php

namespace App\Http\Controllers\Master;

use App\Http\Requests\Master\ProductRequest;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Sesuaikan dengan relasi yang ada di model: units dan prices
        $query = Product::with(['category', 'brand', 'baseUnit', 'units', 'prices.unit']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($request->status === 'trash') {
            $query->onlyTrashed();
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('products/form', [
            'categories' => Category::all(),
            'brands' => Brand::all(),
            'units' => Unit::all(),
        ]);
    }

    public function store(ProductRequest $request)
    {
        DB::transaction(function () use ($request) {
            $product = Product::create($request->validated());

            if ($request->has('units')) {
                // Menggunakan relasi units() atau productUnits() tergantung migrasi pivot
                $product->productUnits()->createMany($request->units);
            }

            if ($request->has('prices')) {
                $product->prices()->createMany($request->prices);
            }
        });

        return redirect()->route('products.index')->with('success', 'Produk berhasil disimpan.');
    }

    public function edit(Product $product)
    {
        // Load relasi menggunakan nama method di model
        $product->load(['productUnits', 'prices']);

        return Inertia::render('products/form', [
            'product' => $product,
            'categories' => Category::all(),
            'brands' => Brand::all(),
            'units' => Unit::all(),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        DB::transaction(function () use ($request, $product) {
            $product->update($request->validated());

            $product->productUnits()->delete();
            if ($request->has('units')) {
                $product->productUnits()->createMany($request->units);
            }

            $product->prices()->delete();
            if ($request->has('prices')) {
                $product->prices()->createMany($request->prices);
            }
        });

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Produk dipindahkan ke sampah.');
    }

    public function restore($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();
        return back()->with('success', 'Produk berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->productUnits()->delete();
        $product->prices()->delete();
        $product->forceDelete();
        
        return back()->with('success', 'Produk dihapus permanen.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:products,id'],
        ]);

        Product::whereIn('id', $validated['ids'])->delete();

        return back()->with(
            'success',
            'Produk berhasil dihapus.'
        );
    }
}