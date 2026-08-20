import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, RotateCcw, AlertTriangle, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import PromotionForm from '@/pages/promotions/form';
import r from '@/lib/route';

export default function Index({ promotions, products, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const handleStatusChange = (status: string | null) => {
        router.get(r('promotions.index'), { ...filters, status, page: 1 }, { preserveState: true, replace: true });
    };

    const columns: ColumnDef<any>[] = [
        { 
            accessorKey: 'code', 
            header: 'Kode', 
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> 
        },
        { accessorKey: 'name', header: 'Nama Promo' },
        { 
            accessorKey: 'type', 
            header: 'Tipe',
            cell: ({ row }) => <span className="capitalize">{row.original.type.replace(/_/g, ' ')}</span>
        },
        {
            id: 'products_count',
            header: 'Produk Terkait',
            cell: ({ row }) => {
                const count = row.original.products?.length || 0;
                return (
                    <div className="flex items-center gap-1.5 text-sm">
                        <Package size={14} className="text-muted-foreground" />
                        <span>{count > 0 ? `${count} Produk` : 'Semua Produk'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.original.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
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
                                <Button size="icon" variant="outline" title="Pulihkan" onClick={() => router.put(r('promotions.restore', row.original.id))}>
                                    <RotateCcw size={16} className="text-emerald-600" />
                                </Button>
                                <ConfirmDialog
                                    trigger={<Button size="icon" variant="destructive" title="Hapus Permanen"><AlertTriangle size={16} /></Button>}
                                    title="Hapus Permanen?"
                                    description="Data promo akan dihapus selamanya."
                                    confirmText="Hapus"
                                    onConfirm={() => router.delete(r('promotions.force-delete', row.original.id))}
                                />
                            </>
                        ) : (
                            <>
                                <Button size="icon" variant="outline" title="Edit" onClick={() => { setSelected(row.original); setOpen(true); }}>
                                    <Pencil size={16} />
                                </Button>
                                <ConfirmDialog
                                    trigger={<Button size="icon" variant="destructive" title="Hapus"><Trash size={16} /></Button>}
                                    title="Hapus Promo?"
                                    description="Yakin ingin memindahkan promo ke sampah?"
                                    confirmText="Hapus"
                                    onConfirm={() => router.delete(r('promotions.destroy', row.original.id))}
                                />
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <Head title="Data Promosi" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Data Promosi</h1>
                    <p className="text-sm text-muted-foreground">Kelola promo diskon dan kupon toko.</p>
                </div>
                <Button size="lg" onClick={() => { setSelected(null); setOpen(true); }}>
                    <Plus className="mr-1" size={16} /> Tambah Promo
                </Button>
            </div>

            <Card>
                <CardContent className="py-4">
                    <DataTable
                        columns={columns}
                        data={promotions.data}
                        paginationMeta={promotions}
                        filters={filters}
                        routeName={r('promotions.index')}
                        enableSearch={true}
                        enablePagination={true}
                        statusFilter={
                            <div className="flex items-center bg-muted p-1 rounded-md text-sm">
                                <button onClick={() => handleStatusChange(null)} className={`px-3 py-1.5 rounded-sm font-medium ${!filters?.status ? 'bg-background shadow-xs' : 'text-muted-foreground'}`}>Aktif</button>
                                <button onClick={() => handleStatusChange('trash')} className={`px-3 py-1.5 rounded-sm font-medium ${filters?.status === 'trash' ? 'bg-background shadow-xs' : 'text-muted-foreground'}`}>Sampah</button>
                            </div>
                        }
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelected(null); }}>
                <DialogContent className="w-[90vw] md:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selected ? 'Edit Promo' : 'Tambah Promo Baru'}</DialogTitle>
                    </DialogHeader>
                    <PromotionForm key={selected?.id ?? 'create'} promotion={selected} products={products} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Promosi', href: r('promotions.index') },
    ],
};