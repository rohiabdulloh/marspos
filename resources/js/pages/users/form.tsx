import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import r from '@/lib/route';

export default function UserForm({ user = null, stores = [], onSuccess, onCancel }: any) {
    const isEdit = !!user;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        store_id: user?.store_id ? String(user.store_id) : 'none',
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: any) {
        e.preventDefault();
        
        if (data.store_id === 'none') {
            data.store_id = null as any; 
        }

        if (isEdit) {
            put(r('users.update', user.id), { 
                onSuccess: () => onSuccess?.() 
            });
        } else {
            post(r('users.store'), { 
                onSuccess: () => { reset(); onSuccess?.(); } 
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label>Cabang Toko</Label>
                <Select value={data.store_id} onValueChange={(val) => setData('store_id', val)}>
                    <SelectTrigger><SelectValue placeholder="Pilih Toko (Opsional)" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">-- Tanpa Toko (Pusat/Admin Utama) --</SelectItem>
                        {stores.map((store: any) => (
                            <SelectItem key={store.id} value={String(store.id)}>{store.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.store_id && <p className="text-sm text-red-500">{errors.store_id}</p>}
            </div>

            <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Pengguna" />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="user@example.com" />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Password {isEdit && '(Kosongkan jika tetap)'}</Label>
                    <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Konfirmasi Password</Label>
                    <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="••••••••" />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onCancel?.()}>Batal</Button>
                <Button type="submit" disabled={processing}>{isEdit ? 'Update Pengguna' : 'Simpan Pengguna'}</Button>
            </div>
        </form>
    );
}