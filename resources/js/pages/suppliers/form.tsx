import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import r from '@/lib/route';

export default function SupplierForm({
    supplier = null,
    onSuccess,
    onCancel,
}: any) {

    const isEdit = !!supplier;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: supplier?.name || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r('suppliers.update', supplier.id), {
                onSuccess: () => {
                    onSuccess?.();
                },
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

            {/* EMAIL */}
            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    type="email"
                    className={errors.email ? 'border-red-500' : ''}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
            </div>

            {/* PHONE */}
            <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                    className={errors.phone ? 'border-red-500' : ''}
                    value={data.phone}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+\-() ]/g, '');
                        setData('phone', val);
                    }}
                />
                {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                )}
            </div>

            {/* ADDRESS */}
            <div className="space-y-2">
                <Label>Address</Label>
                <Input
                    className={errors.address ? 'border-red-500' : ''}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                />
                {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                )}
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
                        : (isEdit ? 'Update Supplier' : 'Save Supplier')}
                </Button>
            </div>

        </form>
    );
}