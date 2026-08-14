import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash } from "lucide-react";
import r from "@/lib/route";
import PaymentForm from "./form";

export default function Index({
    payments,
    invoices,
    bills,
    customers,
    suppliers,
    accounts
}: any) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns = [
        { accessorKey: "type", header: "Type" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "amount", header: "Amount" },
        { accessorKey: "reference", header: "Reference" },

        {
            accessorKey: "customer.name",
            header: "Customer",
        },
        {
            accessorKey: "supplier.name",
            header: "Supplier",
        },

        {
            id: "actions",
            header: "Action",
            cell: ({ row }: any) => (
                <div className="flex gap-2 justify-end">

                    <Button
                        size="icon"
                        onClick={() => {
                            setSelected(row.original);
                            setOpen(true);
                        }}
                    >
                        <Pencil size={16} />
                    </Button>

                    <ConfirmDialog
                        trigger={
                            <Button size="icon" variant="destructive">
                                <Trash size={16} />
                            </Button>
                        }
                        title="Delete Payment?"
                        description={`Delete payment ${row.original.reference}?`}
                        onConfirm={() =>
                            router.delete(r("payments.destroy", row.original.id))
                        }
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-4">

            <Head title="Payments" />

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Payments</h1>

                <Button onClick={() => {
                    setSelected(null);
                    setOpen(true);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">

                    <DataTable
                        columns={columns}
                        data={payments}
                        enableSearch
                        enablePagination
                    />

                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[90vw] md:w-[60vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Edit Payment" : "Create Payment"}
                        </DialogTitle>
                    </DialogHeader>

                    <PaymentForm
                        key={selected?.id ?? "create"}
                        payment={selected}
                        invoices={invoices}
                        bills={bills}
                        customers={customers}
                        suppliers={suppliers}
                        accounts={accounts}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>

        </div>
    );
}


Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: r('dashboard'),
        },
        {
            title: 'Payments',
            href: r('payments.index'),
        },
    ],
};