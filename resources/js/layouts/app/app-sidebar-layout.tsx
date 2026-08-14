import { useState } from 'react';

import AppSidebar from '@/layouts/app/app-sidebar';
import AppTopbar from '@/layouts/app/app-topbar';

import { APP_MENU } from '@/config/menu';

interface AppSidebarLayoutProps {
    children: React.ReactNode;
}

export default function AppSidebarLayout({
    children,
}: AppSidebarLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

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

                <main className="tm-scroll flex-1 overflow-y-auto px-6 pb-[60px] pt-[22px]">
                    <div className="tm-anim">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}