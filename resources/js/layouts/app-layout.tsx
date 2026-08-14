import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AppGlobalStyle from '@/layouts/app/app-global-style';
import type { BreadcrumbItem } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface AppLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}

interface FlashProps {
    success?: string;
    error?: string;
}

interface AppPageProps extends InertiaPageProps {
    flash?: FlashProps;
}

export default function AppLayout({
    breadcrumbs = [],
    children,
}: AppLayoutProps) {
    const { flash } = usePage<AppPageProps>().props;

    const lastMessage = useRef<string | null>(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;

        if (!message) {
            return;
        }

        // Mencegah toast yang sama muncul dua kali
        if (lastMessage.current === message) {
            return;
        }

        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        lastMessage.current = message;
    }, [flash?.success, flash?.error]);

    return (
        <>
            <AppGlobalStyle />

            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                {children}
            </AppSidebarLayout>
        </>
    );
}