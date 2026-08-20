import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import r from '@/lib/route';

export default function RoleForm({ role = null, onSuccess, onCancel }: any) {
    const isEdit = !!role;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: role?.name || '',
    });

    function submit(e: any) {
        e.preventDefault();
        if (isEdit) {
            put(r('roles.update', role.id), { 
                onSuccess: () => onSuccess?.() 
            });
        } else {
            post(r('roles.store'), {
                onSuccess: () => { reset(); onSuccess?.(); }
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label>Nama Role</Label>
                <Input 
                    value={data.name} 
                    onChange={(e) => setData('name', e.target.value)} 
                    placeholder="Contoh: kasir, manager, gudang" 
                    required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onCancel?.()}>Batal</Button>
                <Button type="submit" disabled={processing}>{isEdit ? 'Update Role' : 'Simpan Role'}</Button>
            </div>
        </form>
    );
}