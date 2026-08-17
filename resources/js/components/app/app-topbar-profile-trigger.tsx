import { ChevronDown } from 'lucide-react';

interface AppTopbarProfileTriggerProps {
    open: boolean;
    onClick: () => void;
}

export default function AppTopbarProfileTrigger({
    open,
    onClick,
}: AppTopbarProfileTriggerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-haspopup="menu"
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
            {/* Avatar */}
            <div
                className="
                    flex size-[26px]
                    items-center justify-center
                    rounded-full
                    bg-[var(--primary)]
                    text-[11.5px]
                    font-bold
                    text-white
                "
            >
                AD
            </div>

            {/* User */}
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

            {/* Arrow */}
            <ChevronDown
                size={13}
                className={[
                    'text-[var(--text-soft)]',
                    'transition-transform duration-150',
                    open ? 'rotate-180' : '',
                ].join(' ')}
            />
        </button>
    );
}