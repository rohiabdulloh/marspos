import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-white">
            <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-6 py-10">

                {/* Logo */}
                <div className="mb-10 flex justify-center">
                    <Link
                        href={home()}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-600">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            TaniPOS
                        </span>

                        <span className="mt-1 text-xs text-slate-500">
                            Point of Sale System
                        </span>
                    </Link>
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {description}
                    </p>
                </div>

                {/* Content */}
                {children}

                {/* Footer */}
                <p className="mt-10 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} TaniPOS
                </p>
            </div>
        </div>
    );
}