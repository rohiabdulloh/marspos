<?php
namespace App\Http\Controllers\Settings;

use App\Models\AuditLog;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $action = $request->input('action');

        $auditLogs = AuditLog::with('user')
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('action', 'like', "%{$search}%")
                        ->orWhere('auditable_type', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($action, function ($q, $action) {
                $q->where('action', $action);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('settings/audit-logs', [
            'auditLogs' => $auditLogs,
            'filters' => $request->only(['search', 'action']),
        ]);
    }

    public function destroy(AuditLog $auditLog)
    {
        $auditLog->delete();
        return back()->with('success', 'Audit log berhasil dihapus.');
    }
}