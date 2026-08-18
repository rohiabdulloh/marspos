import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import r from '@/lib/route';

export default function WarehouseForm({
    warehouse = null,
    stores = [],
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!warehouse;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        store_id: warehouse?.store_id ? String(warehouse.store_id) : '',
        code: warehouse?.code || '',
        name: warehouse?.name || '',
        phone: warehouse?.phone || '',
        address: warehouse?.address || '',
        is_main: warehouse?.is_main ?? false,
        is_active: warehouse?.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('warehouses.update', warehouse.id), {
                onSuccess: () => onSuccess?.(),
            });
        } else {
            post(r('warehouses.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* STORE */}
            <div className="space-y-2">
                <Label>Toko</Label>
                <Select
                    value={data.store_id}
                    onValueChange={(val) => setData('store_id', val)}
                >
                    <SelectTrigger className={errors.store_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih Toko" />
                    </SelectTrigger>
                    <SelectContent>
                        {stores.map((s: any) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.store_id && <p className="text-sm text-red-500">{errors.store_id}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KODE */}
                <div className="space-y-2">
                    <Label>Kode Gudang</Label>
                    <Input
                        className={errors.code ? 'border-red-500' : ''}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        placeholder="Contoh: GDG-01"
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>

                {/* NAMA */}
                <div className="space-y-2">
                    <Label>Nama Gudang</Label>
                    <Input
                        className={errors.name ? 'border-red-500' : ''}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Gudang Utama Pusat"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
            </div>

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

            {/* ALAMAT */}
            <div className="space-y-2">
                <Label>Alamat</Label>
                <Textarea
                    className={errors.address ? 'border-red-500' : ''}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Lokasi fisik gudang..."
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="flex flex-col gap-2 pt-2">
                {/* IS MAIN */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_main"
                        checked={data.is_main}
                        onCheckedChange={(checked) => setData('is_main', !!checked)}
                    />
                    <Label htmlFor="is_main" className="cursor-pointer">Jadikan Gudang Utama</Label>
                </div>

                {/* IS ACTIVE */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">Status Aktif</Label>
                </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" size="lg" variant="outline" onClick={() => onCancel?.()}>
                    Batal
                </Button>
                <Button type="submit" size="lg" disabled={processing}>
                    {processing ? 'Menyimpan...' : (isEdit ? 'Update Gudang' : 'Simpan Gudang')}
                </Button>
            </div>
        </form>
    );
}