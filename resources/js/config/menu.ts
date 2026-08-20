import {
    LayoutDashboard,
    ShoppingCart,
    Receipt,
    RotateCcw,
    ShoppingBag,
    CreditCard,
    Package,
    Tags,
    Boxes,
    Ruler,
    Users,
    UserCheck,
    Truck,
    Store,
    Warehouse,
    Gift,
    ClipboardList,
    ArrowLeftRight,
    Layers,
    SlidersHorizontal,
    Wallet,
    Banknote,
    HandCoins,
    FileText,
    TrendingUp,
    BarChart3,
    Cog,
    UserCog,
    ShieldCheck,
    Printer,
    Percent,
    ScrollText,
} from 'lucide-react';

import r from '@/lib/route';

export const APP_MENU = [
    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: r('dashboard'),
                icon: LayoutDashboard,
                permission: 'dashboard.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Transaksi
    |--------------------------------------------------------------------------
    */

    {
        group: 'Transaksi',
        items: [
            {
                id: 'pos',
                label: 'Kasir / POS',
                href: '/pos',
                icon: ShoppingCart,
                permission: 'pos.view',
            },
            {
                id: 'sales',
                label: 'Penjualan',
                href: '/sales',
                icon: Receipt,
                permission: 'sales.view',
            },
            {
                id: 'sales-returns',
                label: 'Retur Penjualan',
                href: '/sales-returns',
                icon: RotateCcw,
                permission: 'sales-returns.view',
            },
            {
                id: 'purchases',
                label: 'Pembelian',
                href: '/purchases',
                icon: ShoppingBag,
                permission: 'purchases.view',
            },
            {
                id: 'purchase-returns',
                label: 'Retur Pembelian',
                href: '/purchase-returns',
                icon: RotateCcw,
                permission: 'purchase-returns.view',
            },
            {
                id: 'payments',
                label: 'Pembayaran',
                href: '/payments',
                icon: CreditCard,
                permission: 'payments.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Master Data
    |--------------------------------------------------------------------------
    */

    {
        group: 'Master Data',
        items: [
            {
                id: 'products',
                label: 'Produk',
                href: '/products',
                icon: Package,
                permission: 'products.view',
            },
            {
                id: 'categories',
                label: 'Kategori',
                href: '/categories',
                icon: Tags,
                permission: 'categories.view',
            },
            {
                id: 'brands',
                label: 'Brand',
                href: '/brands',
                icon: Boxes,
                permission: 'brands.view',
            },
            {
                id: 'units',
                label: 'Satuan',
                href: '/units',
                icon: Ruler,
                permission: 'units.view',
            },
            {
                id: 'customer-types',
                label: 'Tipe Pelanggan',
                href: '/customer-types',
                icon: UserCheck,
                permission: 'customer-types.view',
            },
            {
                id: 'customers',
                label: 'Pelanggan',
                href: '/customers',
                icon: Users,
                permission: 'customers.view',
            },
            {
                id: 'suppliers',
                label: 'Supplier',
                href: '/suppliers',
                icon: Truck,
                permission: 'suppliers.view',
            },
            {
                id: 'stores',
                label: 'Toko',
                href: '/stores',
                icon: Store,
                permission: 'stores.view',
            },
            {
                id: 'warehouses',
                label: 'Gudang',
                href: '/warehouses',
                icon: Warehouse,
                permission: 'warehouses.view',
            },
            {
                id: 'promotions',
                label: 'Promosi',
                href: '/promotions',
                icon: Gift,
                permission: 'promotions.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Inventori
    |--------------------------------------------------------------------------
    */

    {
        group: 'Inventori',
        items: [
            {
                id: 'stocks',
                label: 'Stok',
                href: '/stocks',
                icon: Boxes,
                permission: 'stocks.view',
            },
            {
                id: 'stock-cards',
                label: 'Kartu Stok',
                href: '/stock-cards',
                icon: ClipboardList,
                permission: 'stock-cards.view',
            },
            {
                id: 'stock-opnames',
                label: 'Stock Opname',
                href: '/stock-opnames',
                icon: ClipboardList,
                permission: 'stock-opnames.view',
            },
            {
                id: 'stock-transfers',
                label: 'Transfer Stok',
                href: '/stock-transfers',
                icon: ArrowLeftRight,
                permission: 'stock-transfers.view',
            },
            {
                id: 'batches',
                label: 'Batch & Expired',
                href: '/batches',
                icon: Layers,
                permission: 'batches.view',
            },
            {
                id: 'stock-adjustments',
                label: 'Penyesuaian Stok',
                href: '/stock-adjustments',
                icon: SlidersHorizontal,
                permission: 'stock-adjustments.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Keuangan
    |--------------------------------------------------------------------------
    */

    {
        group: 'Keuangan',
        items: [
            {
                id: 'cash',
                label: 'Kas',
                href: '/cash',
                icon: Wallet,
                permission: 'cash.view',
            },
            {
                id: 'receivables',
                label: 'Piutang',
                href: '/receivables',
                icon: HandCoins,
                permission: 'receivables.view',
            },
            {
                id: 'payables',
                label: 'Hutang',
                href: '/payables',
                icon: Banknote,
                permission: 'payables.view',
            },
            {
                id: 'cash-in',
                label: 'Kas Masuk',
                href: '/cash-in',
                icon: Banknote,
                permission: 'cash-in.view',
            },
            {
                id: 'cash-out',
                label: 'Kas Keluar',
                href: '/cash-out',
                icon: Banknote,
                permission: 'cash-out.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Laporan
    |--------------------------------------------------------------------------
    */

    {
        group: 'Laporan',
        items: [
            {
                id: 'sales-report',
                label: 'Penjualan',
                href: '/reports/sales',
                icon: FileText,
                permission: 'sales-report.view',
            },
            {
                id: 'purchase-report',
                label: 'Pembelian',
                href: '/reports/purchases',
                icon: FileText,
                permission: 'purchase-report.view',
            },
            {
                id: 'stock-report',
                label: 'Stok',
                href: '/reports/stocks',
                icon: Boxes,
                permission: 'stock-report.view',
            },
            {
                id: 'best-selling',
                label: 'Produk Terlaris',
                href: '/reports/best-selling',
                icon: TrendingUp,
                permission: 'best-selling.view',
            },
            {
                id: 'profit-report',
                label: 'Laba',
                href: '/reports/profit',
                icon: BarChart3,
                permission: 'profit-report.view',
            },
            {
                id: 'receivable-report',
                label: 'Piutang',
                href: '/reports/receivables',
                icon: FileText,
                permission: 'receivable-report.view',
            },
            {
                id: 'payable-report',
                label: 'Hutang',
                href: '/reports/payables',
                icon: FileText,
                permission: 'payable-report.view',
            },
            {
                id: 'cash-report',
                label: 'Kas',
                href: '/reports/cash',
                icon: Wallet,
                permission: 'cash-report.view',
            },
        ],
    },

    /*
    |--------------------------------------------------------------------------
    | Pengaturan
    |--------------------------------------------------------------------------
    */

    {
        group: 'Pengaturan',
        items: [
            {
                id: 'settings',
                label: 'Aplikasi',
                href: '/settings/app',
                icon: Cog,
                permission: 'app.view',
            },
            {
                id: 'users',
                label: 'User',
                href: '/settings/users',
                icon: UserCog,
                permission: 'users.view',
            },
            {
                id: 'roles',
                label: 'Role & Permission',
                href: '/settings/roles',
                icon: ShieldCheck,
                permission: 'roles.view',
            },
            {
                id: 'printer',
                label: 'Printer',
                href: '/settings/printer',
                icon: Printer,
                permission: 'printer.view',
            },
            {
                id: 'payment-settings',
                label: 'Pembayaran',
                href: '/settings/payment',
                icon: CreditCard,
                permission: 'payment-settings.view',
            },
            {
                id: 'tax',
                label: 'Pajak',
                href: '/settings/tax',
                icon: Percent,
                permission: 'tax.view',
            },
            {
                id: 'audit-log',
                label: 'Audit Log',
                href: '/settings/audit-log',
                icon: ScrollText,
                permission: 'audit-log.view',
            },
        ],
    },
] as const;