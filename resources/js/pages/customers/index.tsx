import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import ModalForm from '@/pages/customers/form';
import r from '@/lib/route';

export default function Index({ customers }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns: ColumnDef<any>[] = [
        { accessorKey: 'name', header: 'Name', },
        { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.original.email || '-', },
        { accessorKey: 'phone', header: 'Phone', cell: ({ row }) => row.original.phone || '-', },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => (
                <span className="truncate max-w-xs block">
                    {row.original.address || '-'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        size="icon"
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
                        title="Hapus Customer?"
                        description={
                            <>
                                Yakin ingin menghapus customer{' '}
                                <b>{row.original.name}</b>?<br />
                                Data tidak dapat dikembalikan.
                            </>
                        }
                        confirmText="Hapus"
                        onConfirm={() =>
                            router.delete(
                                r('customers.destroy', row.original.id)
                            )
                        }
                    />
                </div>
            ),
            size: 100,
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <Head title="Customers" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Customers
                </h1>

                <Button onClick={() => {
                    setSelected(null);
                    setOpen(true);
                }}>
                    <Plus className="mr-2" size={16} />
                    Add Customer
                </Button>
            </div>

            {/* TABLE */}
            <Card>
                <CardContent className="px-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Daftar customer yang terdaftar dalam sistem. Data ini digunakan untuk transaksi penjualan dan pencatatan relasi pelanggan.
                    </p>

                    <DataTable
                        columns={columns}
                        data={customers}
                        enableSearch
                        enableSorting
                        enablePagination
                        pageSizeOptions={[10, 20, 50]}
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
                <DialogContent className="w-[90vw] md:w-[50vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? 'Edit Customer' : 'Create Customer'}
                        </DialogTitle>
                    </DialogHeader>

                    <ModalForm
                        key={selected?.id ?? 'create'}
                        customer={selected}
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
            title: 'Customers',
            href: r('customers.index'),
        },
    ],
};