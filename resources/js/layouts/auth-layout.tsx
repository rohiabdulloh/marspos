import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import AuthGlobalStyle from '@/layouts/auth/auth-global-style';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <>
        <AuthGlobalStyle />
        <div className="tm-root">
            <AuthLayoutTemplate title={title} description={description}>
                {children}
            </AuthLayoutTemplate>
        </div>
        </>
    );
}
