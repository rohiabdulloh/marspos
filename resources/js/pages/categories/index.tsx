import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, RotateCcw, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import CategoryForm from '@/pages/categories/form';
import r from '@/lib/route';

export default function Index({ categories, parentCategories, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    // Fungsi untuk mengganti tampilan tabel antara Data Aktif dan Sampah (Trash)
    const handleStatusChange = (status: string | null) => {
        router.get(
            r('categories.index'),
            { ...filters, status, page: 1 }, // Reset ke halaman 1 saat filter berubah
            { preserveState: true, replace: true }
        );
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>,
        },
        { accessorKey: 'name', header: 'Nama Kategori' },
        {
            accessorKey: 'parent',
            header: 'Kategori Induk',
            enableSorting: false,
            cell: ({ row }) => row.original.parent?.name || '-',
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
                                    onClick={() => router.put(r('categories.restore', row.original.id))}
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
                                    title="Hapus Permanen Kategori?"
                                    description={
                                        <>
                                            Tindakan ini tidak dapat dibatalkan! Kategori <b>{row.original.name}</b> akan hilang selamanya dari database.
                                        </>
                                    }
                                    confirmText="Hapus Permanen"
                                    onConfirm={() =>
                                        router.delete(r('categories.force-delete', row.original.id))
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
                                    title="Hapus Kategori?"
                                    description={
                                        <>
                                            Yakin ingin menghapus kategori{' '}
                                            <b>{row.original.name}</b>?<br />
                                            Data yang dihapus dapat dipulihkan melalui menu sampah (trash).
                                        </>
                                    }
                                    confirmText="Hapus"
                                    onConfirm={() =>
                                        router.delete(r('categories.destroy', row.original.id))
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
            <Head title="Kategori Produk" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Kategori Produk Pertanian</h1>
                    <p className="text-sm text-muted-foreground">Kelola kategori untuk pengelompokan produk toko pertanian.</p>
                </div>

                <div className="flex gap-2">
                    <Button size="lg" onClick={() => {
                        setSelected(null);
                        setOpen(true);
                    }}>
                        <Plus className="mr-1" size={16} />
                        Tambah Kategori
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <Card className="py-2">
                <CardContent className="px-4 py-4">
                <DataTable
                    columns={columns}
                    data={categories.data} 
                    paginationMeta={{
                        current_page: categories.current_page,
                        last_page: categories.last_page,
                        per_page: categories.per_page,
                        total: categories.total,
                        from: categories.from,
                        to: categories.to,
                    }}
                    filters={filters}
                    routeName={r('categories.index')} 
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
                            {selected ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <CategoryForm
                        key={selected?.id ?? 'create'}
                        category={selected}
                        parentCategories={parentCategories}
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
            title: 'Kategori',
            href: r('categories.index'),
        },
    ],
};