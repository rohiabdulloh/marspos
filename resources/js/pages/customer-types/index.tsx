import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import CustomerTypeForm from '@/pages/customer-types/form';
import r from '@/lib/route';

export default function Index({ customerTypes, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns: ColumnDef<any>[] = [
        { 
            accessorKey: 'name', 
            header: 'Nama Tipe Customer',
            cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>
        },
        { 
            accessorKey: 'description', 
            header: 'Deskripsi',
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.description || '-'}</span>
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

                        {/* Tombol Hapus */}
                        <ConfirmDialog
                            trigger={
                                <Button size="icon" variant="destructive">
                                    <Trash size={16} />
                                </Button>
                            }
                            title="Hapus Tipe Customer?"
                            description={
                                <>
                                    Yakin ingin menghapus tipe customer{' '}
                                    <b>{row.original.name}</b>?
                                </>
                            }
                            confirmText="Hapus"
                            onConfirm={() =>
                                router.delete(r('customer-types.destroy', row.original.id))
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
            <Head title="Tipe Customer" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-foreground">Tipe Customer</h1>
                    <p className="text-sm text-muted-foreground">Kelola pengelompokan jenis atau kategori pelanggan toko.</p>
                </div>

                <div className="flex gap-2">
                    <Button size="lg" onClick={() => {
                        setSelected(null);
                        setOpen(true);
                    }}>
                        <Plus className="mr-1" size={16} />
                        Tambah Tipe Customer
                    </Button>
                </div>
            </div>

            {/* TABLE */}
            <Card className="py-2 bg-card border-border">
                <CardContent className="px-4 py-4">
                    <DataTable
                        columns={columns}
                        data={customerTypes.data} 
                        paginationMeta={{
                            current_page: customerTypes.current_page,
                            last_page: customerTypes.last_page,
                            per_page: customerTypes.per_page,
                            total: customerTypes.total,
                            from: customerTypes.from,
                            to: customerTypes.to,
                        }}
                        filters={filters}
                        routeName={r('customer-types.index')} 
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
                <DialogContent className="w-[90vw] md:w-[40vw] max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            {selected ? 'Edit Tipe Customer' : 'Tambah Tipe Customer Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <CustomerTypeForm
                        key={selected?.id ?? 'create'}
                        customerType={selected}
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
            title: 'Tipe Customer',
            href: r('customer-types.index'),
        },
    ],
};