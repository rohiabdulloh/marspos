import { Form, Head } from '@inertiajs/react';
import {
    Lock,
    Mail,
} from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthCheckbox from '@/components/auth/auth-checkbox';
import AuthField from '@/components/auth/auth-field';

import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="tm-anim"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Status */}
                        {status && (
                            <div className="mb-5 rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)]">
                                {status}
                            </div>
                        )}

                        {/* Form */}
                        <div>
                            {/* Email */}
                            <AuthField
                                id="email"
                                name="email"
                                label="Email"
                                icon={Mail}
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                tabIndex={1}
                                placeholder="nama@tokoanda.id"
                                error={errors.email}
                            />

                            {/* Password */}
                            <AuthField
                                id="password"
                                name="password"
                                label="Kata Sandi"
                                icon={Lock}
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Masukkan kata sandi"
                                error={errors.password}
                            />

                            {/* Remember + Forgot */}
                            <div className="mb-[22px] flex items-center justify-between">
                                <AuthCheckbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                >
                                    Ingat saya
                                </AuthCheckbox>

                                {canResetPassword && (
                                    <a
                                        href={request().url}
                                        tabIndex={5}
                                        className="tm-focus text-[12.8px] font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
                                    >
                                        Lupa kata sandi?
                                    </a>
                                )}
                            </div>

                            {/* Login */}
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                                tabIndex={4}
                                data-test="login-button"
                            >
                                {processing
                                    ? 'Memeriksa...'
                                    : 'Masuk'}
                            </AuthButton>

                            {/* Register */}
                            {canRegister && (
                                <p className="mt-[26px] text-center text-[13px] text-[var(--text-soft)]">
                                    Belum punya akun toko?{' '}

                                    <a
                                        href={register().url}
                                        tabIndex={6}
                                        className="tm-focus font-bold text-[var(--primary)] hover:text-[var(--primary-dark)]"
                                    >
                                        Daftar sekarang
                                    </a>
                                </p>
                            )}
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Masuk ke akun Anda',
    description: 'Kelola penjualan dan stok toko Anda hari ini.',
};