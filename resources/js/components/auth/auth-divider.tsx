export default function AuthDivider({
    children = 'ATAU',
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="my-[22px] flex items-center gap-2.5">
            <div className="h-px flex-1 bg-[var(--border)]" />

            <span className="text-[11.5px] font-medium text-[var(--text-faint)]">
                {children}
            </span>

            <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
    );
}