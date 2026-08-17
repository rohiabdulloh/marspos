<?php

namespace App\Http\Controllers\Master;

use App\Models\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\BrandRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        
        $allowedSorts = ['name', 'slug', 'created_at'];
        $sortField = $request->get('sort', 'created_at');
        if (!in_array($sortField, $allowedSorts)) {
            $sortField = 'created_at';
        }

        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Brand::query();

        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('brands/index', [
            'brands' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function store(BrandRequest $request)
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('brands', 'public');
        }

        Brand::create($validated);

        return redirect()->back()->with('success', 'Brand berhasil ditambahkan.');
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('logo')) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $validated['logo'] = $request->file('logo')->store('brands', 'public');
        }

        $brand->update($validated);

        return redirect()->back()->with('success', 'Brand berhasil diperbarui.');
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->back()->with('success', 'Brand dipindahkan ke sampah.');
    }

    public function restore($id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->restore();

        return redirect()->back()->with('success', 'Brand berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->forceDelete();

        return redirect()->back()->with('success', 'Brand berhasil dihapus permanen.');
    }
}