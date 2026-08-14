import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="min-h-svh bg-slate-50">
            <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-6 py-10">

                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link
                        href={home()}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </div>

                        <div className="text-left">
                            <div className="text-xl font-bold text-slate-900">
                                TaniPOS
                            </div>

                            <div className="text-xs text-slate-500">
                                Point of Sale System
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="px-6 pt-7 text-center sm:px-8">
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                            {title}
                        </CardTitle>

                        <CardDescription className="mt-2 text-sm leading-6 text-slate-500">
                            {description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-7 sm:px-8">
                        {children}
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} TaniPOS. All rights reserved.
                </p>
            </div>
        </div>
    );
}