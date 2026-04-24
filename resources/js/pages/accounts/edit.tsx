import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import r from '@/lib/route';

export default function Edit({ account, parents }: any) {
    const { data, setData, put } = useForm({
        code: account.code ?? '',
        name: account.name ?? '',
        type: account.type ?? 'asset',
        parent_id: account.parent_id ? String(account.parent_id) : '',
        is_active: account.is_active ?? true,
    });

    function submit(e: any) {
        e.preventDefault();
        put(r('accounts.update', account.id));
    }

    return (
        <form onSubmit={submit} className="p-6 space-y-4">
            <Head title="Edit Account" />

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Edit Account
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <p className="text-sm text-muted-foreground">
                        Ubah data akun yang sudah ada dalam Chart of Accounts.
                        Pastikan perubahan tidak mempengaruhi laporan keuangan yang sudah berjalan.
                    </p>
                </CardHeader>

                <CardContent className="space-y-5">

                    {/* CODE */}
                    <div className="space-y-2">
                        <Label>Code</Label>
                        <Input
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                    </div>

                    {/* NAME */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* TYPE */}
                    <div className="md:flex gap-4 items-center">
                        <Label className="min-w-40">Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(value) =>
                                setData('type', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asset">Asset</SelectItem>
                                <SelectItem value="liability">Liability</SelectItem>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="revenue">Revenue</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* PARENT */}
                    <div className="md:flex gap-4 items-center">
                        <Label className="min-w-40">Parent Account</Label>
                        <Select
                            value={data.parent_id}
                            onValueChange={(value) =>
                                setData('parent_id', value === '__none__' ? '' : value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="No Parent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">
                                    No Parent
                                </SelectItem>

                                {parents.map((p: any) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.code} - {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ACTIVE */}
                    <div className="flex items-center gap-4">
                        <Label className="min-w-40">Active</Label>
                        <Switch
                            checked={data.is_active}
                            onCheckedChange={(val) =>
                                setData('is_active', val)
                            }
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-2">
                        <Link href={r('accounts.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>

                        <Button type="submit">
                            Update Account
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </form>
    );
}