import { Link } from '@inertiajs/react';

interface AppTopbarProfileItemProps {
    href: string;
    children: React.ReactNode;
    danger?: boolean;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    as?: 'button' | 'a';
    onClick?: () => void;
}

export default function AppTopbarProfileItem({
    href,
    children,
    danger = false,
    method = 'get',
    as = 'a',
    onClick,
}: AppTopbarProfileItemProps) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            onClick={onClick}
            className={[
                'block w-full',
                'px-3.5 py-2.5',
                'transition',
                danger
                    ? 'text-left text-[var(--danger)] hover:bg-[var(--danger-soft)]'
                    : 'border-b border-[var(--border-soft)] text-[var(--text)] hover:bg-[var(--bg)]',
            ].join(' ')}
        >
            {children}
        </Link>
    );
}