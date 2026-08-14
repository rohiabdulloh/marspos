import { HelpCircle } from 'lucide-react';

export default function AppTopbarHelp() {
    return (
        <button
            type="button"
            title="Bantuan"
            className="
                tm-focus
                hidden size-[34px]
                items-center justify-center
                rounded-[9px]
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-soft)]
                transition
                hover:bg-[var(--bg)]
                sm:flex
            "
        >
            <HelpCircle size={16} />
        </button>
    );
}