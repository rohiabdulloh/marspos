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

export default function InvoiceForm({
    invoice = null,
    customers = [],
    onSuccess
}: any) {

    const isEdit = !!invoice;

    const { data, setData, post, put, errors } = useForm({
        invoice_number: invoice?.invoice_number ?? "",
        date: invoice?.date ?? "",
        due_date: invoice?.due_date ?? "",
        total: invoice?.total ?? "",
        status: invoice?.status ?? "draft",
        customer_id: invoice?.customer_id ?? "",
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r("invoices.update", invoice.id), {
                onSuccess
            });
        } else {
            post(r("invoices.store"), {
                onSuccess
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-5">

            {/* ================= INVOICE NUMBER ================= */}
            <div className="space-y-1">
                <Label>Invoice Number</Label>
                <Input
                    value={data.invoice_number}
                    onChange={(e) => setData("invoice_number", e.target.value)}
                    className={errors.invoice_number ? "border-red-500" : ""}
                    placeholder="INV-0001"
                />
                {errors.invoice_number && (
                    <p className="text-sm text-red-500">
                        {errors.invoice_number}
                    </p>
                )}
            </div>

            {/* ================= DATE ================= */}
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
                        <p className="text-sm text-red-500">
                            {errors.date}
                        </p>
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
                        <p className="text-sm text-red-500">
                            {errors.due_date}
                        </p>
                    )}
                </div>

            </div>

            {/* ================= CUSTOMER ================= */}
            <div className="space-y-1">
                <Label>Customer</Label>

                <Select
                    value={String(data.customer_id)}
                    onValueChange={(v) => setData("customer_id", v)}
                >
                    <SelectTrigger className={errors.customer_id ? "border-red-500 w-full" : "w-full"}>
                        <SelectValue placeholder="Select customer" />
                    </SelectTrigger>

                    <SelectContent>
                        {customers.map((c: any) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.customer_id && (
                    <p className="text-sm text-red-500">
                        {errors.customer_id}
                    </p>
                )}
            </div>

            {/* ================= TOTAL ================= */}
            <div className="space-y-1">
                <Label>Total</Label>
                <Input
                    type="number"
                    value={data.total}
                    onChange={(e) => setData("total", e.target.value)}
                    className={errors.total ? "border-red-500" : ""}
                />
                {errors.total && (
                    <p className="text-sm text-red-500">
                        {errors.total}
                    </p>
                )}
            </div>

            {/* ================= STATUS ================= */}
            <div className="space-y-1">
                <Label>Status</Label>

                <Select
                    value={data.status}
                    onValueChange={(v) => setData("status", v)}
                >
                    <SelectTrigger className={errors.status ? "border-red-500 w-full" : "w-full"}>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                </Select>

                {errors.status && (
                    <p className="text-sm text-red-500">
                        {errors.status}
                    </p>
                )}
            </div>

            {/* ================= BUTTON ================= */}
            <div className="flex justify-end pt-2">
                <Button type="submit">
                    {isEdit ? "Update Invoice" : "Save Invoice"}
                </Button>
            </div>

        </form>
    );
}