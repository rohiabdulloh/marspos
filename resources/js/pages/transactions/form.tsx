import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import r from "@/lib/route";

import TransactionItemsTable from "@/components/transaction-items-table";

export default function TransactionForm({
    transaction = null,
    accounts = [],
    customers = [],
    suppliers = [],
    onSuccess
}: any) {

    const isEdit = !!transaction;

    const { data, setData, post, put, errors } = useForm({
        type: transaction?.type ?? "sales",
        date: transaction?.date ?? "",
        reference: transaction?.reference ?? "",
        description: transaction?.description ?? "",
        customer_id: transaction?.customer_id ?? "",
        supplier_id: transaction?.supplier_id ?? "",
        items: transaction?.items?.length
            ? transaction.items.map((item: any) => ({
                account_id: String(item.account_id ?? ""),
                debit: item.debit ?? 0,
                credit: item.credit ?? 0,
            }))
            : [{ account_id: "", debit: 0, credit: 0 }]
    });

    console.log(data);
    
    function submit(e: any) {
        e.preventDefault();

        const cleaned = {
            ...data,
            customer_id: data.type === "sales" ? data.customer_id : null,
            supplier_id: data.type === "purchase" ? data.supplier_id : null,
        };

        setData(cleaned);

        if (isEdit) {
            put(r("transactions.update", transaction.id), {
                onSuccess
            });
        } else {
            post(r("transactions.store"), {
                onSuccess
            });
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">

            {/* ================= HEADER ================= */}
            <div className="grid grid-cols-2 gap-4">

                {/* DATE */}
                <div className="space-y-2">
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

                {/* REFERENCE */}
                <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                        value={data.reference}
                        onChange={(e) => setData("reference", e.target.value)}
                        placeholder="TRX-0001"
                        className={errors.reference ? "border-red-500" : ""}
                    />
                    {errors.reference && (
                        <p className="text-sm text-red-500">{errors.reference}</p>
                    )}
                </div>
            </div>

            {/* ================= TYPE + PARTY ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* TYPE */}
                <div className="space-y-2">
                    <Label>Transaction Type</Label>

                    <Select
                        value={data.type}
                        onValueChange={(v) => setData("type", v)}
                    >
                        <SelectTrigger className={`w-full ${errors.type ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.type && (
                        <p className="text-sm text-red-500">{errors.type}</p>
                    )}
                </div>

                {/* PARTY */}
                <div className="space-y-2">

                    {data.type === "sales" && (
                        <>
                            <Label>Customer</Label>

                            <Select
                                value={data.customer_id}
                                onValueChange={(v) => setData("customer_id", v)}
                            >
                                <SelectTrigger className={`w-full ${errors.customer_id ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select Customer" />
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
                                <p className="text-sm text-red-500">{errors.customer_id}</p>
                            )}
                        </>
                    )}

                    {data.type === "purchase" && (
                        <>
                            <Label>Supplier</Label>

                            <Select
                                value={data.supplier_id}
                                onValueChange={(v) => setData("supplier_id", v)}
                            >
                                <SelectTrigger className={`w-full ${errors.supplier_id ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select Supplier" />
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
                        </>
                    )}

                </div>
            </div>

            {/* ================= ITEMS ================= */}
            <TransactionItemsTable
                items={data.items}
                accounts={accounts}
                errors={errors}
                onChange={(val) => setData("items", val)}
            />

            {/* ================= SUBMIT ================= */}
            <div className="flex justify-end">
                <Button type="submit">
                    {isEdit ? "Update Transaction" : "Save Transaction"}
                </Button>
            </div>

        </form>
    );
}