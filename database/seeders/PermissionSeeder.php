<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Daftar izin akses (permissions) berdasarkan ID menu di APP_MENU
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Transaksi
            'pos.view', 'pos.create',
            'sales.view', 'sales.create', 'sales.edit', 'sales.delete',
            'sales-returns.view', 'sales-returns.create', 'sales-returns.delete',
            'purchases.view', 'purchases.create', 'purchases.edit', 'purchases.delete',
            'purchase-returns.view', 'purchase-returns.create', 'purchase-returns.delete',
            'payments.view', 'payments.create', 'payments.delete',

            // Master Data
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
            'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
            'units.view', 'units.create', 'units.edit', 'units.delete',
            'customer-types.view', 'customer-types.create', 'customer-types.edit', 'customer-types.delete',
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
            'stores.view', 'stores.create', 'stores.edit', 'stores.delete',
            'warehouses.view', 'warehouses.create', 'warehouses.edit', 'warehouses.delete',
            'promotions.view', 'promotions.create', 'promotions.edit', 'promotions.delete',

            // Inventori
            'stocks.view',
            'stock-cards.view',
            'stock-opnames.view', 'stock-opnames.create', 'stock-opnames.delete',
            'stock-transfers.view', 'stock-transfers.create',
            'batches.view',
            'stock-adjustments.view', 'stock-adjustments.create',

            // Keuangan
            'cash.view',
            'receivables.view', 'receivables.create',
            'payables.view', 'payables.create',
            'cash-in.view', 'cash-in.create', 'cash-in.delete',
            'cash-out.view', 'cash-out.create', 'cash-out.delete',

            // Laporan
            'sales-report.view',
            'purchase-report.view',
            'stock-report.view',
            'best-selling.view',
            'profit-report.view',
            'receivable-report.view',
            'payable-report.view',
            'cash-report.view',

            // Pengaturan
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            'printer.view', 'printer.edit',
            'payment-settings.view', 'payment-settings.edit',
            'tax.view', 'tax.edit',
            'audit-log.view',
        ];

        // Buat permissions ke database
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Opsional: Buat role default (Admin / Super Admin) dan berikan semua permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Contoh Role Kasir (hanya akses POS dan Penjualan dasar)
        $cashier = Role::firstOrCreate(['name' => 'Kasir']);
        $cashier->givePermissionTo([
            'dashboard.view',
            'pos.view',
            'pos.create',
            'sales.view',
            'sales.create',
            'customers.view',
            'customers.create',
        ]);
    }
}