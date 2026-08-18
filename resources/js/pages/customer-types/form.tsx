import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import r from '@/lib/route';

export default function CustomerTypeForm({
    customerType = null,
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!customerType;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: customerType?.name || '',
        description: customerType?.description || '',
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('customer-types.update', customerType.id), {
                onSuccess: () => {
                    onSuccess?.();
                },
            });
        } else {
            post(r('customer-types.store'), {
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
                <Label>Nama Tipe Customer</Label>
                <Input
                    className={errors.name ? 'border-red-500' : ''}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Grosir, VIP, Retail"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                    className={errors.description ? 'border-red-500' : ''}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Keterangan tambahan mengenai tipe customer ini..."
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" size="lg" variant="outline" onClick={() => onCancel?.()}>
                    Batal
                </Button>
                <Button type="submit" size="lg" disabled={processing}>
                    {processing
                        ? (isEdit ? 'Updating...' : 'Saving...')
                        : (isEdit ? 'Update Tipe Customer' : 'Simpan Tipe Customer')}
                </Button>
            </div>
        </form>
    );
}