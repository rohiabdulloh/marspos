import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import r from "@/lib/route";

export default function BillForm({
    bill = null,
    suppliers = [],
    onSuccess
}: any) {

    const isEdit = !!bill;

    const { data, setData, post, put, errors } = useForm({
        bill_number: bill?.bill_number ?? "",
        date: bill?.date ?? "",
        due_date: bill?.due_date ?? "",
        total: bill?.total ?? "",
        status: bill?.status ?? "draft",
        supplier_id: bill?.supplier_id ?? "",
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r("bills.update", bill.id), { onSuccess });
        } else {
            post(r("bills.store"), { onSuccess });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-5">

            {/* BILL NUMBER */}
            <div className="space-y-1">
                <Label>Bill Number</Label>
                <Input
                    value={data.bill_number}
                    onChange={(e) => setData("bill_number", e.target.value)}
                    className={errors.bill_number ? "border-red-500" : ""}
                />
                {errors.bill_number && (
                    <p className="text-sm text-red-500">{errors.bill_number}</p>
                )}
            </div>

            {/* DATE */}
            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-1">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData("date", e.target.value)}
                        className={errors.date ? "border-red-500" : ""}
                    />
                    {errors.date && (
                        <p className="text-sm text-red-500">{errors.date}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Due Date</Label>
                    <Input
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData("due_date", e.target.value)}
                        className={errors.due_date ? "border-red-500" : ""}
                    />
                    {errors.due_date && (
                        <p className="text-sm text-red-500">{errors.due_date}</p>
                    )}
                </div>

            </div>

            {/* SUPPLIER */}
            <div className="space-y-1">
                <Label>Supplier</Label>

                <Select
                    value={String(data.supplier_id)}
                    onValueChange={(v) => setData("supplier_id", v)}
                >
                    <SelectTrigger className={errors.supplier_id ? "border-red-500 w-full" : "w-full"}>
                        <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>

                    <SelectContent>
                        {suppliers.map((s: any) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.supplier_id && (
                    <p className="text-sm text-red-500">{errors.supplier_id}</p>
                )}
            </div>

            {/* TOTAL + STATUS */}
            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-1">
                    <Label>Total</Label>
                    <Input
                        type="number"
                        value={data.total}
                        onChange={(e) => setData("total", e.target.value)}
                        className={errors.total ? "border-red-500 w-full" : "w-full"}
                    />
                    {errors.total && (
                        <p className="text-sm text-red-500">{errors.total}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Status</Label>

                    <Select
                        value={data.status}
                        onValueChange={(v) => setData("status", v)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
                <Button type="submit">
                    {isEdit ? "Update Bill" : "Save Bill"}
                </Button>
            </div>

        </form>
    );
}