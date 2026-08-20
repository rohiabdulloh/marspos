import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import r from '@/lib/route';

export default function PromotionForm({ promotion = null, products = [], onSuccess, onCancel }: any) {
    const isEdit = !!promotion;
    const [productSearch, setProductSearch] = useState('');

    const { data, setData, post, put, errors, processing, reset } = useForm({
        code: promotion?.code || '',
        name: promotion?.name || '',
        type: promotion?.type || 'percentage',
        buy_quantity: promotion?.buy_quantity || '',
        get_quantity: promotion?.get_quantity || '',
        discount_value: promotion?.discount_value || '',
        discount_type: promotion?.discount_type || 'percentage',
        minimum_purchase: promotion?.minimum_purchase || 0,
        max_discount_amount: promotion?.max_discount_amount || '',
        start_at: promotion?.start_at ? promotion.start_at.slice(0, 16) : '',
        end_at: promotion?.end_at ? promotion.end_at.slice(0, 16) : '',
        priority: promotion?.priority || 0,
        usage_limit: promotion?.usage_limit || '',
        is_active: promotion?.is_active ?? true,
        description: promotion?.description || '',
        products: promotion?.products?.map((p: any) => p.id) || [],
    });

    // Filter produk berdasarkan input pencarian lokal di form
    const filteredProducts = products.filter((p: any) => 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
        p.code.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setData('products', products.map((p: any) => p.id));
        } else {
            setData('products', []);
        }
    };

    const handleProductToggle = (productId: number) => {
        const exists = data.products.includes(productId);
        if (exists) {
            setData('products', data.products.filter((id: number) => id !== productId));
        } else {
            setData('products', [...data.products, productId]);
        }
    };

    function submit(e: any) {
        e.preventDefault();
        if (isEdit) {
            put(r('promotions.update', promotion.id), { onSuccess: () => onSuccess?.() });
        } else {
            post(r('promotions.store'), {
                onSuccess: () => { reset(); onSuccess?.(); }
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Kode Promo</Label>
                    <Input value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="PROMO2026" />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Nama Promo</Label>
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Diskon Akhir Tahun" />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tipe Promo</Label>
                    <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Persentase (%)</SelectItem>
                            <SelectItem value="fixed">Nominal Tetap (Fixed)</SelectItem>
                            <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                            <SelectItem value="minimum_purchase">Minimum Pembelian</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {data.type === 'buy_x_get_y' && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label>Beli (X)</Label>
                            <Input type="number" value={data.buy_quantity} onChange={(e) => setData('buy_quantity', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gratis (Y)</Label>
                            <Input type="number" value={data.get_quantity} onChange={(e) => setData('get_quantity', e.target.value)} />
                        </div>
                    </div>
                )}

                {(data.type === 'percentage' || data.type === 'fixed') && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label>Nilai Diskon</Label>
                            <Input type="number" value={data.discount_value} onChange={(e) => setData('discount_value', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Jenis Diskon</Label>
                            <Select value={data.discount_type} onValueChange={(val) => setData('discount_type', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Min. Pembelian</Label>
                    <Input type="number" value={data.minimum_purchase} onChange={(e) => setData('minimum_purchase', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Max. Diskon (Opsional)</Label>
                    <Input type="number" value={data.max_discount_amount} onChange={(e) => setData('max_discount_amount', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Limit Penggunaan</Label>
                    <Input type="number" value={data.usage_limit} onChange={(e) => setData('usage_limit', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Mulai Promo</Label>
                    <Input type="datetime-local" value={data.start_at} onChange={(e) => setData('start_at', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Berakhir Promo</Label>
                    <Input type="datetime-local" value={data.end_at} onChange={(e) => setData('end_at', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Prioritas</Label>
                    <Input type="number" value={data.priority} onChange={(e) => setData('priority', e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </div>

            {/* SEKSI PENGELOLAAN PRODUK PROMO */}
            <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Produk yang Berlaku</Label>
                        <p className="text-xs text-muted-foreground">Pilih produk spesifik. Jika tidak ada yang dicentang, promo biasanya berlaku umum.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="select-all" 
                            checked={data.products.length === products.length && products.length > 0}
                            onCheckedChange={(val) => handleSelectAll(!!val)}
                        />
                        <Label htmlFor="select-all" className="text-xs font-medium cursor-pointer">Pilih Semua</Label>
                    </div>
                </div>

                {/* Input Pencarian Produk di dalam Modal */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        className="pl-8 text-sm" 
                        placeholder="Cari nama atau kode produk..." 
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                    />
                </div>

                {/* Daftar Checkbox Produk */}
                <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2 bg-muted/20">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product: any) => (
                            <div key={product.id} className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted/50">
                                <Checkbox 
                                    id={`product-${product.id}`}
                                    checked={data.products.includes(product.id)}
                                    onCheckedChange={() => handleProductToggle(product.id)}
                                />
                                <Label htmlFor={`product-${product.id}`} className="text-sm cursor-pointer flex-1 flex justify-between">
                                    <span>{product.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                                </Label>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">Produk tidak ditemukan.</p>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">Terpilih: <b>{data.products.length}</b> produk</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(val) => setData('is_active', !!val)} />
                <Label htmlFor="is_active" className="cursor-pointer">Status Aktif</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onCancel?.()}>Batal</Button>
                <Button type="submit" disabled={processing}>{isEdit ? 'Update Promo' : 'Simpan Promo'}</Button>
            </div>
        </form>
    );
}