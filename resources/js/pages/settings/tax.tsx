import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from "lucide-react";
import r from '@/lib/route';

export default function TaxSetting({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        tax_name: settings?.tax_name ?? 'PPN',
        tax_percentage: settings?.tax_percentage ?? 11,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(r('settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <Head title="Pengaturan Pajak" />

            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Pengaturan Pajak (Global)
                </h1>
                <p className="text-sm text-muted-foreground">
                    Konfigurasi nama dan persentase tarif pajak yang berlaku pada transaksi.
                </p>
            </div>

            <Card className="py-2 bg-card border-border shadow-xs">
                <CardContent className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Pajak */}
                        <div className="space-y-2">
                            <Label>Nama Pajak</Label>
                            <Input
                                className={errors.tax_name ? 'border-red-500' : ''}
                                value={data.tax_name}
                                onChange={(e) => setData('tax_name', e.target.value)}
                                placeholder="Contoh: PPN / Pajak Daerah"
                            />
                            {errors.tax_name && (
                                <span className="text-rose-500 text-xs block">{errors.tax_name}</span>
                            )}
                        </div>

                        {/* Persentase Pajak */}
                        <div className="space-y-2">
                            <Label>Persentase Pajak (%)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                className={errors.tax_percentage ? 'border-red-500' : ''}
                                value={data.tax_percentage}
                                onChange={(e) => setData('tax_percentage', Number(e.target.value))}
                                placeholder="11"
                            />
                            {errors.tax_percentage && (
                                <span className="text-rose-500 text-xs block">{errors.tax_percentage}</span>
                            )}
                        </div>

                        {/* Tombol Simpan */}
                        <div className="flex pt-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2" size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

TaxSetting.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Pengaturan Pajak', href: r('settings.tax') },
    ],
};