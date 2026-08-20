<?php
namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Settings\RoleRequest;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $query = Role::with('permissions');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('roles/index', [
            'roles' => $query->get(), 
            'permissions' => Permission::all(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(RoleRequest $request)
    {
        $role = Role::create(['name' => $request->name]);
            
        return back()->with('success', 'Role berhasil ditambahkan.');
    }
    
    public function update(RoleRequest $request, Role $role)
    {
        $role->update(['name' => $request->name]);
    
        return back()->with('success', 'Role berhasil diperbarui.');
    }

    public function updatePermissions(Request $request, Role $role)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
            'status' => 'required|boolean',
        ]);

        if ($request->status) {
            $role->givePermissionTo($request->permission_id);
        } else {
            $role->revokePermissionTo($request->permission_id);
        }

        return back()->with('success', 'Hak akses diperbarui.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Role Super Admin tidak dapat dihapus.');
        }

        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }

    
}