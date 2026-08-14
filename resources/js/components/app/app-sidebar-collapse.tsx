import {
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

interface AppSidebarCollapseProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function AppSidebarCollapse({
    collapsed,
    onToggle,
}: AppSidebarCollapseProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={[
                'tm-focus',
                'flex items-center',
                'border-t border-white/[0.08]',
                'py-3',
                'text-xs text-white/[0.55]',
                'transition-colors',
                'hover:bg-white/[0.04]',
                'hover:text-white/80',
                collapsed
                    ? 'justify-center px-4'
                    : 'justify-end gap-1.5 px-4',
            ].join(' ')}
        >
            {collapsed ? (
                <ChevronsRight size={16} />
            ) : (
                <>
                    <ChevronsLeft size={16} />
                    Ciutkan
                </>
            )}
        </button>
    );
}