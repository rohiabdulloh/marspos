import { Form, Head } from '@inertiajs/react';
import {
    MailCheck,
} from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import TextLink from '@/components/text-link';

import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({
    status,
}: {
    status?: string;
}) {
    return (
        <>
            <Head title="Verifikasi Email" />

            <div className="tm-anim">
                {/* Icon */}
                <div className="mb-5 flex justify-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[var(--primary-soft)]">
                        <MailCheck
                            size={28}
                            strokeWidth={1.8}
                            className="text-[var(--primary)]"
                        />
                    </div>
                </div>

                {/* Status */}
                {status === 'verification-link-sent' && (
                    <div className="mb-5 rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-4 py-3 text-center text-sm font-medium text-[var(--success)]">
                        Tautan verifikasi baru telah dikirim ke alamat
                        email yang Anda gunakan saat mendaftar.
                    </div>
                )}

                {/* Description */}
                <p className="mb-6 text-center text-[13px] leading-5 text-[var(--text-soft)]">
                    Jika Anda belum menerima email, silakan periksa folder
                    spam atau kirim ulang tautan verifikasi.
                </p>

                {/* Resend */}
                <Form
                    {...send.form()}
                    className="space-y-5 text-center"
                >
                    {({ processing }) => (
                        <>
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                            >
                                {processing
                                    ? 'Mengirim...'
                                    : 'Kirim Ulang Email Verifikasi'}
                            </AuthButton>

                            {/* Logout */}
                            <TextLink
                                href={logout()}
                                method="post"
                                className="mx-auto block text-[13px]"
                            >
                                Keluar dari akun
                            </TextLink>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi email',
    description:
        'Silakan verifikasi alamat email Anda dengan mengklik tautan yang telah kami kirimkan.',
};