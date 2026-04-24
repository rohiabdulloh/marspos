'use client';

import * as React from 'react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

type ConfirmDialogProps = {
    trigger: React.ReactNode;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
    trigger,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
}: ConfirmDialogProps) {
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md w-[90%] rounded-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? 'Processing...' : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}