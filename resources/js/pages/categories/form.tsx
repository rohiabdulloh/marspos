import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import r from '@/lib/route';

export default function CategoryForm({
    category = null,
    parentCategories = [],
    onSuccess,
    onCancel,
}: any) {
    const isEdit = !!category;

    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        parent_id: category?.parent_id ? String(category.parent_id) : '',
        is_active: category?.is_active ?? true,
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

        if (isEdit) {
            put(r('categories.update', category.id), {
                onSuccess: () => {
                    onSuccess?.();
                },
            });
        } else {
            post(r('categories.store'), {
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
                <Label>Nama Kategori</Label>
                <Input
                    className={errors.name ? 'border-red-500' : ''}
                    value={data.name}
                    onChange={(e) => {
                        const val = e.target.value;
                        setData((prev) => ({
                            ...prev,
                            name: val,
                            // Slug otomatis terisi saat menambah data baru (jika tidak sedang mode edit manual)
                            slug: !isEdit ? generateSlug(val) : prev.slug,
                        }));
                    }}
                    placeholder="Contoh: Pupuk Organik"
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
                    placeholder="Contoh: pupuk-organik"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>

            {/* PARENT CATEGORY */}
            <div className="space-y-2">
                <Label>Kategori Induk (Opsional)</Label>
                <Select
                    value={data.parent_id}
                    onValueChange={(val) => setData('parent_id', val === 'none' ? '' : val)}
                >
                    <SelectTrigger className={errors.parent_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih Kategori Induk" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">-- Tanpa Induk --</SelectItem>
                        {parentCategories
                            .filter((p: any) => p.id !== category?.id)
                            .map((p: any) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                {errors.parent_id && <p className="text-sm text-red-500">{errors.parent_id}</p>}
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
                        : (isEdit ? 'Update Kategori' : 'Simpan Kategori')}
                </Button>
            </div>
        </form>
    );
}