import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Trash, Eye} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import r from '@/lib/route';

export default function AuditLogIndex({ auditLogs, filters }: any) {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    const getActionBadge = (action: string) => {
        const colors: Record<string, string> = {
            created: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            updated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            deleted: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
            cancelled: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            approved: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        };
        return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'user.name',
            header: 'Pengguna',
            cell: ({ row }) => <span className="font-medium text-foreground">{row.original.user?.name ?? 'Sistem / Tamu'}</span>,
        },
        {
            accessorKey: 'action',
            header: 'Aksi',
            cell: ({ row }) => (
                <span className={`px-2 py-1 text-xs rounded-full font-semibold uppercase ${getActionBadge(row.original.action)}`}>
                    {row.original.action}
                </span>
            ),
        },
        {
            accessorKey: 'auditable_type',
            header: 'Target Model',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.auditable_type} (ID: {row.original.auditable_id})</span>,
        },
        {
            accessorKey: 'ip_address',
            header: 'IP Address',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.ip_address || '-'}</span>,
        },
        {
            accessorKey: 'created_at',
            header: 'Waktu',
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.created_at}</span>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            title="Detail Perubahan"
                            onClick={() => {
                                setSelectedLog(row.original);
                                setOpenDetail(true);
                            }}
                        >
                            <Eye size={16} />
                        </Button>
                        <ConfirmDialog
                            trigger={
                                <Button size="icon" variant="destructive" title="Hapus Log">
                                    <Trash size={16} />
                                </Button>
                            }
                            title="Hapus Log Aktivitas?"
                            description="Yakin ingin menghapus catatan log ini?"
                            confirmText="Hapus"
                            onConfirm={() => router.delete(r('audit-log.destroy', row.original.id))}
                        />
                    </div>
                );
            },
            size: 100,
        },
    ];

    return (
        <div className="space-y-4">
            <Head title="Audit Log Aktivitas" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        Audit Log Aktivitas
                    </h1>
                    <p className="text-sm text-muted-foreground">Pantau seluruh rekam jejak dan perubahan data pada sistem.</p>
                </div>
            </div>

            <Card className="py-2 bg-card border-border">
                <CardContent className="px-4 py-4">
                    <DataTable
                        columns={columns}
                        data={auditLogs.data}
                        paginationMeta={{
                            current_page: auditLogs.current_page,
                            last_page: auditLogs.last_page,
                            per_page: auditLogs.per_page,
                            total: auditLogs.total,
                            from: auditLogs.from,
                            to: auditLogs.to,
                        }}
                        filters={filters}
                        routeName={r('audit-log.index')}
                        enableSearch={true}
                        enableSorting={true}
                        enablePagination={true}
                    />
                </CardContent>
            </Card>

            {/* Modal Detail Perubahan JSON (Old vs New Values) */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Detail Perubahan Data (Audit Log)</DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
                                <div><span className="text-muted-foreground">Pengguna:</span> <strong className="block">{selectedLog.user?.name ?? 'Sistem'}</strong></div>
                                <div><span className="text-muted-foreground">Aksi:</span> <strong className="block uppercase">{selectedLog.action}</strong></div>
                                <div><span className="text-muted-foreground">Target:</span> <span className="font-mono text-xs block">{selectedLog.auditable_type}</span></div>
                                <div><span className="text-muted-foreground">IP Address:</span> <span className="font-mono text-xs block">{selectedLog.ip_address}</span></div>
                            </div>

                            <div className="space-y-2">
                                <span className="font-medium text-foreground">Data Lama (Old Values):</span>
                                <pre className="p-3 bg-background border border-border rounded-md text-xs font-mono overflow-x-auto max-h-40">
                                    {selectedLog.old_values ? JSON.stringify(selectedLog.old_values, null, 2) : 'Tidak ada data lama'}
                                </pre>
                            </div>

                            <div className="space-y-2">
                                <span className="font-medium text-foreground">Data Baru (New Values):</span>
                                <pre className="p-3 bg-background border border-border rounded-md text-xs font-mono overflow-x-auto max-h-40">
                                    {selectedLog.new_values ? JSON.stringify(selectedLog.new_values, null, 2) : 'Tidak ada data baru'}
                                </pre>
                            </div>

                            <div className="space-y-1">
                                <span className="text-muted-foreground text-xs">User Agent:</span>
                                <p className="text-xs font-mono bg-muted p-2 rounded truncate">{selectedLog.user_agent || '-'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

AuditLogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Audit Log', href: r('audit-log.index') },
    ],
};