interface AuthErrorProps {
    children: React.ReactNode;
}

export default function AuthError({
    children,
}: AuthErrorProps) {
    return (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">
                !
            </div>

            <p>{children}</p>
        </div>
    );
}