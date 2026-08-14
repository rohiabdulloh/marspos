import {
    AlertTriangle,
    Bell,
    Clock,
    HandCoins,
    Wallet,
} from 'lucide-react';

import { useState } from 'react';

interface NotificationItem {
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    tone: 'warning' | 'danger' | 'info';
    text: string;
}

const notifications: NotificationItem[] = [
    {
        icon: AlertTriangle,
        tone: 'warning',
        text: '12 produk stok menipis',
    },
    {
        icon: Clock,
        tone: 'danger',
        text: '5 batch akan expired 30 hari',
    },
    {
        icon: HandCoins,
        tone: 'info',
        text: '8 invoice pelanggan jatuh tempo',
    },
    {
        icon: Wallet,
        tone: 'warning',
        text: '3 invoice supplier jatuh tempo',
    },
];

export default function AppTopbarNotification() {
    const [open, setOpen] = useState(false);

    const toneClass = {
        warning: 'text-[var(--warning)]',
        danger: 'text-[var(--danger)]',
        info: 'text-[var(--info)]',
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label="Notifikasi"
                aria-expanded={open}
                className="
                    tm-focus relative
                    flex size-[34px]
                    items-center justify-center
                    rounded-[9px]
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    text-[var(--text-soft)]
                    transition
                    hover:bg-[var(--bg)]
                "
            >
                <Bell size={16} />

                <span
                    className="
                        absolute -right-[3px] -top-[3px]
                        flex size-4
                        items-center justify-center
                        rounded-full
                        border-2 border-[var(--bg)]
                        bg-[var(--danger)]
                        text-[9.5px]
                        font-bold text-white
                    "
                >
                    4
                </span>
            </button>

            {open && (
                <div
                    className="
                        tm-anim
                        absolute right-0 top-[42px] z-[100]
                        w-[300px]
                        overflow-hidden
                        rounded-xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                    "
                >
                    <div
                        className="
                            border-b border-[var(--border-soft)]
                            px-3.5 py-3
                        "
                    >
                        <div className="text-[13px] font-bold text-[var(--text)]">
                            Notifikasi
                        </div>

                        <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                            Informasi terbaru toko
                        </div>
                    </div>

                    {notifications.map((notification, index) => {
                        const Icon = notification.icon;

                        return (
                            <button
                                type="button"
                                key={index}
                                className="
                                    flex w-full
                                    items-start gap-2.5
                                    border-b border-[var(--border-soft)]
                                    px-3.5 py-2.5
                                    text-left
                                    text-[12.5px]
                                    text-[var(--text)]
                                    transition
                                    hover:bg-[var(--bg)]
                                "
                            >
                                <Icon
                                    size={15}
                                    className={[
                                        'mt-0.5 shrink-0',
                                        toneClass[notification.tone],
                                    ].join(' ')}
                                />

                                <span>{notification.text}</span>
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="
                            w-full
                            px-3.5 py-2.5
                            text-center
                            text-[11.5px]
                            font-semibold
                            text-[var(--primary)]
                            hover:bg-[var(--bg)]
                        "
                    >
                        Lihat semua notifikasi
                    </button>
                </div>
            )}
        </div>
    );
}