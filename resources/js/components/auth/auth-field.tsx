import { useState } from 'react';
import type { ComponentType, InputHTMLAttributes } from 'react';

import {
    AlertCircle,
    Eye,
    EyeOff,
} from 'lucide-react';

interface AuthFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ComponentType<{ className?: string }>;
    error?: string;
    hint?: string;
}

export default function AuthField({
    label,
    icon: Icon,
    error,
    hint,
    id,
    type,
    disabled,
    ...props
}: AuthFieldProps) {
    const [show, setShow] = useState(false);

    const isPassword = type === 'password';

    const inputType = isPassword
        ? show
            ? 'text'
            : 'password'
        : type;

    return (
        <div className="mb-4">
            {/* Label */}
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-soft)]"
                >
                    {label}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative">
                {/* Left Icon */}
                {Icon && (
                    <Icon
                        className={[
                            'absolute left-[13px] top-1/2',
                            'size-4 -translate-y-1/2',
                            error
                                ? 'text-[var(--danger)]'
                                : 'text-[var(--text-faint)]',
                        ].join(' ')}
                    />
                )}

                {/* Input */}
                <input
                    id={id}
                    {...props}
                    disabled={disabled}
                    type={inputType}
                    className={[
                        'tm-focus',
                        'h-[43px] w-full',
                        'rounded-[10px]',
                        'border-[1.5px]',
                        'bg-white',
                        'text-[13.5px]',
                        'text-[var(--text)]',
                        'outline-none',
                        'transition',
                        'placeholder:text-[var(--text-faint)]',

                        disabled
                            ? 'cursor-not-allowed bg-[var(--bg)]'
                            : '',

                        error
                            ? [
                                  'border-[var(--danger)]',
                                  'focus:border-[var(--danger)]',
                                  'focus:ring-2',
                                  'focus:ring-[var(--danger)]/10',
                              ].join(' ')
                            : [
                                  'border-[var(--border)]',
                                  'focus:border-[var(--primary)]',
                                  'focus:ring-2',
                                  'focus:ring-[var(--primary)]/10',
                              ].join(' '),

                        Icon
                            ? 'pl-[38px]'
                            : 'pl-[14px]',

                        isPassword
                            ? 'pr-[40px]'
                            : 'pr-[14px]',
                    ].join(' ')}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        tabIndex={-1}
                        aria-label={
                            show
                                ? 'Sembunyikan kata sandi'
                                : 'Tampilkan kata sandi'
                        }
                        className={[
                            'absolute right-3 top-1/2',
                            '-translate-y-1/2',
                            'flex items-center justify-center',
                            'border-0 bg-transparent p-0',
                            'text-[var(--text-faint)]',
                            'transition-colors',
                            'hover:text-[var(--text-soft)]',
                            'tm-focus',
                        ].join(' ')}
                    >
                        {show ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>
                )}
            </div>

            {/* Error */}
            {error ? (
                <div className="mt-1.5 flex items-center gap-[5px] text-xs font-medium text-[var(--danger)]">
                    <AlertCircle size={13} />

                    <span>{error}</span>
                </div>
            ) : hint ? (
                <div className="mt-1.5 text-xs text-[var(--text-faint)]">
                    {hint}
                </div>
            ) : null}
        </div>
    );
}