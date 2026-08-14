import type { ButtonHTMLAttributes, ComponentType } from 'react';

interface AuthButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'md' | 'lg';
    full?: boolean;
    loading?: boolean;
    icon?: ComponentType<{ className?: string }>;
}

export default function AuthButton({
    children,
    variant = 'primary',
    size = 'md',
    full = false,
    loading = false,
    icon: Icon,
    disabled,
    className = '',
    ...props
}: AuthButtonProps) {
    const variants = {
        primary:
            'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
        secondary:
            'border border-[var(--border)] bg-white text-[var(--text)] hover:bg-slate-50',
    };

    const sizes = {
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-4 text-sm',
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-lg',
                'font-semibold transition',
                'focus:outline-none focus:ring-2',
                'focus:ring-[var(--primary)]/20',
                'disabled:cursor-not-allowed disabled:opacity-60',
                variants[variant],
                sizes[size],
                full ? 'w-full' : '',
                className,
            ].join(' ')}
        >
            {loading ? (
                <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {children}
                </>
            ) : (
                <>
                    {Icon && <Icon className="size-4" />}
                    {children}
                </>
            )}
        </button>
    );
}