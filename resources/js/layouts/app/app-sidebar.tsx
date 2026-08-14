import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AppSidebarBrand from '@/components/app/app-sidebar-brand';
import AppSidebarCollapse from '@/components/app/app-sidebar-collapse';
import AppSidebarGroup from '@/components/app/app-sidebar-group';
import AppSidebarLink from '@/components/app/app-sidebar-link';
import AppSidebarOverlay from '@/components/app/app-sidebar-overlay';

import type { ComponentType } from 'react';

interface MenuItem {
    id: string;
    label: string;
    href: string;
    icon: ComponentType<{
        size?: number;
        className?: string;
    }>;
}

interface MenuGroup {
    group?: string;
    items: MenuItem[];
}

interface AppSidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    menu: MenuGroup[];
}

export default function AppSidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    menu,
}: AppSidebarProps) {
    const { url } = usePage();

    /*
    |--------------------------------------------------------------------------
    | Active route
    |--------------------------------------------------------------------------
    */

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }

        return url.startsWith(href);
    };

    /*
    |--------------------------------------------------------------------------
    | Group state
    |--------------------------------------------------------------------------
    */

    const getInitialOpenGroups = () => {
        const state: Record<string, boolean> = {};

        menu.forEach((group) => {
            if (!group.group) {
                return;
            }

            state[group.group] = group.items.some(
                (item) => isActive(item.href),
            );
        });

        return state;
    };

    const [openGroups, setOpenGroups] = useState<
        Record<string, boolean>
    >(getInitialOpenGroups);

    /*
    |--------------------------------------------------------------------------
    | Open active group
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setOpenGroups((current) => {
            const next = { ...current };

            menu.forEach((group) => {
                if (!group.group) {
                    return;
                }

                const hasActiveItem = group.items.some(
                    (item) => isActive(item.href),
                );

                if (hasActiveItem) {
                    next[group.group] = true;
                }
            });

            return next;
        });
    }, [url]);

    /*
    |--------------------------------------------------------------------------
    | Toggle group
    |--------------------------------------------------------------------------
    */

    const toggleGroup = (groupName: string) => {
        setOpenGroups((current) => ({
            ...current,
            [groupName]: !current[groupName],
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleNavigate = () => {
        setMobileOpen(false);
    };

    return (
        <>
            <AppSidebarOverlay
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <aside
                className={[
                    'tm-scroll fixed inset-y-0 left-0 z-[95]',
                    'flex h-screen flex-col',
                    'bg-[var(--primary-dark)] text-white',
                    'transition-all duration-150 ease-in-out',
                    'lg:sticky lg:top-0',
                    collapsed
                        ? 'w-[74px]'
                        : 'w-[246px]',
                    mobileOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0',
                ].join(' ')}
            >
                <AppSidebarBrand
                    collapsed={collapsed}
                />

                <nav
                    className="
                        tm-scroll
                        flex-1
                        overflow-y-auto
                        px-2.5
                        pb-5
                        pt-2.5
                    "
                >
                    {menu.map((group, groupIndex) => {
                        /*
                        |--------------------------------------------------------------------------
                        | Menu tanpa group
                        |--------------------------------------------------------------------------
                        */

                        if (!group.group) {
                            return (
                                <div
                                    key={groupIndex}
                                    className="mb-1.5"
                                >
                                    {group.items.map(
                                        (item) => (
                                            <AppSidebarLink
                                                key={item.id}
                                                href={item.href}
                                                label={item.label}
                                                icon={item.icon}
                                                active={isActive(
                                                    item.href,
                                                )}
                                                collapsed={
                                                    collapsed
                                                }
                                                onClick={
                                                    handleNavigate
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            );
                        }

                        /*
                        |--------------------------------------------------------------------------
                        | Group
                        |--------------------------------------------------------------------------
                        */

                        const groupName =
                            group.group;

                        const isOpen =
                            openGroups[groupName] ??
                            false;

                        const hasActiveItem =
                            group.items.some(
                                (item) =>
                                    isActive(
                                        item.href,
                                    ),
                            );

                        return (
                            <AppSidebarGroup
                                key={groupIndex}
                                name={groupName}
                                items={group.items}
                                collapsed={collapsed}
                                open={isOpen}
                                hasActiveItem={
                                    hasActiveItem
                                }
                                isActive={isActive}
                                onToggle={() =>
                                    toggleGroup(
                                        groupName,
                                    )
                                }
                                onNavigate={
                                    handleNavigate
                                }
                            />
                        );
                    })}
                </nav>

                <AppSidebarCollapse
                    collapsed={collapsed}
                    onToggle={() =>
                        setCollapsed(
                            (value) => !value,
                        )
                    }
                />
            </aside>
        </>
    );
}