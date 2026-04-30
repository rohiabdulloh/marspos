import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";

import TransactionForm from '@/pages/transactions/form';
import r from "@/lib/route";

export default function Index({ transactions, accounts, customers, suppliers }: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const columns: ColumnDef<any>[] = [
        { accessorKey: "type", header: "Type" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "reference", header: "Ref" },
        { accessorKey: "total_debit", header: "Debit" },
        { accessorKey: "total_credit", header: "Credit" },

        {
            id: "actions",
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button size="icon" onClick={() => {
                        setSelected(row.original);
                        setOpen(true);
                    }}>
                        <Pencil size={16} />
                    </Button>

                    <ConfirmDialog
                        trigger={
                            <Button size="icon" variant="destructive">
                                <Trash size={16} />
                            </Button>
                        }
                        title="Hapus Transaction?"
                        description={
                            <>
                                Yakin ingin menghapus transaction{" "}
                                <b>{row.original.reference}</b>?<br />
                                Data tidak dapat dikembalikan.
                            </>
                        }
                        confirmText="Hapus"
                        onConfirm={() =>
                            router.delete(
                                r("transactions.destroy", row.original.id)
                            )
                        }
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <Head title="Transactions" />

            <div className="flex justify-between">
                <h1 className="text-xl font-bold">Transactions</h1>

                <Button onClick={() => {
                    setSelected(null);
                    setOpen(true);
                }}>
                    <Plus className="mr-2" />
                    Add Transaction
                </Button>
            </div>

            <Card>
                <CardContent>
                    <DataTable columns={columns} data={transactions} />
                </CardContent>
            </Card>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent 
                    className="
                        w-[95vw]
                        max-w-[95vw]
                        md:w-[80vw]
                        md:max-w-[80vw]
                        lg:w-[70vw]
                        lg:max-w-[70vw]
                        max-h-[90vh]
                        overflow-y-auto
                    "
                >
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Edit Transaction" : "Create Transaction"}
                        </DialogTitle>
                    </DialogHeader>

                    <TransactionForm
                        key={selected?.id ?? "create"}
                        transaction={selected}
                        accounts={accounts}
                        customers={customers}
                        suppliers={suppliers}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}