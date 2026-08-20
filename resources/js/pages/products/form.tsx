import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import r from '@/lib/route';

export default function ProductForm({ product = null, categories = [], brands = [], units = [] }: any) {
    const isEdit = !!product;

    const { data, setData, post, put, errors, processing } = useForm({
        category_id: product?.category_id ? String(product.category_id) : '',
        brand_id: product?.brand_id ? String(product.brand_id) : '',
        base_unit_id: product?.base_unit_id ? String(product.base_unit_id) : '',
        sku: product?.sku || '',
        barcode: product?.barcode || '',
        name: product?.name || '',
        type: product?.type || 'product',
        description: product?.description || '',
        purchase_price: product?.purchase_price || 0,
        selling_price: product?.selling_price || 0,
        minimum_stock: product?.minimum_stock || 0,
        maximum_stock: product?.maximum_stock || '',
        has_batch: product?.has_batch ?? false,
        has_expiry: product?.has_expiry ?? false,
        is_active: product?.is_active ?? true,
        units: product?.product_units || [],
        prices: product?.product_prices || [],
    });

    function submit(e: any) {
        e.preventDefault();
        if (isEdit) {
            put(r('products.update', product.id));
        } else {
            post(r('products.store'));
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Batal</Button>
                    <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Produk'}</Button>
                </div>
            </div>

            {/* Informasi Dasar */}
            <Card>
                <CardHeader><CardTitle>Informasi Utama</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nama Produk</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nama produk..." />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input value={data.sku} onChange={e => setData('sku', e.target.value)} placeholder="SKU-001" />
                        {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                            <SelectContent>
                                {categories.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Satuan Dasar (Pcs/Unit Terkecil)</Label>
                        <Select value={data.base_unit_id} onValueChange={val => setData('base_unit_id', val)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Satuan Dasar" /></SelectTrigger>
                            <SelectContent>
                                {units.map((u: any) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.base_unit_id && <p className="text-xs text-red-500">{errors.base_unit_id}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Harga Beli Dasar</Label>
                        <Input type="number" value={data.purchase_price} onChange={e => setData('purchase_price', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Harga Jual Dasar</Label>
                        <Input type="number" value={data.selling_price} onChange={e => setData('selling_price', Number(e.target.value))} />
                    </div>
                </CardContent>
            </Card>

            {/* Pengelolaan Multi-Satuan */}
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Konversi Satuan (Multi-Unit)</CardTitle>
                    <Button type="button" size="sm" onClick={() => setData('units', [...data.units, { unit_id: '', conversion_factor: 1, purchase_price: 0, selling_price: 0 }])}>
                        <Plus size={16} className="mr-1" /> Tambah Satuan
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.units.map((unit: any, index: number) => (
                        <div key={index} className="flex gap-2 items-center border p-3 rounded-md">
                            <Select value={String(unit.unit_id)} onValueChange={val => {
                                const newUnits = [...data.units];
                                newUnits[index].unit_id = val;
                                setData('units', newUnits);
                            }}>
                                <SelectTrigger><SelectValue placeholder="Pilih Satuan" /></SelectTrigger>
                                <SelectContent>
                                    {units.map((u: any) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input type="number" placeholder="Faktor Konversi (Cth: 1 Dus = 12)" value={unit.conversion_factor} onChange={e => {
                                const newUnits = [...data.units];
                                newUnits[index].conversion_factor = Number(e.target.value);
                                setData('units', newUnits);
                            }} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => {
                                setData('units', data.units.filter((_: any, i: number) => i !== index));
                            }}><Trash2 size={16} /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Pengelolaan Multi-Harga */}
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Level Harga & Grosir (Multi-Price)</CardTitle>
                    <Button type="button" size="sm" onClick={() => setData('prices', [...data.prices, { price_type: 'general', price: 0, minimum_quantity: 1 }])}>
                        <Plus size={16} className="mr-1" /> Tambah Harga
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.prices.map((price: any, index: number) => (
                        <div key={index} className="flex gap-2 items-center border p-3 rounded-md">
                            <Input placeholder="Tipe (Cth: Member / Grosir)" value={price.price_type} onChange={e => {
                                const newPrices = [...data.prices];
                                newPrices[index].price_type = e.target.value;
                                setData('prices', newPrices);
                            }} />
                            <Input type="number" placeholder="Harga" value={price.price} onChange={e => {
                                const newPrices = [...data.prices];
                                newPrices[index].price = Number(e.target.value);
                                setData('prices', newPrices);
                            }} />
                            <Input type="number" placeholder="Min Qty" value={price.minimum_quantity} onChange={e => {
                                const newPrices = [...data.prices];
                                newPrices[index].minimum_quantity = Number(e.target.value);
                                setData('prices', newPrices);
                            }} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => {
                                setData('prices', data.prices.filter((_: any, i: number) => i !== index));
                            }}><Trash2 size={16} /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </form>
    );
}