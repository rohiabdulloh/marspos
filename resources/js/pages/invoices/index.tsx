import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash } from "lucide-react";
import r from "@/lib/route";
import InvoiceForm from "./form";

export default function Index({ invoices, customers }: any) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns = [
        { accessorKey: "invoice_number", header: "Invoice #" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "due_date", header: "Due Date" },
        { accessorKey: "total", header: "Total" },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "customer.name",
            header: "Customer",
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
                        title="Delete Invoice?"
                        description={`Delete invoice ${row.original.invoice_number}?`}
                        onConfirm={() =>
                            router.delete(r("invoices.destroy", row.original.id))
                        }
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-4">

            <Head title="Invoices" />

            {/* HEADER */}
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">Invoices</h1>

                <Button onClick={() => {
                    setSelected(null);
                    setOpen(true);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Invoice
                </Button>
            </div>

            {/* TABLE */}
            <Card>
                <CardContent className="pt-4">

                    <DataTable
                        columns={columns}
                        data={invoices}
                        enableSearch
                        enablePagination
                    />

                </CardContent>
            </Card>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[90vw] md:w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Edit Invoice" : "Create Invoice"}
                        </DialogTitle>
                    </DialogHeader>

                    <InvoiceForm
                        key={selected?.id ?? "create"}
                        invoice={selected}
                        customers={customers}
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
            title: 'Invoices',
            href: r('invoices.index'),
        },
    ],
};