import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from "lucide-react";
import r from '@/lib/route';

export default function PaymentSetting({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_qris_active: settings?.payment_qris_active ?? false,
        payment_midtrans_key: settings?.payment_midtrans_key ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(r('settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <Head title="Pengaturan Pembayaran" />

            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Pengaturan Pembayaran (Global)
                </h1>
                <p className="text-sm text-muted-foreground">
                    Konfigurasi integrasi metode pembayaran dan payment gateway.
                </p>
            </div>

            <Card className="py-2 bg-card border-border shadow-xs">
                <CardContent className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Checkbox QRIS */}
                        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-border">
                            <Checkbox
                                id="qris_active"
                                checked={data.payment_qris_active}
                                onCheckedChange={(checked) => setData('payment_qris_active', !!checked)}
                            />
                            <Label htmlFor="qris_active" className="cursor-pointer font-medium">
                                Aktifkan Pembayaran QRIS Nasional
                            </Label>
                        </div>
                        {errors.payment_qris_active && (
                            <span className="text-rose-500 text-xs block">{errors.payment_qris_active}</span>
                        )}

                        {/* Midtrans Key */}
                        <div className="space-y-2">
                            <Label>Midtrans Server Key</Label>
                            <Input
                                type="password"
                                className={errors.payment_midtrans_key ? 'border-red-500' : ''}
                                value={data.payment_midtrans_key}
                                onChange={(e) => setData('payment_midtrans_key', e.target.value)}
                                placeholder="SB-Mid-server-xxxx..."
                            />
                            {errors.payment_midtrans_key && (
                                <span className="text-rose-500 text-xs block">{errors.payment_midtrans_key}</span>
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

PaymentSetting.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Pengaturan Pembayaran', href: r('settings.payment') },
    ],
};