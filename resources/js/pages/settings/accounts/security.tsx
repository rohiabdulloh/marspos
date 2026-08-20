import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] =
        useState<boolean>(false);

    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (
            prevTwoFactorEnabled.current &&
            !twoFactorEnabled
        ) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Pengaturan Keamanan" />

            <h1 className="sr-only">
                Pengaturan Keamanan
            </h1>

            {/* =====================================================
                UBAH PASSWORD
            ====================================================== */}

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Ubah Password"
                    description="Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman."
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({
                        errors,
                        processing,
                        recentlySuccessful,
                    }) => (
                        <>
                            {/* Password Saat Ini */}

                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    Password Saat Ini
                                </Label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    placeholder="Masukkan password saat ini"
                                />

                                <InputError
                                    message={
                                        errors.current_password
                                    }
                                />
                            </div>

                            {/* Password Baru */}

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Password Baru
                                </Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Masukkan password baru"
                                />

                                <InputError
                                    message={errors.password}
                                />
                            </div>

                            {/* Konfirmasi Password */}

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi Password
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Ulangi password baru"
                                />

                                <InputError
                                    message={
                                        errors.password_confirmation
                                    }
                                />
                            </div>

                            {/* Tombol Simpan */}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                >
                                    Simpan Password
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Berhasil disimpan
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* =====================================================
                TWO-FACTOR AUTHENTICATION
            ====================================================== */}

            {canManageTwoFactor && (
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Autentikasi Dua Faktor"
                        description="Kelola pengaturan autentikasi dua faktor untuk meningkatkan keamanan akun Anda."
                    />

                    {twoFactorEnabled ? (
                        /* =================================================
                           2FA AKTIF
                        ================================================== */

                        <div className="flex flex-col items-start justify-start space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Saat login, Anda akan diminta
                                memasukkan PIN keamanan acak yang
                                dapat diperoleh melalui aplikasi
                                yang mendukung TOTP di ponsel Anda.
                            </p>

                            <div className="relative inline">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Nonaktifkan 2FA
                                        </Button>
                                    )}
                                </Form>
                            </div>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={
                                    recoveryCodesList
                                }
                                fetchRecoveryCodes={
                                    fetchRecoveryCodes
                                }
                                errors={errors}
                            />
                        </div>
                    ) : (
                        /* =================================================
                           2FA BELUM AKTIF
                        ================================================== */

                        <div className="flex flex-col items-start justify-start space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Saat Anda mengaktifkan autentikasi
                                dua faktor, Anda akan diminta
                                memasukkan PIN keamanan ketika login.
                                PIN tersebut dapat diperoleh melalui
                                aplikasi yang mendukung TOTP di
                                ponsel Anda.
                            </p>

                            <div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        <ShieldCheck />
                                        Lanjutkan Pengaturan
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                Aktifkan 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        MODAL SETUP 2FA
                    ================================================== */}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() =>
                            setShowSetupModal(false)
                        }
                        requiresConfirmation={
                            requiresConfirmation
                        }
                        twoFactorEnabled={
                            twoFactorEnabled
                        }
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            )}
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Keamanan',
            href: edit(),
        },
    ],
};