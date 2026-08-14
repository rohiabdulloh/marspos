interface AppSidebarOverlayProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export default function AppSidebarOverlay({
    mobileOpen,
    onClose,
}: AppSidebarOverlayProps) {
    if (!mobileOpen) {
        return null;
    }

    return (
        <div
            className="
                fixed inset-0 z-[90]
                bg-[rgba(20,26,20,0.4)]
                lg:hidden
            "
            onClick={onClose}
        />
    );
}