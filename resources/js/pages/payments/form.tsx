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

export default function PaymentForm({
    payment = null,
    invoices = [],
    bills = [],
    customers = [],
    suppliers = [],
    accounts = [],
    onSuccess
}: any) {

    const isEdit = !!payment;

    const { data, setData, post, put, errors } = useForm({
        type: payment?.type ?? "receive",
        date: payment?.date ?? "",
        reference: payment?.reference ?? "",
        amount: payment?.amount ?? "",

        invoice_id: payment?.invoice_id ?? "",
        bill_id: payment?.bill_id ?? "",

        customer_id: payment?.customer_id ?? "",
        supplier_id: payment?.supplier_id ?? "",

        account_id: payment?.account_id ?? "",
        note: payment?.note ?? "",
    });

    function submit(e: any) {
        e.preventDefault();

        if (isEdit) {
            put(r("payments.update", payment.id), { onSuccess });
        } else {
            post(r("payments.store"), { onSuccess });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-5">

            {/* TYPE */}
            <div className="space-y-1">
                <Label>Type</Label>

                <Select
                    value={data.type}
                    onValueChange={(v) => setData("type", v)}
                >
                    <SelectTrigger className={errors.type ? "border-red-500 w-full" : "w-full"}>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="receive">Receive (Customer)</SelectItem>
                        <SelectItem value="pay">Pay (Supplier)</SelectItem>
                    </SelectContent>
                </Select>

                {errors.type && (
                    <p className="text-sm text-red-500">{errors.type}</p>
                )}
            </div>

            {/* DATE + REF */}
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
                    <Label>Reference</Label>
                    <Input
                        value={data.reference}
                        onChange={(e) => setData("reference", e.target.value)}
                        className={errors.reference ? "border-red-500" : ""}
                    />
                    {errors.reference && (
                        <p className="text-sm text-red-500">{errors.reference}</p>
                    )}
                </div>

            </div>

            {/* AMOUNT */}
            <div className="space-y-1">
                <Label>Amount</Label>
                <Input
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData("amount", e.target.value)}
                    className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount}</p>
                )}
            </div>

            {/* RECEIVE → INVOICE */}
            {data.type === "receive" && (
                <div className="space-y-1">
                    <Label>Invoice</Label>

                    <Select
                        value={String(data.invoice_id || "")}
                        onValueChange={(v) => setData("invoice_id", v)}
                    >
                        <SelectTrigger className={errors.invoice_id ? "border-red-500 w-full" : "w-full"}>
                            <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>

                        <SelectContent>
                            {invoices.map((i: any) => (
                                <SelectItem key={i.id} value={String(i.id)}>
                                    {i.invoice_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.invoice_id && (
                        <p className="text-sm text-red-500">{errors.invoice_id}</p>
                    )}
                </div>
            )}

            {/* PAY → BILL */}
            {data.type === "pay" && (
                <div className="space-y-1">
                    <Label>Bill</Label>

                    <Select
                        value={String(data.bill_id || "")}
                        onValueChange={(v) => setData("bill_id", v)}
                    >
                        <SelectTrigger className={errors.bill_id ? "border-red-500 w-full" : "w-full"}>
                            <SelectValue placeholder="Select bill" />
                        </SelectTrigger>

                        <SelectContent>
                            {bills.map((b: any) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.bill_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.bill_id && (
                        <p className="text-sm text-red-500">{errors.bill_id}</p>
                    )}
                </div>
            )}

            {/* ACCOUNT */}
            <div className="space-y-1">
                <Label>Account</Label>

                <Select
                    value={String(data.account_id || "")}
                    onValueChange={(v) => setData("account_id", v)}
                >
                    <SelectTrigger className={errors.account_id ? "border-red-500 w-full" : "w-full"}>
                        <SelectValue placeholder="Select account" />
                    </SelectTrigger>

                    <SelectContent>
                        {accounts.map((a: any) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                                {a.code} - {a.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.account_id && (
                    <p className="text-sm text-red-500">{errors.account_id}</p>
                )}
            </div>

            {/* NOTE */}
            <div className="space-y-1">
                <Label>Note</Label>
                <Input
                    value={data.note}
                    onChange={(e) => setData("note", e.target.value)}
                    className={errors.note ? "border-red-500" : ""}
                />
                {errors.note && (
                    <p className="text-sm text-red-500">{errors.note}</p>
                )}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
                <Button type="submit">
                    {isEdit ? "Update Payment" : "Save Payment"}
                </Button>
            </div>

        </form>
    );
}