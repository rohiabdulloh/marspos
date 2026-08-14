import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthField from '@/components/auth/auth-field';

import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="tm-anim"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Password */}
                        <AuthField
                            id="password"
                            name="password"
                            label="Kata Sandi"
                            icon={Lock}
                            type="password"
                            placeholder="Masukkan kata sandi"
                            autoComplete="current-password"
                            autoFocus
                            required
                            error={errors.password}
                        />

                        {/* Submit */}
                        <div className="mt-2">
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                                data-test="confirm-password-button"
                            >
                                {processing
                                    ? 'Memeriksa...'
                                    : 'Konfirmasi Kata Sandi'}
                            </AuthButton>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi kata sandi',
    description:
        'Ini adalah area aman aplikasi. Silakan konfirmasi kata sandi Anda sebelum melanjutkan.',
};