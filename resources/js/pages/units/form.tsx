import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import r from '@/lib/route';

export default function UnitForm({
    unit = null,
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!unit;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: unit?.name || '',
        short_name: unit?.short_name || '',
        description: unit?.description || '',
        is_active: unit?.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('units.update', unit.id), {
                onSuccess: () => {
                    onSuccess?.();
                },
            });
        } else {
            post(r('units.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* NAME */}
            <div className="space-y-2">
                <Label>Nama Unit</Label>
                <Input
                    className={errors.name ? 'border-red-500' : ''}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Kilogram, Pcs, Liter"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* SHORT NAME / SIMBOL */}
            <div className="space-y-2">
                <Label>Simbol / Singkatan</Label>
                <Input
                    className={errors.short_name ? 'border-red-500' : ''}
                    value={data.short_name}
                    onChange={(e) => setData('short_name', e.target.value)}
                    placeholder="Contoh: kg, pcs, L"
                />
                {errors.short_name && <p className="text-sm text-red-500">{errors.short_name}</p>}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                    className={errors.description ? 'border-red-500' : ''}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Keterangan tambahan..."
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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

            {/* BUTTON */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" size="lg" variant="outline" onClick={() => onCancel?.()}>
                    Batal
                </Button>
                <Button type="submit" size="lg" disabled={processing}>
                    {processing
                        ? (isEdit ? 'Updating...' : 'Saving...')
                        : (isEdit ? 'Update Unit' : 'Simpan Unit')}
                </Button>
            </div>
        </form>
    );
}