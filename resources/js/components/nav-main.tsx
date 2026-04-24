import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    // 🔹 Kalau tidak punya submenu
                    if (!item.items) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href ? isCurrentUrl(item.href) : false}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href!} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // 🔹 Kalau punya submenu
                    return (
                        <div key={item.title} className="mt-2">
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {item.title}
                            </div>

                            {item.items.map((sub) => (
                                <SidebarMenuItem key={sub.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={sub.href ? isCurrentUrl(sub.href) : false}
                                        tooltip={{ children: sub.title }}
                                    >
                                        <Link href={sub.href!} prefetch>
                                            {sub.icon && <sub.icon />}
                                            <span>{sub.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}