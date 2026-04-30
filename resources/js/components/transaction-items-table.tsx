import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Trash2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

type Item = {
    account_id: string;
    debit: number | string;
    credit: number | string;
};

type Props = {
    items: Item[];
    accounts: any[];
    errors?: Record<string, string>;
    onChange: (items: Item[]) => void;
};

export default function TransactionItemsTable({
    items = [],
    accounts = [],
    errors = {},
    onChange,
}: Props) {

    function update(index: number, key: keyof Item, value: any) {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [key]: value } : item
        );

        onChange(updated);
    }

    function addRow() {
        onChange([
            ...items,
            { account_id: "", debit: "", credit: "" },
        ]);
    }

    function removeRow(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                    Transaction Items
                </Label>

                <Button type="button" size="sm" onClick={addRow}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                </Button>
            </div>

            {/* TABLE */}
            <div className="rounded-lg border">

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead className="w-[160px]">Debit</TableHead>
                            <TableHead className="w-[160px]">Credit</TableHead>
                            <TableHead className="w-[60px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {items.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-sm text-muted-foreground py-6"
                                >
                                    No items
                                </TableCell>
                            </TableRow>
                        )}

                        {items.map((item, i) => {

                            const accountError = errors?.[`items.${i}.account_id`];
                            const debitError = errors?.[`items.${i}.debit`];
                            const creditError = errors?.[`items.${i}.credit`];

                            return (
                                <TableRow
                                    key={i}
                                    className={
                                        accountError || debitError || creditError
                                            ? "bg-red-50"
                                            : ""
                                    }
                                >

                                    {/* ACCOUNT */}
                                    <TableCell>
                                        <Select
                                            value={item.account_id}
                                            onValueChange={(val) =>
                                                update(i, "account_id", val)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full ${
                                                    accountError
                                                        ? "border-red-500"
                                                        : ""
                                                    }`}
                                            >
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {accounts.map((a: any) => (
                                                    <SelectItem
                                                        key={a.id}
                                                        value={String(a.id)}
                                                    >
                                                        {a.code} - {a.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {accountError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {accountError}
                                            </p>
                                        )}
                                    </TableCell>

                                    {/* DEBIT */}
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.debit}
                                            onChange={(e) =>
                                                update(i, "debit", e.target.value)
                                            }
                                            className={
                                                debitError
                                                    ? "border-red-500 h-9"
                                                    : "h-9"
                                            }
                                        />

                                        {debitError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {debitError}
                                            </p>
                                        )}
                                    </TableCell>

                                    {/* CREDIT */}
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.credit}
                                            onChange={(e) =>
                                                update(i, "credit", e.target.value)
                                            }
                                            className={
                                                creditError
                                                    ? "border-red-500 h-9"
                                                    : "h-9"
                                            }
                                        />

                                        {creditError && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {creditError}
                                            </p>
                                        )}
                                    </TableCell>

                                    {/* DELETE */}
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRow(i)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            );
                        })}

                    </TableBody>

                </Table>

            </div>
        </div>
    );
}