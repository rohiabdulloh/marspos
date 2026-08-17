import { useState } from 'react';

import AppTopbarProfileTrigger from '@/components/app/app-topbar-profile-trigger';
import AppTopbarProfileMenu from '@/components/app/app-topbar-profile-menu';

export default function AppTopbarProfile() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <AppTopbarProfileTrigger
                open={open}
                onClick={() => setOpen((value) => !value)}
            />

            {open && (
                <AppTopbarProfileMenu
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}