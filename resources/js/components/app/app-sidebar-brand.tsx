import { Sprout } from 'lucide-react';

interface AppSidebarBrandProps {
    collapsed: boolean;
}

export default function AppSidebarBrand({
    collapsed,
}: AppSidebarBrandProps) {
    return (
        <div
            className={[
                'flex items-center',
                'border-b border-white/[0.08]',
                collapsed
                    ? 'justify-center px-0 py-[18px]'
                    : 'gap-2.5 px-4 py-[18px]',
            ].join(' ')}
        >
            <div
                className="
                    flex size-[34px] shrink-0
                    items-center justify-center
                    rounded-[9px]
                    bg-[var(--accent)]
                "
            >
                <Sprout
                    size={19}
                    className="text-[var(--primary-dark)]"
                />
            </div>

            {!collapsed && (
                <div>
                    <div
                        className="
                            tm-display
                            text-[14.5px]
                            font-bold
                            leading-[1.1]
                        "
                    >
                        Tani Makmur
                    </div>

                    <div
                        className="
                            mt-0.5
                            text-[10.5px]
                            tracking-[0.5px]
                            text-white/55
                        "
                    >
                        POS &amp; INVENTORY
                    </div>
                </div>
            )}
        </div>
    );
}