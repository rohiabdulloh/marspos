import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthField from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';

import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({
    status,
}: {
    status?: string;
}) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            <div className="tm-anim">
                {/* Status */}
                {status && (
                    <div className="mb-5 rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-4 py-3 text-sm font-medium text-[var(--success)]">
                        {status}
                    </div>
                )}

                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
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
                                placeholder="nama@tokoanda.id"
                                error={errors.email}
                            />

                            {/* Submit */}
                            <div className="mt-2">
                                <AuthButton
                                    type="submit"
                                    full
                                    size="lg"
                                    loading={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing
                                        ? 'Mengirim...'
                                        : 'Kirim Tautan Reset'}
                                </AuthButton>
                            </div>
                        </>
                    )}
                </Form>

                {/* Back to Login */}
                <div className="mt-6 text-center text-[13px] text-[var(--text-soft)]">
                    Atau kembali ke{' '}

                    <TextLink href={login()}>
                        Log In
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa kata sandi?',
    description:
        'Masukkan email Anda untuk menerima tautan reset kata sandi.',
};