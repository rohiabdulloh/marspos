import { Menu } from 'lucide-react';

import AppTopbarSearch from '@/components/app/app-topbar-search';
import AppTopbarHelp from '@/components/app/app-topbar-help';
import AppTopbarNotification from '@/components/app/app-topbar-notification';
import AppTopbarProfile from '@/components/app/app-topbar-profile';
import AppThemeSwitcher from '@/components/app/app-theme-switcher';

interface AppTopbarProps {
    onMenuClick?: () => void;
}

export default function AppTopbar({
    onMenuClick,
}: AppTopbarProps) {
    return (
        <header
            className="
                sticky top-0 z-[80]
                flex items-center gap-3.5
                border-b border-[var(--border)]
                px-[22px] py-3
                backdrop-blur-[6px]
            "
            style={{
                background: 'var(--topbar-bg)',
            }}
        >
            {/* Mobile menu */}

            <button
                type="button"
                onClick={onMenuClick}
                className="
                    tm-focus
                    flex size-[34px]
                    items-center justify-center
                    text-[var(--text-soft)]
                    lg:hidden
                    px-2
                "
                aria-label="Buka menu"
            >
                <Menu size={19} />
            </button>

            {/* Search */}
            <AppTopbarSearch />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Help */}
            <AppTopbarHelp />

            {/* Theme */}
            <AppThemeSwitcher />

            {/* Notification */}
            <AppTopbarNotification />

            {/* Profile */}
            <AppTopbarProfile />
        </header>
    );
}