import { ChevronDown } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AppTopbarProfile() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                className="
                    tm-focus
                    flex items-center gap-2
                    rounded-full
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    py-[5px] pl-[5px] pr-2.5
                    transition
                    hover:bg-[var(--bg)]
                "
            >
                <div
                    className="
                        flex size-[26px]
                        items-center justify-center
                        rounded-full
                        bg-[var(--primary)]
                        text-[11.5px]
                        font-bold text-white
                    "
                >
                    AD
                </div>

                <div className="hidden text-left sm:block">
                    <div
                        className="
                            text-[12px]
                            font-semibold
                            leading-[1.1]
                            text-[var(--text)]
                        "
                    >
                        Admin
                    </div>

                    <div
                        className="
                            mt-0.5
                            text-[10px]
                            text-[var(--text-faint)]
                        "
                    >
                        Administrator
                    </div>
                </div>

                <ChevronDown
                    size={13}
                    className={[
                        'text-[var(--text-soft)]',
                        'transition-transform',
                        open ? 'rotate-180' : '',
                    ].join(' ')}
                />
            </button>

            {open && (
                <div
                    className="
                        tm-anim
                        absolute right-0 top-[42px] z-[100]
                        w-[190px]
                        overflow-hidden
                        rounded-xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        text-[13px]
                        shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                    "
                >
                    <div
                        className="
                            border-b border-[var(--border-soft)]
                            px-3.5 py-3
                        "
                    >
                        <div className="font-semibold text-[var(--text)]">
                            Admin
                        </div>

                        <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                            admin@tanimakmur.id
                        </div>
                    </div>

                    <Link
                        href="/profile"
                        className="
                            block
                            border-b border-[var(--border-soft)]
                            px-3.5 py-2.5
                            text-[var(--text)]
                            transition
                            hover:bg-[var(--bg)]
                        "
                    >
                        Profil Saya
                    </Link>

                    <Link
                        href="/settings"
                        className="
                            block
                            border-b border-[var(--border-soft)]
                            px-3.5 py-2.5
                            text-[var(--text)]
                            transition
                            hover:bg-[var(--bg)]
                        "
                    >
                        Pengaturan
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="
                            block w-full
                            px-3.5 py-2.5
                            text-left
                            text-[var(--danger)]
                            transition
                            hover:bg-[var(--danger-soft)]
                        "
                    >
                        Keluar
                    </Link>
                </div>
            )}
        </div>
    );
}