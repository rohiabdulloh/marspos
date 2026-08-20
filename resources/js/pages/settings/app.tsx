import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from "lucide-react";
import r from '@/lib/route';

export default function AppSetting({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings?.app_name ?? '',
        app_timezone: settings?.app_timezone ?? 'Asia/Jakarta',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(r('settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <Head title="Pengaturan Aplikasi" />

            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Pengaturan Aplikasi (Global)
                </h1>
                <p className="text-sm text-muted-foreground">
                    Kelola informasi umum dan konfigurasi dasar sistem aplikasi.
                </p>
            </div>

            <Card className="py-2 bg-card border-border shadow-xs">
                <CardContent className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Aplikasi */}
                        <div className="space-y-2">
                            <Label>Nama Aplikasi</Label>
                            <Input
                                className={errors.app_name ? 'border-red-500' : ''}
                                value={data.app_name}
                                onChange={(e) => setData('app_name', e.target.value)}
                                placeholder="Contoh: Kasir POS Pro"
                            />
                            {errors.app_name && (
                                <span className="text-rose-500 text-xs block">{errors.app_name}</span>
                            )}
                        </div>

                        {/* Zona Waktu */}
                        <div className="space-y-2">
                            <Label>Zona Waktu (Timezone)</Label>
                            <Select
                                value={data.app_timezone}
                                onValueChange={(val) => setData('app_timezone', val)}
                            >
                                <SelectTrigger className={errors.app_timezone ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Zona Waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                                    <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                                    <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.app_timezone && (
                                <span className="text-rose-500 text-xs block">{errors.app_timezone}</span>
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

AppSetting.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Pengaturan Aplikasi', href: r('settings.app') },
    ],
};