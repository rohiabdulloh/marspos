import { ChevronDown } from 'lucide-react';

import AppSidebarLink from '@/components/app/app-sidebar-link';

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

interface AppSidebarGroupProps {
    name: string;
    items: MenuItem[];
    collapsed: boolean;
    open: boolean;
    hasActiveItem: boolean;
    isActive: (href: string) => boolean;
    onToggle: () => void;
    onNavigate: () => void;
}

export default function AppSidebarGroup({
    name,
    items,
    collapsed,
    open,
    hasActiveItem,
    isActive,
    onToggle,
    onNavigate,
}: AppSidebarGroupProps) {
    /*
    |--------------------------------------------------------------------------
    | Collapsed sidebar
    |--------------------------------------------------------------------------
    */

    if (collapsed) {
        return (
            <div>
                <div
                    className="
                        mx-2 my-2.5
                        h-px
                        bg-white/[0.08]
                    "
                />

                {items.map((item) => (
                    <AppSidebarLink
                        key={item.id}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={isActive(item.href)}
                        collapsed
                        onClick={onNavigate}
                    />
                ))}
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Normal sidebar
    |--------------------------------------------------------------------------
    */

    return (
        <div className="mb-1.5">
            <button
                type="button"
                onClick={onToggle}
                className="
                    tm-focus
                    flex w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-2.5
                    pb-1.5
                    pt-3.5
                    text-left
                    text-[10.5px]
                    font-bold
                    uppercase
                    tracking-[1px]
                    text-white/[0.42]
                    transition-colors
                    hover:text-white/[0.7]
                "
            >
                <span className="flex items-center gap-2">
                    {name}

                    {hasActiveItem && (
                        <span
                            className="
                                size-1.5
                                rounded-full
                                bg-[var(--accent)]
                            "
                        />
                    )}
                </span>

                <ChevronDown
                    size={14}
                    className={[
                        'transition-transform duration-150',
                        open
                            ? 'rotate-0'
                            : '-rotate-90',
                    ].join(' ')}
                />
            </button>

            <div
                className={[
                    'grid transition-[grid-template-rows,opacity]',
                    'duration-150 ease-in-out',
                    open
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                ].join(' ')}
            >
                <div className="overflow-hidden">
                    {items.map((item) => (
                        <AppSidebarLink
                            key={item.id}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            active={isActive(item.href)}
                            onClick={onNavigate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}