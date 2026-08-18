import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import r from '@/lib/route';

export default function StoreForm({
    store = null,
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!store;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        code: store?.code || '',
        name: store?.name || '',
        phone: store?.phone || '',
        email: store?.email || '',
        address: store?.address || '',
        city: store?.city || '',
        province: store?.province || '',
        postal_code: store?.postal_code || '',
        logo: store?.logo || '',
        is_active: store?.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('stores.update', store.id), {
                onSuccess: () => onSuccess?.(),
            });
        } else {
            post(r('stores.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KODE */}
                <div className="space-y-2">
                    <Label>Kode Toko</Label>
                    <Input
                        className={errors.code ? 'border-red-500' : ''}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        placeholder="Contoh: TK-01"
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>

                {/* NAMA */}
                <div className="space-y-2">
                    <Label>Nama Toko Cabang</Label>
                    <Input
                        className={errors.name ? 'border-red-500' : ''}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Toko Cabang Sudirman"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TELEPON */}
                <div className="space-y-2">
                    <Label>No. Telepon</Label>
                    <Input
                        className={errors.phone ? 'border-red-500' : ''}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="08123456789"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        className={errors.email ? 'border-red-500' : ''}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="toko@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
            </div>

            {/* ALAMAT */}
            <div className="space-y-2">
                <Label>Alamat Lengkap</Label>
                <Textarea
                    className={errors.address ? 'border-red-500' : ''}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Lokasi fisik toko..."
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KOTA */}
                <div className="space-y-2">
                    <Label>Kota / Kabupaten</Label>
                    <Input
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        placeholder="Contoh: Tegal"
                    />
                </div>
                {/* PROVINSI */}
                <div className="space-y-2">
                    <Label>Provinsi</Label>
                    <Input
                        value={data.province}
                        onChange={(e) => setData('province', e.target.value)}
                        placeholder="Contoh: Jawa Tengah"
                    />
                </div>
                {/* KODE POS */}
                <div className="space-y-2">
                    <Label>Kode Pos</Label>
                    <Input
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        placeholder="52192"
                    />
                </div>
            </div>

            {/* IS ACTIVE */}
            <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Status Aktif</Label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" size="lg" variant="outline" onClick={() => onCancel?.()}>
                    Batal
                </Button>
                <Button type="submit" size="lg" disabled={processing}>
                    {processing ? 'Menyimpan...' : (isEdit ? 'Update Toko' : 'Simpan Toko')}
                </Button>
            </div>
        </form>
    );
}