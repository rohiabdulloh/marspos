import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            {...props}
            className={[
                'tm-focus',
                'font-semibold',
                'text-[var(--primary)]',
                'transition-colors',
                'duration-150',
                'hover:text-[var(--primary-dark)]',
                'hover:underline',
                'underline-offset-4',
                className,
            ].join(' ')}
        >
            {children}
        </Link>
    );
}