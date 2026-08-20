import React, { useState } from "react";
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash, Check, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { translate } from '@/lib/permissions';
import RoleForm from '@/pages/roles/form';
import r from '@/lib/route';

const PERMISSION_GROUPS = [
    {
        category: 'Dashboard',
        permissions: ['dashboard.view']
    },
    {
        category: 'Transaksi',
        permissions: [
            'pos.view', 'pos.create', 
            'sales.view', 'sales.create', 'sales.edit', 'sales.delete', 
            'sales-returns.view', 'sales-returns.create', 'sales-returns.delete', 
            'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete', 
            'purchase-returns.view', 'purchase-returns.create', 'purchase-returns.delete', 
            'payments.view', 'payments.create', 'payments.delete'
        ]
    },
    {
        category: 'Master Data',
        permissions: [
            'products.view', 'products.create', 'products.edit', 'products.delete', 
            'categories.view', 'categories.create', 'categories.edit', 'categories.delete', 
            'brands.view', 'brands.create', 'brands.edit', 'brands.delete', 
            'units.view', 'units.create', 'units.edit', 'units.delete', 
            'customer-types.view', 'customer-types.create', 'customer-types.edit', 'customer-types.delete', 
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete', 
            'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete', 
            'stores.view', 'stores.create', 'stores.edit', 'stores.delete', 
            'warehouses.view', 'warehouses.create', 'warehouses.edit', 'warehouses.delete', 
            'promotions.view', 'promotions.create', 'promotions.edit', 'promotions.delete'
        ]
    },
    {
        category: 'Inventori',
        permissions: [
            'stocks.view', 'stock-cards.view', 
            'stock-opnames.view', 'stock-opnames.create', 'stock-opnames.delete', 
            'stock-transfers.view', 'stock-transfers.create', 
            'batches.view', 
            'stock-adjustments.view', 'stock-adjustments.create'
        ]
    },
    {
        category: 'Keuangan',
        permissions: [
            'cash.view', 
            'receivables.view', 'receivables.create', 
            'payables.view', 'payables.create', 
            'cash-in.view', 'cash-in.create', 'cash-in.delete', 
            'cash-out.view', 'cash-out.create', 'cash-out.delete'
        ]
    },
    {
        category: 'Laporan',
        permissions: [
            'sales-report.view', 'purchase-report.view', 'stock-report.view', 
            'best-selling.view', 'profit-report.view', 'receivable-report.view', 
            'payable-report.view', 'cash-report.view'
        ]
    },
    {
        category: 'Pengaturan',
        permissions: [
            'users.view', 'users.create', 'users.edit', 'users.delete', 
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 
            'printer.view', 'printer.edit', 
            'payment-settings.view', 'payment-settings.edit', 
            'tax.view', 'tax.edit', 
            'audit-log.view'
        ]
    }
];

const ACTIONS = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

export default function Index({ roles, permissions }: any) {
    const [selectedRole, setSelectedRole] = useState(roles[0] || null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<any>(null);

    // Sinkronisasi data role aktif dari server
    const currentRole = roles.find((r: any) => r.id === selectedRole?.id) || roles[0];

    // Ekstrak daftar fitur unik dari array permissions yang ada di grup
    const getUniqueFeatures = (groupPermissions: string[]) => {
        const features = groupPermissions.map(p => p.split('.')[0]);
        return Array.from(new Set(features));
    };

    // Toggle permission secara real-time berdasarkan nama permission lengkap
    const handleTogglePermission = (permName: string) => {
        const foundPerm = permissions.find((p: any) => p.name === permName);
        if (!foundPerm || !currentRole) return;

        const hasPermission = currentRole.permissions?.some((p: any) => p.id === foundPerm.id);

        router.post(r('roles.permissions.update', currentRole.id), {
            permission_id: foundPerm.id,
            status: !hasPermission,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="space-y-4">
            <Head title="Pengaturan Role & Permission" />
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Role & Permission</h1>
                    <p className="text-sm text-muted-foreground">Kelola hak akses wewenang pengguna secara real-time.</p>
                </div>
                <Button size="lg" onClick={() => { setSelectedRoleForEdit(null); setOpenModal(true); }}>
                    <Plus className="mr-1" size={16} /> Tambah Role
                </Button>
            </div>

            {/* Tab Pilihan Role */}
            <div className="flex flex-wrap gap-2 border-b pb-3">
                {roles.map((roleItem: any) => {
                    const isActive = currentRole?.id === roleItem.id;
                    return (
                        <button
                            key={roleItem.id}
                            onClick={() => setSelectedRole(roleItem)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive 
                                    ? 'bg-primary text-primary-foreground shadow-sm' 
                                    : 'bg-card border text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {roleItem.name.toUpperCase()}
                        </button>
                    );
                })}
            </div>

            {/* Panel Matriks Permission */}
            {currentRole && (
                <Card>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center border-b pb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="text-primary" size={20} />
                                <h2 className="text-base font-semibold capitalize">
                                    Hak Akses untuk Role: <span className="text-primary">{currentRole.name}</span>
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Tombol Edit Nama Role */}
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => { setSelectedRoleForEdit(currentRole); setOpenModal(true); }}
                                >
                                    <Pencil size={14} className="mr-1.5" /> Edit Nama Role
                                </Button>

                                {/* Tombol Hapus Role (Hanya tampil jika bukan super-admin) */}
                                {currentRole.name !== 'super-admin' && (
                                    <ConfirmDialog
                                        trigger={
                                            <Button size="sm" variant="destructive">
                                                <Trash size={14} className="mr-1.5" /> Hapus Role
                                            </Button>
                                        }
                                        title="Hapus Role?"
                                        description={<>Yakin ingin menghapus role <b>{currentRole.name}</b>?</>}
                                        confirmText="Hapus"
                                        onConfirm={() => {
                                            router.delete(r('roles.destroy', currentRole.id), {
                                                onSuccess: () => setSelectedRole(roles[0])
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Tabel Matriks */}
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full border-collapse text-sm">
                                <thead className="bg-muted text-muted-foreground sticky top-0">
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-bold text-xs uppercase w-1/3">Modul / Fitur</th>
                                        {ACTIONS.map((action) => (
                                            <th key={action.key} className="text-center py-3 px-2 font-bold text-xs uppercase">
                                                {action.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {PERMISSION_GROUPS.map((group, groupIdx) => {
                                        const featureKeys = getUniqueFeatures(group.permissions);
                                        return (
                                            <React.Fragment key={groupIdx}>
                                                {/* Baris Kategori Grup */}
                                                <tr className="bg-muted/30">
                                                    <td colSpan={5} className="py-2 px-4 font-bold text-xs text-primary uppercase">
                                                        {group.category}
                                                    </td>
                                                </tr>
                                                
                                                {/* Baris Fitur per Grup */}
                                                {featureKeys.map((featureKey) => (
                                                    <tr key={featureKey} className="hover:bg-muted/20">
                                                        <td className="py-2 px-4 text-sm font-medium capitalize">
                                                            {translate(featureKey)|| featureKey.replace('-', ' ')}
                                                        </td>
                                                        {ACTIONS.map((action) => {
                                                            const permName = `${featureKey}.${action.key}`;
                                                            const foundPerm = permissions.find((p: any) => p.name === permName);
                                                            const isChecked = foundPerm ? currentRole.permissions?.some((p: any) => p.id === foundPerm.id) : false;

                                                            return (
                                                                <td key={action.key} className="text-center py-2">
                                                                    {foundPerm ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleTogglePermission(permName)}
                                                                            className={`w-5 h-5 rounded border inline-flex items-center justify-center transition-all ${
                                                                                isChecked 
                                                                                    ? 'bg-primary border-primary text-white' 
                                                                                    : 'border-input bg-background hover:border-primary'
                                                                            }`}
                                                                        >
                                                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">-</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal Form Terpisah untuk Tambah / Edit Role */}
            <Dialog open={openModal} onOpenChange={(val) => { setOpenModal(val); if (!val) setSelectedRoleForEdit(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedRoleForEdit ? 'Edit Nama Role' : 'Tambah Role Baru'}</DialogTitle>
                    </DialogHeader>
                    <RoleForm 
                        key={selectedRoleForEdit?.id ?? 'create'} 
                        role={selectedRoleForEdit} 
                        onSuccess={() => setOpenModal(false)} 
                        onCancel={() => setOpenModal(false)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Role & Permission', href: r('roles.index') },
    ],
};