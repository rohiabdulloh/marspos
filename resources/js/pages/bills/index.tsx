import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash } from "lucide-react";
import r from "@/lib/route";
import BillForm from "./form";

export default function Index({ bills, suppliers }: any) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns = [
        { accessorKey: "bill_number", header: "Bill #" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "due_date", header: "Due Date" },
        { accessorKey: "total", header: "Total" },
        { accessorKey: "status", header: "Status" },
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
                        title="Delete Bill?"
                        description={`Delete bill ${row.original.bill_number}?`}
                        onConfirm={() =>
                            router.delete(r("bills.destroy", row.original.id))
                        }
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-4">

            <Head title="Bills" />

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Bills</h1>

                <Button onClick={() => {
                    setSelected(null);
                    setOpen(true);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bill
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">

                    <DataTable
                        columns={columns}
                        data={bills}
                        enableSearch
                        enablePagination
                    />

                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[90vw] md:w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Edit Bill" : "Create Bill"}
                        </DialogTitle>
                    </DialogHeader>

                    <BillForm
                        key={selected?.id ?? "create"}
                        bill={selected}
                        suppliers={suppliers}
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
            title: 'Bills',
            href: r('bills.index'),
        },
    ],
};