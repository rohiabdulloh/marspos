import type {
    InputHTMLAttributes,
    ReactNode,
} from 'react';

import { CheckCircle2 } from 'lucide-react';

interface AuthCheckboxProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'type'
    > {
    children: ReactNode;
}

export default function AuthCheckbox({
    children,
    className = '',
    ...props
}: AuthCheckboxProps) {
    return (
        <label
            htmlFor={props.id}
            className={[
                'group inline-flex cursor-pointer items-start',
                'gap-[9px]',
                'text-[12.8px]',
                'leading-[1.5]',
                'text-[var(--text-soft)]',
                className,
            ].join(' ')}
        >
            <input
                {...props}
                type="checkbox"
                className="sr-only"
            />

            <span
                className="
                    mt-px flex size-[18px] shrink-0
                    items-center justify-center
                    rounded-[5px]
                    border-[1.5px]
                    border-[var(--border)]
                    bg-white
                    transition-all duration-150

                    group-has-[:checked]:border-[var(--primary)]
                    group-has-[:checked]:bg-[var(--primary)]

                    group-focus-within:ring-2
                    group-focus-within:ring-[var(--primary)]/20
                "
            >
                <CheckCircle2
                    size={13}
                    strokeWidth={3}
                    className="
                        text-white
                        opacity-0
                        transition-opacity duration-150
                        group-has-[:checked]:opacity-100
                    "
                />
            </span>

            <span>{children}</span>
        </label>
    );
}