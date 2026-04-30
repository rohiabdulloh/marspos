import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import r from '@/lib/route';

export default function AccountForm({
    account = null,
    parents = [],
    onSuccess,
    onCancel,
}: any) {

    const isEdit = !!account;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        code: account?.code || '',
        name: account?.name || '',
        type: account?.type || 'asset',
        parent_id: account?.parent_id ? String(account.parent_id) : '',
        is_active: account?.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('accounts.update', account.id), {
                onSuccess: () => {
                    onSuccess?.();
                },
            });
        } else {
            post(r('accounts.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="p4 space-y-4">

                {/* CODE */}
                <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                        className={errors.code ? 'border-red-500' : ''}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                    />
                    {errors.code && (
                        <p className="text-sm text-red-500">{errors.code}</p>
                    )}
                </div>

                {/* NAME */}
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        className={errors.name ? 'border-red-500' : ''}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                {/* TYPE */}
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                        value={data.type}
                        onValueChange={(value) => setData('type', value)}
                    >
                        <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asset">Asset</SelectItem>
                            <SelectItem value="liability">Liability</SelectItem>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.type && (
                        <p className="text-sm text-red-500">{errors.type}</p>
                    )}
                </div>

                {/* PARENT */}
                <div className="space-y-2">
                    <Label>Parent Account</Label>
                    <Select
                        value={data.parent_id}
                        onValueChange={(value) =>
                            setData('parent_id', value === '__none__' ? '' : value)
                        }
                    >
                        <SelectTrigger className={errors.parent_id ? 'border-red-500' : ''}>
                            <SelectValue placeholder="No Parent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__none__">No Parent</SelectItem>

                            {parents
                                .filter((p: any) => !isEdit || p.id !== account?.id) // 🔥 cegah parent dirinya sendiri
                                .map((p: any) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.code} - {p.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {errors.parent_id && (
                        <p className="text-sm text-red-500">
                            {errors.parent_id}
                        </p>
                    )}
                </div>

                {/* ACTIVE */}
                <div className="flex items-center gap-4">
                    <Label>Active</Label>
                    <Switch
                        checked={data.is_active}
                        onCheckedChange={(val) =>
                            setData('is_active', val)
                        }
                    />
                </div>

                {/* BUTTON */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onCancel?.()}
                    >
                        Batal
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? (isEdit ? 'Updating...' : 'Saving...')
                            : (isEdit ? 'Update Account' : 'Save Account')}
                    </Button>
                </div>

            </div>
        </form>
    );
}