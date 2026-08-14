import { Form, Head } from '@inertiajs/react';
import {
    Lock,
    Mail,
} from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthField from '@/components/auth/auth-field';

import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({
    token,
    email,
}: Props) {
    return (
        <>
            <Head title="Reset Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({
                    ...data,
                    token,
                    email,
                })}
                resetOnSuccess={[
                    'password',
                    'password_confirmation',
                ]}
                className="tm-anim"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Email */}
                        <AuthField
                            id="email"
                            name="email"
                            label="Email"
                            icon={Mail}
                            type="email"
                            value={email}
                            readOnly
                            autoComplete="email"
                            error={errors.email}
                        />

                        {/* New Password */}
                        <AuthField
                            id="password"
                            name="password"
                            label="Kata Sandi Baru"
                            icon={Lock}
                            type="password"
                            required
                            autoFocus
                            autoComplete="new-password"
                            placeholder="Masukkan kata sandi baru"
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
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi baru"
                            error={errors.password_confirmation}
                        />

                        {/* Submit */}
                        <div className="mt-2">
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                                data-test="reset-password-button"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Reset Kata Sandi'}
                            </AuthButton>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset kata sandi',
    description:
        'Masukkan kata sandi baru Anda untuk mendapatkan kembali akses ke akun.',
};