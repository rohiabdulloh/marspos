import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Store as StoreIcon } from "lucide-react";
import r from '@/lib/route';

interface Store {
    id: number;
    name: string;
}

interface PrinterSettingsProps {
    stores: Store[];
    selectedStoreId: number;
    settings: Record<string, any>;
}

export default function PrinterSetting({ stores, selectedStoreId, settings }: PrinterSettingsProps) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: selectedStoreId ?? '',
        printer_name: settings?.printer_name ?? '',
        printer_connection_type: settings?.printer_connection_type ?? 'usb',
        printer_ip_address: settings?.printer_ip_address ?? '',
        printer_port: settings?.printer_port ?? 9100,
        printer_paper_size: settings?.printer_paper_size ?? 58,
    });

    const handleStoreChange = (newStoreId: string) => {
        setData('store_id', Number(newStoreId));

        router.get(r('settings.printer'), { store_id: newStoreId }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(r('settings.printer.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <Head title="Pengaturan Printer per Toko" />

            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Pengaturan Printer Cabang Toko
                </h1>
                <p className="text-sm text-muted-foreground">
                    Kelola konfigurasi perangkat cetak struk secara spesifik untuk masing-masing cabang.
                </p>
            </div>

            {/* Dropdown Pemilihan Toko */}
            <Card className="py-2 bg-card border-border shadow-xs">
                <CardContent className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <StoreIcon size={18} className="text-muted-foreground" />
                        <span>Pilih Cabang Toko:</span>
                    </div>
                    <div className="w-72">
                        <Select
                            value={String(data.store_id)}
                            onValueChange={handleStoreChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Cabang Toko" />
                            </SelectTrigger>
                            <SelectContent>
                                {stores.map((store) => (
                                    <SelectItem key={store.id} value={String(store.id)}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Form Pengaturan Printer */}
            <Card className="py-2 bg-card border-border shadow-xs">
                <CardContent className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" value={data.store_id} />

                        {/* Nama Printer */}
                        <div className="space-y-2">
                            <Label>Nama / Merek Printer</Label>
                            <Input
                                className={errors.printer_name ? 'border-red-500' : ''}
                                value={data.printer_name}
                                onChange={(e) => setData('printer_name', e.target.value)}
                                placeholder="Contoh: Epson TM-T82"
                            />
                            {errors.printer_name && (
                                <span className="text-rose-500 text-xs block">{errors.printer_name}</span>
                            )}
                        </div>

                        {/* Tipe Koneksi */}
                        <div className="space-y-2">
                            <Label>Tipe Koneksi</Label>
                            <Select
                                value={data.printer_connection_type}
                                onValueChange={(val) => setData('printer_connection_type', val)}
                            >
                                <SelectTrigger className={errors.printer_connection_type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Tipe Koneksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usb">USB / Direct Connection</SelectItem>
                                    <SelectItem value="network">Network (LAN / WiFi - IP Address)</SelectItem>
                                    <SelectItem value="bluetooth">Bluetooth (Mobile / EDC)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.printer_connection_type && (
                                <span className="text-rose-500 text-xs block">{errors.printer_connection_type}</span>
                            )}
                        </div>

                        {/* Opsi Tambahan jika Network */}
                        {data.printer_connection_type === 'network' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="space-y-2">
                                    <Label>IP Address</Label>
                                    <Input
                                        className={errors.printer_ip_address ? 'border-red-500' : ''}
                                        value={data.printer_ip_address}
                                        onChange={(e) => setData('printer_ip_address', e.target.value)}
                                        placeholder="192.168.1.100"
                                    />
                                    {errors.printer_ip_address && (
                                        <span className="text-rose-500 text-xs block">{errors.printer_ip_address}</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Port</Label>
                                    <Input
                                        type="number"
                                        className={errors.printer_port ? 'border-red-500' : ''}
                                        value={data.printer_port}
                                        onChange={(e) => setData('printer_port', Number(e.target.value))}
                                        placeholder="9100"
                                    />
                                    {errors.printer_port && (
                                        <span className="text-rose-500 text-xs block">{errors.printer_port}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ukuran Kertas */}
                        <div className="space-y-2">
                            <Label>Ukuran Kertas Struk</Label>
                            <Select
                                value={String(data.printer_paper_size)}
                                onValueChange={(val) => setData('printer_paper_size', Number(val))}
                            >
                                <SelectTrigger className={errors.printer_paper_size ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Pilih Ukuran Kertas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="58">58 mm (Kecil / Mobile)</SelectItem>
                                    <SelectItem value="80">80 mm (Standar Kasir)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.printer_paper_size && (
                                <span className="text-rose-500 text-xs block">{errors.printer_paper_size}</span>
                            )}
                        </div>

                        {/* Tombol Simpan */}
                        <div className="flex pt-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2" size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Toko Ini'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

PrinterSetting.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: r('dashboard') },
        { title: 'Pengaturan Printer Cabang', href: r('settings.printer') },
    ],
};