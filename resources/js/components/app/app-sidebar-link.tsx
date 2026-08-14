import { Link } from '@inertiajs/react';
import type { ComponentType } from 'react';

interface AppSidebarLinkProps {
    href: string;
    label: string;
    icon: ComponentType<{
        size?: number;
        className?: string;
    }>;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
}

export default function AppSidebarLink({
    href,
    label,
    icon: Icon,
    active = false,
    collapsed = false,
    onClick,
}: AppSidebarLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={[
                'group relative mb-0.5',
                'flex w-full items-center',
                'rounded-[9px]',
                'border-l-[3px]',
                'transition-colors',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--accent)]',
                'focus-visible:outline-offset-2',

                collapsed
                    ? 'justify-center px-0 py-2.5'
                    : 'gap-[11px] px-[11px] py-[9px]',

                active
                    ? 'border-[var(--accent)] bg-white/[0.14] text-white'
                    : [
                          'border-transparent',
                          'text-white/[0.72]',
                          'hover:bg-white/[0.07]',
                          'hover:text-white',
                      ].join(' '),
            ].join(' ')}
        >
            <Icon
                size={16.5}
                className="shrink-0"
            />

            {!collapsed && (
                <span
                    className={[
                        'overflow-hidden',
                        'text-ellipsis',
                        'whitespace-nowrap',
                        'text-[13px]',
                        active
                            ? 'font-semibold'
                            : 'font-medium',
                    ].join(' ')}
                >
                    {label}
                </span>
            )}
        </Link>
    );
}