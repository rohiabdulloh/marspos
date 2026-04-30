import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    
    //Menampilkan Toast
    const { flash }: any = usePage().props;
    const lastMessage = useRef<string | null>(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;
        if (!message) return;

        // 🔥 cegah duplicate
        if (lastMessage.current === message) return;

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        lastMessage.current = message;
    }, [flash?.success, flash?.error]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
