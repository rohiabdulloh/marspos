import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import r from '@/lib/route';

export default function SupplierForm({
    supplier = null,
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!supplier;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        code: supplier?.code || '',
        name: supplier?.name || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
        city: supplier?.city || '',
        province: supplier?.province || '',
        postal_code: supplier?.postal_code || '',
        contact_person: supplier?.contact_person || '',
        payment_term_days: supplier?.payment_term_days ?? 0,
        notes: supplier?.notes || '',
        is_active: supplier?.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('suppliers.update', supplier.id), {
                onSuccess: () => onSuccess?.(),
            });
        } else {
            post(r('suppliers.store'), {
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
                    <Label>Kode Supplier</Label>
                    <Input
                        className={errors.code ? 'border-red-500' : ''}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        placeholder="Contoh: SUP-001"
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>

                {/* NAMA */}
                <div className="space-y-2">
                    <Label>Nama Supplier / Perusahaan</Label>
                    <Input
                        className={errors.name ? 'border-red-500' : ''}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="PT Maju Sejahtera"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CONTACT PERSON */}
                <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        placeholder="Nama narahubung"
                    />
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

                {/* EMAIL */}
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        className={errors.email ? 'border-red-500' : ''}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="supplier@example.com"
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
                    placeholder="Jalan, Gedung, Kompleks..."
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
                        placeholder="Contoh: Jakarta Pusat"
                    />
                </div>
                {/* PROVINSI */}
                <div className="space-y-2">
                    <Label>Provinsi</Label>
                    <Input
                        value={data.province}
                        onChange={(e) => setData('province', e.target.value)}
                        placeholder="Contoh: DKI Jakarta"
                    />
                </div>
                {/* KODE POS */}
                <div className="space-y-2">
                    <Label>Kode Pos</Label>
                    <Input
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        placeholder="10110"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PAYMENT TERM */}
                <div className="space-y-2">
                    <Label>Termin Pembayaran (Hari)</Label>
                    <Input
                        type="number"
                        value={data.payment_term_days}
                        onChange={(e) => setData('payment_term_days', e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* NOTES */}
            <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Catatan tambahan..."
                />
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
                    {processing ? 'Menyimpan...' : (isEdit ? 'Update Supplier' : 'Simpan Supplier')}
                </Button>
            </div>
        </form>
    );
}