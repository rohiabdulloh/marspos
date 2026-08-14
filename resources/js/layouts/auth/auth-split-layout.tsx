import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="min-h-svh bg-slate-50 lg:grid lg:grid-cols-2">

            {/* Left Branding */}
            <div className="relative hidden overflow-hidden bg-green-700 lg:flex">

                {/* Decorative Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-600" />

                    <div className="absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-green-800" />

                    <div className="absolute right-20 top-1/2 h-40 w-40 rounded-full border border-white/10" />
                </div>

                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

                    {/* Logo */}
                    <Link
                        href={home()}
                        className="flex items-center gap-3 text-white"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </div>

                        <div>
                            <div className="text-xl font-bold">
                                TaniPOS
                            </div>

                            <div className="text-xs text-green-100">
                                Point of Sale System
                            </div>
                        </div>
                    </Link>

                    {/* Main Message */}
                    <div className="max-w-xl">

                        <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                            Kelola toko pertanian lebih mudah dan terintegrasi.
                        </h2>

                        <p className="mt-6 max-w-lg text-base leading-7 text-green-100">
                            Kelola penjualan, pembelian, stok, pelanggan,
                            supplier, gudang, hingga keuangan dalam satu
                            sistem.
                        </p>

                        {/* Features */}
                        <div className="mt-9 grid gap-4 sm:grid-cols-2">

                            <div className="flex items-center gap-3 text-sm text-white">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    ✓
                                </span>
                                <span>Penjualan & Kasir</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-white">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    ✓
                                </span>
                                <span>Manajemen Inventori</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-white">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    ✓
                                </span>
                                <span>Pembelian & Supplier</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-white">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    ✓
                                </span>
                                <span>Laporan & Keuangan</span>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-green-200">
                        © {new Date().getFullYear()} TaniPOS
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex min-h-svh items-center justify-center px-6 py-10 sm:px-10">

                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="mb-10 flex justify-center lg:hidden">
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

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {title}
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {description}
                        </p>
                    </div>

                    {/* Form */}
                    {children}
                </div>
            </div>
        </div>
    );
}