import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, RotateCcw, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import BrandForm from '@/pages/brands/form';
import r from '@/lib/route';

export default function Index({ brands, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    // Fungsi untuk mengganti tampilan tabel antara Data Aktif dan Sampah (Trash)
    const handleStatusChange = (status: string | null) => {
        router.get(
            r('brands.index'),
            { ...filters, status, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Nama Brand',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    {row.original.logo ? (
                        <img 
                            src={`/storage/${row.original.logo}`} 
                            alt={row.original.name} 
                            className="w-9 h-9 object-cover rounded-md border"
                        />
                    ) : (
                        <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {row.original.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <div className="font-medium">{row.original.name}</div>
                        <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.original.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
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
                                {/* Tombol Restore untuk mengembalikan data */}
                                <Button
                                    size="icon"
                                    variant="outline"
                                    title="Pulihkan Data"
                                    onClick={() => router.put(r('brands.restore', row.original.id))}
                                >
                                    <RotateCcw size={16} className="text-emerald-600" />
                                </Button>

                                {/* Tombol Hapus Permanen */}
                                <ConfirmDialog
                                    trigger={
                                        <Button size="icon" variant="destructive" title="Hapus Permanen">
                                            <AlertTriangle size={16} />
                                        </Button>
                                    }
                                    title="Hapus Permanen Brand?"
                                    description={
                                        <>
                                            Tindakan ini tidak dapat dibatalkan! Brand <b>{row.original.name}</b> akan hilang selamanya dari database.
                                        </>
                                    }
                                    confirmText="Hapus Permanen"
                                    onConfirm={() =>
                                        router.delete(r('brands.force-delete', row.original.id))
                                    }
                                />
                            </>
                        ) : (
                            <>
                                {/* Tombol Edit */}
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

                                {/* Tombol Soft Delete (Hapus Sementara) */}
                                <ConfirmDialog
                                    trigger={
                                        <Button size="icon" variant="destructive">
                                            <Trash size={16} />
                                        </Button>
                                    }
                                    title="Hapus Brand?"
                                    description={
                                        <>
                                            Yakin ingin menghapus brand{' '}
                                            <b>{row.original.name}</b>?<br />
                                            Data yang dihapus dapat dipulihkan melalui menu sampah (trash).
                                        </>
                                    }
                                    confirmText="Hapus"
                                    onConfirm={() =>
                                        router.delete(r('brands.destroy', row.original.id))
                                    }
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
            <Head title="Brand Produk" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Kelola Brand Produk</h1>
                    <p className="text-sm text-muted-foreground">Daftar merek atau produsen produk pertanian.</p>
                </div>

                <div className="flex gap-2">
                    <Button size="lg" onClick={() => {
                        setSelected(null);
                        setOpen(true);
                    }}>
                        <Plus className="mr-1" size={16} />
                        Tambah Brand
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <Card className="py-1">
                <CardContent className="px-4 py-4">
                <DataTable
                    columns={columns}
                    data={brands.data} 
                    paginationMeta={{
                        current_page: brands.current_page,
                        last_page: brands.last_page,
                        per_page: brands.per_page,
                        total: brands.total,
                        from: brands.from,
                        to: brands.to,
                    }}
                    filters={filters}
                    routeName={r('brands.index')} 
                    enableSearch={true}
                    enableSorting={true}
                    enablePagination={true}
                    statusFilter={
                        <div className="flex items-center bg-muted p-1 rounded-md text-sm">
                            <button
                                onClick={() => handleStatusChange(null)}
                                className={`px-3 py-1.5 rounded-sm font-medium transition-all ${
                                    !filters?.status ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Aktif
                            </button>
                            <button
                                onClick={() => handleStatusChange('trash')}
                                className={`px-3 py-1.5 rounded-sm font-medium transition-all ${
                                    filters?.status === 'trash' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Sampah (Trash)
                            </button>
                        </div>
                    }
                />
                </CardContent>
            </Card>

            {/* MODAL */}
            <Dialog
                open={open}
                onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) setSelected(null);
                }}
            >
                <DialogContent className="w-[90vw] md:w-[45vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            {selected ? 'Edit Brand' : 'Tambah Brand Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <BrandForm
                        key={selected?.id ?? 'create'}
                        brand={selected}
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
        {
            title: 'Dashboard',
            href: r('dashboard'),
        },
        {
            title: 'Brand',
            href: r('brands.index'),
        },
    ],
};