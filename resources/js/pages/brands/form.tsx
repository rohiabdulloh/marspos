import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import r from '@/lib/route';

export default function BrandForm({
    brand = null,
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!brand;

    const { data, setData, post, transform, errors, processing, reset } = useForm({
        name: brand?.name || '',
        slug: brand?.slug || '',
        logo: null as File | null,
        description: brand?.description || '',
        is_active: brand?.is_active ?? true,
        _method: isEdit ? 'PUT' : 'POST', // Trick untuk upload file menggunakan method PUT di Laravel
    });

    // Fungsi helper untuk generate slug secara otomatis dari nama
    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')    // Hapus karakter khusus
            .replace(/[\s_-]+/g, '-')     // Ganti spasi/underscore dengan dash (-)
            .replace(/^-+|-+$/g, '');     // Hapus dash di awal/akhir
    };

    function submit(e: any) {
        e.preventDefault();

        // Gunakan brands.update jika edit, brands.store jika create
        const routeName = isEdit ? r('brands.update', brand.id) : r('brands.store');

        post(routeName, {
            forceFormData: true,
            onSuccess: () => {
                if (!isEdit) reset();
                onSuccess?.();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* NAME */}
            <div className="space-y-2">
                <Label>Nama Brand</Label>
                <Input
                    className={errors.name ? 'border-red-500' : ''}
                    value={data.name}
                    onChange={(e) => {
                        const val = e.target.value;
                        setData((prev: any) => ({
                            ...prev,
                            name: val,
                            slug: !isEdit ? generateSlug(val) : prev.slug,
                        }));
                    }}
                    placeholder="Contoh: Bayer, Syngenta"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* SLUG */}
            <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                    className={errors.slug ? 'border-red-500' : ''}
                    value={data.slug}
                    onChange={(e) => setData('slug', generateSlug(e.target.value))}
                    placeholder="Contoh: bayer"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>

            {/* LOGO */}
            <div className="space-y-2">
                <Label>Logo Brand (Opsional)</Label>
                {brand?.logo && (
                    <div className="mb-2">
                        <img 
                            src={`/storage/${brand.logo}`} 
                            alt={brand.name} 
                            className="w-16 h-16 object-cover rounded-md border"
                        />
                    </div>
                )}
                <Input
                    type="file"
                    className={errors.logo ? 'border-red-500' : ''}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                />
                {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
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
                        : (isEdit ? 'Update Brand' : 'Simpan Brand')}
                </Button>
            </div>
        </form>
    );
}