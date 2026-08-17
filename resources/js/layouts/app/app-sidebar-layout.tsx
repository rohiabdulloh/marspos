import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

import AppSidebar from '@/layouts/app/app-sidebar';
import AppTopbar from '@/layouts/app/app-topbar';
import { APP_MENU } from '@/config/menu';
import { BreadcrumbItem } from '@/types/navigation';

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppSidebarLayout({
    children, breadcrumbs = [],
}: AppSidebarLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Ambil data breadcrumbs dari props halaman Inertia (jika didefinisikan di layout halaman)
    const { props } = usePage();
  
    return (
        <div className="tm-root flex min-h-screen">
            {/* =========================================================
                SIDEBAR
            ========================================================== */}
            <AppSidebar
                menu={APP_MENU}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* =========================================================
                MAIN AREA
            ========================================================== */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* =====================================================
                    TOPBAR
                ====================================================== */}
                <AppTopbar
                    onMenuClick={() => setMobileOpen(true)}
                />

                {/* =====================================================
                    PAGE CONTENT
                ====================================================== */}
                <main className="tm-scroll flex-1 overflow-y-auto px-4 pb-[40px] pt-[22px]">
                    <div className="tm-anim space-y-4">
                        
                        {/*  RENDER BREADCRUMBS DI SINI */}
                        <nav className="flex items-center text-sm text-muted-foreground">
                            <ol className="flex items-center space-x-2">
                                <li>
                                    <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
                                        <Home className="h-4 w-4" />
                                    </Link>
                                </li>
                                {breadcrumbs.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                                        {item.href && index < breadcrumbs.length - 1 ? (
                                            <Link href={item.href} className="hover:text-foreground transition-colors">
                                                {item.title}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-foreground">
                                                {item.title}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        {/* KONTEN HALAMAN UTAMA */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}