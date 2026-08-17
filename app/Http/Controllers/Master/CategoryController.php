<?php
namespace App\Http\Controllers\Master;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\CategoryRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Category::with('parent:id,name');

        // Filter Status (Trash / Aktif)
        if ($status === 'trash') {
            $query->onlyTrashed();
        }

        // Server-side Search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Server-side Sorting
        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('categories/index', [
            'categories' => $query->paginate($perPage)->withQueryString(),
            'parentCategories' => Category::select('id', 'name')->get(),
            'filters' => $request->only(['search', 'status', 'sort', 'direction', 'per_page']),
        ]);
    }
    
    public function store(CategoryRequest $request)
    {
        Category::create($request->validated());

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    public function restore($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->restore();

        return redirect()->back()->with('success', 'Kategori berhasil dipulihkan.');
    }
    
    public function forceDelete($id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->forceDelete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus permanen.');
    }
}