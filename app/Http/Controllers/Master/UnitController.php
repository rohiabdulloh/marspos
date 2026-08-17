<?php

namespace App\Http\Controllers\Master;

use App\Models\Unit;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\UnitRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $allowedSorts = ['name', 'short_name', 'created_at'];
        $sortField = $request->get('sort', 'created_at');
        if (!in_array($sortField, $allowedSorts)) {
            $sortField = 'created_at';
        }

        $sortDirection = $request->get('direction', 'desc');
        $perPage = $request->get('per_page', 10);

        $query = Unit::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortField, $sortDirection);

        return Inertia::render('units/index', [
            'units' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function store(UnitRequest $request)
    {
        Unit::create($request->validated());

        return redirect()->back()->with('success', 'Unit berhasil ditambahkan.');
    }

    public function update(UnitRequest $request, Unit $unit)
    {
        $unit->update($request->validated());

        return redirect()->back()->with('success', 'Unit berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->back()->with('success', 'Unit berhasil dihapus.');
    }
}