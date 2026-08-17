import AppTopbarProfileInfo from '@/components/app/app-topbar-profile-info';
import AppTopbarProfileItem from '@/components/app/app-topbar-profile-item';
import r from '@/lib/route';

interface AppTopbarProfileMenuProps {
    onClose?: () => void;
}

export default function AppTopbarProfileMenu({
    onClose,
}: AppTopbarProfileMenuProps) {
    return (
        <div
            className="
                tm-anim
                absolute right-0 top-[42px] z-[100]
                w-[190px]
                overflow-hidden
                rounded-xl
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[13px]
                shadow-[0_12px_28px_rgba(0,0,0,0.12)]
            "
            role="menu"
        >
            <AppTopbarProfileInfo
                name="Admin"
                email="admin@tanimakmur.id"
                role="Administrator"
            />

            <AppTopbarProfileItem
                href={r('profile.edit')}
                onClick={onClose}
            >
                Profil Saya
            </AppTopbarProfileItem>

            <AppTopbarProfileItem
                href={r('appearance.edit')}
                onClick={onClose}
            >
                Pengaturan
            </AppTopbarProfileItem>

            <AppTopbarProfileItem
                href="/logout"
                method="post"
                as="button"
                danger
                onClick={onClose}
            >
                Keluar
            </AppTopbarProfileItem>
        </div>
    );
}