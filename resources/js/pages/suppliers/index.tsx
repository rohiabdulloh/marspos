import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, RotateCcw, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import SupplierForm from '@/pages/suppliers/form';
import r from '@/lib/route';

export default function Index({ suppliers, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleStatusChange = (status: string | null) => {
        router.get(
            r('suppliers.index'),
            { ...filters, status, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'code',
            header: 'Kode',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>,
        },
        { accessorKey: 'name', header: 'Nama Supplier' },
        { accessorKey: 'contact_person', header: 'Contact Person', cell: ({ row }) => row.original.contact_person || '-' },
        { accessorKey: 'phone', header: 'Telepon', cell: ({ row }) => row.original.phone || '-' },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.original.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    {row.original.is_active ? 'Aktif' : 'Non-aktif'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const isDeleted = !!row.original.deleted_at;

                return (
                    <div className="flex justify-end gap-2">
                        {isDeleted ? (
                            <>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    title="Pulihkan Data"
                                    onClick={() => router.put(r('suppliers.restore', row.original.id))}
                                >
                                    <RotateCcw size={16} className="text-emerald-600" />
                                </Button>
                                <ConfirmDialog
                                    trigger={
                                        <Button size="icon" variant="destructive" title="Hapus Permanen">
                                            <AlertTriangle size={16} />
                                        </Button>
                                    }
                                    title="Hapus Permanen Supplier?"
                                    description={<>Data <b>{row.original.name}</b> akan dihapus selamanya.</>}
                                    confirmText="Hapus Permanen"
                                    onConfirm={() => router.delete(r('suppliers.force-delete', row.original.id))}
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => {
                                        setSelected(row.original);
                                        setOpen(true);
                                    }}
                                >
                                    <Pencil size={16} />
                                </Button>
                                <ConfirmDialog
                                    trigger={
                                        <Button size="icon" variant="destructive">
                                            <Trash size={16} />
                                        </Button>
                                    }
                                    title="Hapus Supplier?"
                                    description={<>Yakin ingin menghapus supplier <b>{row.original.name}</b>?</>}
                                    confirmText="Hapus"
                                    onConfirm={() => router.delete(r('suppliers.destroy', row.original.id))}
                                />
                            </>
                        )}
                    </div>
                );
            },
            size: 120,
        },
    ];

    return (
        <div className="space-y-4">
            <Head title="Data Supplier" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-foreground">Data Supplier</h1>
                    <p className="text-sm text-muted-foreground">Kelola informasi vendor atau pemasok barang.</p>
                </div>
                <Button size="lg" onClick={() => { setSelected(null); setOpen(true); }}>
                    <Plus className="mr-1" size={16} /> Tambah Supplier
                </Button>
            </div>

            <Card className="py-2 bg-card border-border">
                <CardContent className="px-4 py-4">
                    <DataTable
                        columns={columns}
                        data={suppliers.data}
                        paginationMeta={{
                            current_page: suppliers.current_page,
                            last_page: suppliers.last_page,
                            per_page: suppliers.per_page,
                            total: suppliers.total,
                            from: suppliers.from,
                            to: suppliers.to,
                        }}
                        filters={filters}
                        routeName={r('suppliers.index')}
                        enableSearch={true}
                        enableSorting={true}
                        enablePagination={true}
                        statusFilter={
                            <div className="flex items-center bg-muted p-1 rounded-md text-sm">
                                <button
                                    onClick={() => handleStatusChange(null)}
                                    className={`px-3 py-1.5 rounded-sm font-medium transition-all ${!filters?.status ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Aktif
                                </button>
                                <button
                                    onClick={() => handleStatusChange('trash')}
                                    className={`px-3 py-1.5 rounded-sm font-medium transition-all ${filters?.status === 'trash' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Sampah (Trash)
                                </button>
                            </div>
                        }
                    />
                </CardContent>
            </Card>

            {/* Dialog dengan lebar max-w-4xl agar form leluasa */}
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelected(null); }}>
                <DialogContent className="w-[90vw] md:w-[80vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            {selected ? 'Edit Supplier' : 'Tambah Supplier Baru'}
                        </DialogTitle>
                    </DialogHeader>
                    <SupplierForm
                        key={selected?.id ?? 'create'}
                        supplier={selected}
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Supplier', href: r('suppliers.index') },
    ],
};