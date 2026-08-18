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
    Settings,
    UserCog,
    ShieldCheck,
    Printer,
    Percent,
    ScrollText,
} from 'lucide-react';

import r from '@/lib/route';

export const APP_MENU = [
    {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: r('dashboard'),
                icon: LayoutDashboard,
            },
        ],
    },

    {
        group: 'Transaksi',
        items: [
            {
                id: 'pos',
                label: 'Kasir / POS',
                href: '/pos',
                icon: ShoppingCart,
            },
            {
                id: 'sales',
                label: 'Penjualan',
                href: '/sales',
                icon: Receipt,
            },
            {
                id: 'sales-returns',
                label: 'Retur Penjualan',
                href: '/sales-returns',
                icon: RotateCcw,
            },
            {
                id: 'purchases',
                label: 'Pembelian',
                href: '/purchases',
                icon: ShoppingBag,
            },
            {
                id: 'purchase-returns',
                label: 'Retur Pembelian',
                href: '/purchase-returns',
                icon: RotateCcw,
            },
            {
                id: 'payments',
                label: 'Pembayaran',
                href: '/payments',
                icon: CreditCard,
            },
        ],
    },

    {
        group: 'Master Data',
        items: [
            {
                id: 'products',
                label: 'Produk',
                href: '/products',
                icon: Package,
            },
            {
                id: 'categories',
                label: 'Kategori',
                href: '/categories',
                icon: Tags,
            },
            {
                id: 'brands',
                label: 'Brand',
                href: '/brands',
                icon: Boxes,
            },
            {
                id: 'units',
                label: 'Satuan',
                href: '/units',
                icon: Ruler,
            },
            {
                id: 'customer-types',
                label: 'Tipe Pelanggan',
                href: '/customer-types',
                icon: UserCheck,
            },
            {
                id: 'customers',
                label: 'Pelanggan',
                href: '/customers',
                icon: Users,
            },
            {
                id: 'suppliers',
                label: 'Supplier',
                href: '/suppliers',
                icon: Truck,
            },
            {
                id: 'stores',
                label: 'Toko',
                href: '/stores',
                icon: Store,
            },
            {
                id: 'warehouses',
                label: 'Gudang',
                href: '/warehouses',
                icon: Warehouse,
            },
        ],
    },

    {
        group: 'Inventori',
        items: [
            {
                id: 'stocks',
                label: 'Stok',
                href: '/stocks',
                icon: Boxes,
            },
            {
                id: 'stock-cards',
                label: 'Kartu Stok',
                href: '/stock-cards',
                icon: ClipboardList,
            },
            {
                id: 'stock-opnames',
                label: 'Stock Opname',
                href: '/stock-opnames',
                icon: ClipboardList,
            },
            {
                id: 'stock-transfers',
                label: 'Transfer Stok',
                href: '/stock-transfers',
                icon: ArrowLeftRight,
            },
            {
                id: 'batches',
                label: 'Batch & Expired',
                href: '/batches',
                icon: Layers,
            },
            {
                id: 'stock-adjustments',
                label: 'Penyesuaian Stok',
                href: '/stock-adjustments',
                icon: SlidersHorizontal,
            },
        ],
    },

    {
        group: 'Keuangan',
        items: [
            {
                id: 'cash',
                label: 'Kas',
                href: '/cash',
                icon: Wallet,
            },
            {
                id: 'receivables',
                label: 'Piutang',
                href: '/receivables',
                icon: HandCoins,
            },
            {
                id: 'payables',
                label: 'Hutang',
                href: '/payables',
                icon: Banknote,
            },
            {
                id: 'cash-in',
                label: 'Kas Masuk',
                href: '/cash-in',
                icon: Banknote,
            },
            {
                id: 'cash-out',
                label: 'Kas Keluar',
                href: '/cash-out',
                icon: Banknote,
            },
        ],
    },

    {
        group: 'Laporan',
        items: [
            {
                id: 'sales-report',
                label: 'Penjualan',
                href: '/reports/sales',
                icon: FileText,
            },
            {
                id: 'purchase-report',
                label: 'Pembelian',
                href: '/reports/purchases',
                icon: FileText,
            },
            {
                id: 'stock-report',
                label: 'Stok',
                href: '/reports/stocks',
                icon: Boxes,
            },
            {
                id: 'best-selling',
                label: 'Produk Terlaris',
                href: '/reports/best-selling',
                icon: TrendingUp,
            },
            {
                id: 'profit-report',
                label: 'Laba',
                href: '/reports/profit',
                icon: BarChart3,
            },
            {
                id: 'receivable-report',
                label: 'Piutang',
                href: '/reports/receivables',
                icon: FileText,
            },
            {
                id: 'payable-report',
                label: 'Hutang',
                href: '/reports/payables',
                icon: FileText,
            },
            {
                id: 'cash-report',
                label: 'Kas',
                href: '/reports/cash',
                icon: Wallet,
            },
        ],
    },

    {
        group: 'Pengaturan',
        items: [
            {
                id: 'store-settings',
                label: 'Toko',
                href: '/settings/store',
                icon: Settings,
            },
            {
                id: 'users',
                label: 'User',
                href: '/settings/users',
                icon: UserCog,
            },
            {
                id: 'roles',
                label: 'Role & Permission',
                href: '/settings/roles',
                icon: ShieldCheck,
            },
            {
                id: 'printer',
                label: 'Printer',
                href: '/settings/printer',
                icon: Printer,
            },
            {
                id: 'payment-settings',
                label: 'Pembayaran',
                href: '/settings/payment',
                icon: CreditCard,
            },
            {
                id: 'tax',
                label: 'Pajak',
                href: '/settings/tax',
                icon: Percent,
            },
            {
                id: 'audit-log',
                label: 'Audit Log',
                href: '/settings/audit-log',
                icon: ScrollText,
            },
        ],
    },
];