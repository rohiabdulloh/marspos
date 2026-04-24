import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';
import {
    Plus,
    Pencil,
    Trash,
    ChevronRight,
    ChevronDown,
    CheckCircle, XCircle
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import r from '@/lib/route';

export default function Index({ accounts }: any) {

    //Menampilkan Toast
    const { flash }: any = usePage().props;
    const lastMessage = useRef<string | null>(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;
        if (!message) return;

        // 🔥 cegah duplicate
        if (lastMessage.current === message) return;

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        lastMessage.current = message;
    }, [flash?.success, flash?.error]);

    //Mendefinisikan kolom
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => {
                const canExpand = row.getCanExpand();

                return (
                    <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: row.depth * 20 }}
                    >
                        {canExpand && (
                            <button
                                onClick={row.getToggleExpandedHandler()}
                            >
                                {row.getIsExpanded() ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        )}
                        {row.original.code}
                    </div>
                );
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'type',
            header: 'Type',
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) =>
                row.original.is_active ? (
                    <Badge className="bg-green-100 text-green-700 flex gap-1 items-center">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </Badge>
                ) : (
                    <Badge className="bg-red-100 text-red-700 flex gap-1 items-center">
                        <XCircle className="w-3 h-3" />
                        Inactive
                    </Badge>
                ),
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Link href={r('accounts.edit', row.original.id)}>
                        <Button size="icon">
                            <Pencil size={16} />
                        </Button>
                    </Link>

                    <ConfirmDialog
                        trigger={
                            <Button size="icon" variant="destructive">
                                <Trash size={16} />
                            </Button>
                        }
                        title="Hapus Account?"
                        description={
                            <>
                                Yakin ingin menghapus akun{' '}
                                <b>{row.original.name}</b>?<br />
                                Data tidak dapat dikembalikan.
                            </>
                        }
                        confirmText="Hapus"
                        onConfirm={() =>
                            router.delete(
                                r('accounts.destroy', row.original.id)
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
            <Head title="Chart of Accounts" />

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Chart of Accounts
                </h1>

                <Link href={r('accounts.create')}>
                    <Button>
                        <Plus className="mr-2" size={16} />
                        Add Account
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="px-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Daftar akun akuntansi untuk mencatat transaksi keuangan perusahaan seperti aset, kewajiban, ekuitas, pendapatan, dan beban.
                    </p>

                    <DataTable
                        columns={columns}
                        data={accounts}
                        isTree
                        getSubRows={(row) => row.children ?? []}
                        enableSearch
                        enableSorting
                        enablePagination
                        pageSizeOptions={[10, 20, 50]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}