import { Search } from 'lucide-react';

interface AppTopbarSearchProps {
    placeholder?: string;
}

export default function AppTopbarSearch({
    placeholder = 'Cari produk, transaksi, pelanggan...',
}: AppTopbarSearchProps) {
    return (
        <div className="relative w-full max-w-[420px]">
            <Search
                size={16}
                className="
                    pointer-events-none
                    absolute left-3.5 top-1/2
                    -translate-y-1/2
                    text-[var(--text-faint)]
                "
            />

            <input
                type="search"
                placeholder={placeholder}
                className="
                    tm-focus
                    h-[36px]
                    w-full
                    rounded-[9px]
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    pl-10 pr-3.5
                    text-[12.5px]
                    text-[var(--text)]
                    outline-none
                    transition
                    placeholder:text-[var(--text-faint)]
                    focus:border-[var(--primary)]
                    focus:ring-2
                    focus:ring-[var(--primary)]/10
                "
            />
        </div>
    );
}