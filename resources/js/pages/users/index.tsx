import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, Store as StoreIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from '@tanstack/react-table';
import UserForm from '@/pages/users/form';
import r from '@/lib/route';

export default function Index({ users, stores, filters }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns: ColumnDef<any>[] = [
        { accessorKey: 'name', header: 'Nama Pengguna' },
        { accessorKey: 'email', header: 'Email' },
        { 
            id: 'store', 
            header: 'Toko Penugasan', 
            cell: ({ row }) => {
                const storeName = row.original.store?.name;
                return (
                    <div className="flex items-center gap-1.5 text-sm">
                        <StoreIcon size={14} className="text-muted-foreground" />
                        <span>{storeName || <span className="italic text-muted-foreground">Pusat / Tanpa Toko</span>}</span>
                    </div>
                );
            }
        },
        { 
            accessorKey: 'created_at', 
            header: 'Terdaftar',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID')
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => { setSelected(row.original); setOpen(true); }}>
                            <Pencil size={16} />
                        </Button>
                        <ConfirmDialog
                            trigger={<Button size="icon" variant="destructive"><Trash size={16} /></Button>}
                            title="Hapus Pengguna?"
                            description={<>Yakin ingin menghapus akun <b>{row.original.name}</b>?</>}
                            confirmText="Hapus"
                            onConfirm={() => router.delete(r('users.destroy', row.original.id))}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <Head title="Manajemen Pengguna" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Manajemen Pengguna</h1>
                    <p className="text-sm text-muted-foreground">Kelola daftar akun pegawai, kasir, dan admin.</p>
                </div>
                <Button size="lg" onClick={() => { setSelected(null); setOpen(true); }}>
                    <Plus className="mr-1" size={16} /> Tambah Pengguna
                </Button>
            </div>

            <Card>
                <CardContent className="py-4">
                    <DataTable
                        columns={columns}
                        data={users.data}
                        paginationMeta={users}
                        filters={filters}
                        routeName={r('users.index')}
                        enableSearch={true}
                        enablePagination={true}
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelected(null); }}>
                <DialogContent className="w-[90vw] md:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selected ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
                    </DialogHeader>
                    <UserForm key={selected?.id ?? 'create'} user={selected} stores={stores} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Pengguna', href: r('users.index') },
    ],
};