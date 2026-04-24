import { useForm, Head, Link} from '@inertiajs/react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import r from '@/lib/route';

export default function Create({ parents }: any) {
    const { data, setData, post } = useForm({
        code: '',
        name: '',
        type: 'asset',
        parent_id: '',
        is_active: true,
    });

    function submit(e: any) {
        e.preventDefault();
        post(r('accounts.store'));
    }

    return (
        <form onSubmit={submit} className="p-6 space-y-4">
            <Head title="Chart of Accounts" />

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Add Accounts
                </h1>
            </div>

            <Card>
            <CardHeader>
                <p className="text-sm text-muted-foreground">
                    Tambahkan akun baru ke dalam Chart of Accounts. 
                    Setiap akun harus memiliki kode unik dan dapat dikelompokkan berdasarkan jenis seperti Asset, Liability, Equity, Revenue, atau Expense.
                </p>
            </CardHeader>
                <CardContent className="space-y-5 ">

                    {/* CODE */}
                    <div className="space-y-2">
                        <Label>Code</Label>
                        <Input
                            placeholder="e.g. 1010"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                    </div>

                    {/* NAME */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            placeholder="Cash / Bank / Revenue"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* TYPE */}
                    <div className="md:flex gap-4">
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
                    <div className="md:flex gap-4">
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
                                <SelectItem value="__none__">No Parent</SelectItem>
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

                    {/* BUTTON */}
                    <div className="flex gap-2">
                        <Link href={r('accounts.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>

                        <Button type="submit">
                            Save Account
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </form>
    );
}