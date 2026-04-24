import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Building2,
    Wallet,
    FileText,
    Receipt,
    ArrowLeftRight,
    BookOpenText,
    BarChart3,
    FolderGit2,
    BookOpen,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import r from '@/lib/route';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: r('dashboard'),
        icon: LayoutGrid,
    },

    // MASTER DATA
    {
        title: 'Master Data',
        icon: Users,
        items: [
            {
                title: 'Chart of Accounts',
                href: r('accounts.index'),
                icon: Wallet,
            },
            {
                title: 'Customers',
                href: r('accounts.index'),
                icon: Users,
            },
            {
                title: 'Suppliers',
                href: r('accounts.index'),
                icon: Building2,
            },
        ],
    },

    // TRANSAKSI
    {
        title: 'Transaksi',
        icon: ArrowLeftRight,
        items: [
            {
                title: 'Transactions',
                href: r('accounts.index'),
                icon: ArrowLeftRight,
            },
            {
                title: 'Invoices',
                href: r('accounts.index'),
                icon: FileText,
            },
            {
                title: 'Bills',
                href: r('accounts.index'),
                icon: Receipt,
            },
            {
                title: 'Payments',
                href: r('accounts.index'),
                icon: Wallet,
            },
        ],
    },

    // AKUNTANSI
    {
        title: 'Akuntansi',
        icon: BookOpenText,
        items: [
            {
                title: 'Journals',
                href: r('accounts.index'),
                icon: BookOpenText,
            },
            {
                title: 'General Ledger',
                href: r('accounts.index'),
                icon: BookOpenText,
            },
        ],
    },

    // LAPORAN
    {
        title: 'Laporan',
        icon: BarChart3,
        items: [
            {
                title: 'Laba Rugi',
                href: r('accounts.index'),
                icon: BarChart3,
            },
            {
                title: 'Neraca',
                href: r('accounts.index'),
                icon: BarChart3,
            },
            {
                title: 'Arus Kas',
                href: r('accounts.index'),
                icon: BarChart3,
            },
        ],
    },

];

const footerNavItems: NavItem[] = [
    /*{
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },*/
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={r('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
