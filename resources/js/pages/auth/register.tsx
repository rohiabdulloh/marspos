import { Form, Head } from '@inertiajs/react';
import {
    Lock,
    Mail,
    User,
} from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthField from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';

import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />

            <Form
                {...store.form()}
                resetOnSuccess={[
                    'password',
                    'password_confirmation',
                ]}
                disableWhileProcessing
                className="tm-anim"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Name */}
                        <AuthField
                            id="name"
                            name="name"
                            label="Nama Lengkap"
                            icon={User}
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            placeholder="Masukkan nama lengkap"
                            error={errors.name}
                        />

                        {/* Email */}
                        <AuthField
                            id="email"
                            name="email"
                            label="Email"
                            icon={Mail}
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
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
                            tabIndex={3}
                            autoComplete="new-password"
                            placeholder="Masukkan kata sandi"
                            error={errors.password}
                        />

                        {/* Confirm Password */}
                        <AuthField
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Konfirmasi Kata Sandi"
                            icon={Lock}
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi"
                            error={errors.password_confirmation}
                        />

                        {/* Submit */}
                        <div className="mt-2">
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing
                                    ? 'Membuat akun...'
                                    : 'Buat Akun'}
                            </AuthButton>
                        </div>

                        {/* Login */}
                        <p className="mt-[26px] text-center text-[13px] text-[var(--text-soft)]">
                            Sudah punya akun?{' '}

                            
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat akun toko',
    description:
        'Daftarkan akun Anda untuk mulai mengelola toko dan penjualan.',
};