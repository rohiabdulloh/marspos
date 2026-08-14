import { Form, Head, setLayoutProps  } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

import AuthButton from '@/components/auth/auth-button';
import AuthField from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] =
        useState<boolean>(false);

    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode pemulihan',
                description:
                    'Masukkan salah satu kode pemulihan untuk mengakses kembali akun Anda.',
                toggleText:
                    'masuk menggunakan kode autentikasi',
            };
        }

        return {
            title: 'Verifikasi dua faktor',
            description:
                'Masukkan kode autentikasi dari aplikasi authenticator Anda untuk melanjutkan.',
            toggleText:
                'masuk menggunakan kode pemulihan',
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (
        clearErrors: () => void,
    ): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Verifikasi dua faktor" />

            <div className="tm-anim">
                <Form
                    {...store.form()}
                    className="space-y-5"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({
                        errors,
                        processing,
                        clearErrors,
                    }) => (
                        <>
                            {showRecoveryInput ? (
                                <>
                                    {/* Recovery Code */}
                                    <AuthField
                                        id="recovery_code"
                                        name="recovery_code"
                                        label="Kode Pemulihan"
                                        icon={KeyRound}
                                        type="text"
                                        placeholder="Masukkan kode pemulihan"
                                        autoFocus
                                        required
                                        autoComplete="off"
                                        error={errors.recovery_code}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Authentication Code */}
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
                                            <ShieldCheck
                                                size={24}
                                                strokeWidth={1.8}
                                                className="text-[var(--primary)]"
                                            />
                                        </div>

                                        <label className="mb-3 text-[12.5px] font-semibold text-[var(--text-soft)]">
                                            Kode Autentikasi
                                        </label>

                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) =>
                                                setCode(value)
                                            }
                                            disabled={processing}
                                            pattern={
                                                REGEXP_ONLY_DIGITS
                                            }
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    {
                                                        length: OTP_MAX_LENGTH,
                                                    },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="
                                                                size-11
                                                                rounded-lg
                                                                border-[1.5px]
                                                                border-[var(--border)]
                                                                bg-white
                                                                text-base
                                                                font-semibold
                                                                text-[var(--text)]
                                                                shadow-none
                                                                first:rounded-lg
                                                                first:border-l
                                                                last:rounded-lg
                                                                focus-within:border-[var(--primary)]
                                                                focus-within:ring-2
                                                                focus-within:ring-[var(--primary)]/10
                                                            "
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>

                                        {errors.code && (
                                            <p className="mt-2 text-xs font-medium text-[var(--danger)]">
                                                {errors.code}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Submit */}
                            <AuthButton
                                type="submit"
                                full
                                size="lg"
                                loading={processing}
                            >
                                {processing
                                    ? 'Memverifikasi...'
                                    : 'Lanjutkan'}
                            </AuthButton>

                            {/* Toggle */}
                            <div className="text-center text-[13px] text-[var(--text-soft)]">
                                <span>atau </span>

                                <TextLink
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();

                                        toggleRecoveryMode(
                                            clearErrors,
                                        );
                                    }}
                                    className="font-semibold"
                                >
                                    {authConfigContent.toggleText}
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}