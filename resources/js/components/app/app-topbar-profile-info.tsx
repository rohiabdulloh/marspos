interface AppTopbarProfileInfoProps {
    name?: string;
    email?: string;
    role?: string;
}

export default function AppTopbarProfileInfo({
    name = 'Admin',
    email = 'admin@tanimakmur.id',
    role = 'Administrator',
}: AppTopbarProfileInfoProps) {
    return (
        <div
            className="
                border-b border-[var(--border-soft)]
                px-3.5 py-3
            "
        >
            <div className="font-semibold text-[var(--text)]">
                {name}
            </div>

            <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                {email}
            </div>
        </div>
    );
}