import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import UnitForm from '@/pages/units/form';
import r from '@/lib/route';

export default function Index({ units, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'short_name',
            header: 'Simbol',
            cell: ({ row }) => <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded">{row.original.short_name}</span>,
        },
        { accessorKey: 'name', header: 'Nama Unit' },
        { 
            accessorKey: 'description', 
            header: 'Deskripsi',
            cell: ({ row }) => row.original.description || '-',
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
                return (
                    <div className="flex justify-end gap-2">
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

                        {/* Tombol Hapus Langsung */}
                        <ConfirmDialog
                            trigger={
                                <Button size="icon" variant="destructive">
                                    <Trash size={16} />
                                </Button>
                            }
                            title="Hapus Unit?"
                            description={
                                <>
                                    Yakin ingin menghapus unit{' '}
                                    <b>{row.original.name}</b>?<br />
                                    Tindakan ini akan menghapus data secara permanen.
                                </>
                            }
                            confirmText="Hapus"
                            onConfirm={() =>
                                router.delete(r('units.destroy', row.original.id))
                            }
                        />
                    </div>
                );
            },
            size: 100,
        },
    ];

    return (
        <div className="space-y-4">
            <Head title="Satuan Produk (Unit)" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Kelola Unit Produk</h1>
                    <p className="text-sm text-muted-foreground">Kelola satuan ukuran barang (Contoh: Pcs, Kg, Liter).</p>
                </div>

                <div className="flex gap-2">
                    <Button size="lg" onClick={() => {
                        setSelected(null);
                        setOpen(true);
                    }}>
                        <Plus className="mr-1" size={16} />
                        Tambah Unit
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <Card className="py-2">
                <CardContent className="px-4 py-4">
                <DataTable
                    columns={columns}
                    data={units.data} 
                    paginationMeta={{
                        current_page: units.current_page,
                        last_page: units.last_page,
                        per_page: units.per_page,
                        total: units.total,
                        from: units.from,
                        to: units.to,
                    }}
                    filters={filters}
                    routeName={r('units.index')} 
                    enableSearch={true}
                    enableSorting={true}
                    enablePagination={true}
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
                            {selected ? 'Edit Unit' : 'Tambah Unit Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <UnitForm
                        key={selected?.id ?? 'create'}
                        unit={selected}
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
            title: 'Unit',
            href: r('units.index'),
        },
    ],
};