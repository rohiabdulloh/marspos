import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, ChevronDown, ChevronRight, Layers, RotateCcw, AlertTriangle } from "lucide-react";
import { ColumnDef } from '@tanstack/react-table';
import r from '@/lib/route';

export default function ProductIndex({ products, filters }: any) {
    const formatRupiah = (number: number) => {
        return 'Rp ' + Number(number || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    
    const handleStatusChange = (status: string | null) => {
        router.get(
            r('products.index'),
            { ...filters, status, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    // Mendefinisikan kolom dengan tombol expand di kolom SKU/Nama
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: ({ row }) => {
                const hasDetails = (row.original.product_units?.length > 0) || (row.original.product_prices?.length > 0) || (row.original.prices?.length > 0);

                return (
                    <div className="flex items-center gap-2">
                        {hasDetails && (
                            <button
                                type="button"
                                onClick={row.getToggleExpandedHandler()}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}
                        <span className="font-medium">{row.original.sku}</span>
                    </div>
                );
            },
        },
        { accessorKey: 'name', header: 'Nama Produk' },
        { 
            accessorKey: 'base_unit.name', 
            header: 'Satuan Dasar', 
            cell: ({ row }) => row.original.base_unit?.name || '-' 
        },
        { 
            accessorKey: 'selling_price', 
            header: 'Harga Jual Dasar',
            cell: ({ row }) => formatRupiah(row.original.selling_price)
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
                                    onClick={() => router.put(r('products.restore', row.original.id))}
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
                                        router.delete(r('products.force-delete', row.original.id))
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <Button size="icon" variant="outline" asChild>
                                    <Link href={r('products.edit', row.original.id)}><Pencil size={16} /></Link>
                                </Button>
                                <ConfirmDialog
                                    trigger={<Button size="icon" variant="destructive"><Trash size={16} /></Button>}
                                    title="Hapus Produk?"
                                    description={<>Yakin ingin menghapus produk <b>{row.original.name}</b>?</>}
                                    confirmText="Hapus"
                                    onConfirm={() => router.delete(r('products.destroy', row.original.id))}
                                />
                            </>
                        )}
                    </div>
                )},
            size: 100,
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <Head title="Manajemen Produk" />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-foreground">Data Produk</h1>
                    <p className="text-sm text-muted-foreground">Kelola produk beserta satuan dan variasi harganya.</p>
                </div>
                <Button asChild>
                    <Link href={r('products.create')}><Plus className="mr-1" size={16} /> Tambah Produk</Link>
                </Button>
            </div>

            {/* TABLE */}
            <Card>
                <CardContent className="px-4 py-4 space-y-4">
                    <DataTable
                        columns={columns}
                        data={products.data}
                        paginationMeta={products}
                        filters={filters}
                        enableRowSelection={true}
                        getRowId={(row: any) => String(row.id)}
                        routeName={r('products.index')}
                        bulkDeleteRoute={r('products.bulk-destroy')}
                        enableSearch={true}
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
                        renderSubComponent={({ row }) => {
                            const product = row.original;
                            const units = product.product_units || [];
                            const prices = product.product_prices || product.prices || [];

                            return (
                                <div className="space-y-3 text-sm py-2">
                                    <div className="font-semibold flex items-center gap-1.5 text-primary">
                                        <Layers size={15} /> Detail Satuan & Harga Varian: {product.name}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground mb-1">KONVERSI SATUAN:</p>
                                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                                {units.length > 0 ? units.map((u: any) => (
                                                    <li key={u.id}>1 {u.unit?.name ?? 'Satuan'} = {u.conversion_factor} {product.base_unit?.name ?? ''}</li>
                                                )) : <li>Tidak ada satuan tambahan.</li>}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground mb-1">TINGKAT / LEVEL HARGA:</p>
                                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                                {prices.length > 0 ? prices.map((p: any) => (
                                                    <li key={p.id}>
                                                        {p.price_type ?? 'Harga Varian'} - {formatRupiah(p.price)} 
                                                        {p.minimum_quantity ? ` (Min Qty: ${p.minimum_quantity})` : ''}
                                                    </li>
                                                )) : <li>Menggunakan harga dasar standar.</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Produk', href: r('products.index') },
    ],
};