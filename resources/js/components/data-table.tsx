'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
    SortingState,
    ExpandedState,
    PaginationState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronDown } from 'lucide-react';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    // Tree
    isTree?: boolean;
    getSubRows?: (row: TData) => TData[] | undefined;

    // Features
    enableSearch?: boolean;
    enableSorting?: boolean;
    enablePagination?: boolean;

    // Bulk (optional)
    enableRowSelection?: boolean;
    bulkActions?: (rows: TData[]) => React.ReactNode;
    getRowId?: (row: TData) => string;

    // Pagination
    pageSizeOptions?: number[];
    initialPageSize?: number;

    emptyText?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    isTree = false,
    getSubRows,
    enableSearch = true,
    enableSorting = true,
    enablePagination = true,

    enableRowSelection = false,
    bulkActions,
    getRowId,

    pageSizeOptions = [10, 20, 50, 100],
    initialPageSize,
    emptyText = 'No data found.',
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize ?? pageSizeOptions[0],
    });
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    // 🔥 Selection column
    const selectionColumn: ColumnDef<TData> = {
        id: '__select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
        size: 40,
    };

    // 🔥 Final columns
    const finalColumns = React.useMemo(() => {
        if (!enableRowSelection) return columns;
        return [selectionColumn, ...columns];
    }, [columns, enableRowSelection]);

    const table = useReactTable({
        data,
        columns: finalColumns,
        state: {
            sorting,
            globalFilter,
            expanded,
            pagination,
            columnVisibility,
            rowSelection,
        },

        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: enableSorting ? setSorting : undefined,
        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            if (isTree && value) setExpanded(true);
        },
        onExpandedChange: setExpanded,
        onPaginationChange: setPagination,

        enableRowSelection,
        getRowId,

        getSubRows,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: enableSearch ? getFilteredRowModel() : undefined,
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getExpandedRowModel: isTree ? getExpandedRowModel() : undefined,
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    });

    const selectedRows = table.getSelectedRowModel().rows.map(r => r.original);

    return (
        <div className="space-y-4">

            {/* 🔥 BULK ACTION */}
            {enableRowSelection && bulkActions && selectedRows.length > 0 && (
                <div className="flex items-center justify-between p-3 border rounded bg-muted">
                    <span className="text-sm">
                        {selectedRows.length} selected
                    </span>

                    <div className="flex gap-2">
                        {bulkActions(selectedRows)}
                    </div>
                </div>
            )}

            {/* TOP BAR */}
            <div className="flex items-center justify-between gap-2">
                {enableSearch && (
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ''}
                            onChange={(e) => table.setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            Columns
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {table.getAllLeafColumns()
                            .filter((col) => col.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(v) =>
                                        column.toggleVisibility(!!v)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* TABLE */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={
                                            enableSorting
                                                ? header.column.getToggleSortingHandler()
                                                : undefined
                                        }
                                        className={
                                            enableSorting
                                                ? 'cursor-pointer select-none'
                                                : ''
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            {enableSorting && header.column.getCanSort() && (
                                                <>
                                                    {header.column.getIsSorted() === 'asc' ? (
                                                        <ArrowUp size={14} />
                                                    ) : header.column.getIsSorted() === 'desc' ? (
                                                        <ArrowDown size={14} />
                                                    ) : (
                                                        <ArrowUpDown size={14} className="opacity-50" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={finalColumns.length}>
                                    {emptyText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* FOOTER */}
            {enablePagination && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Rows per page:</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) =>
                                table.setPageSize(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>

                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                Prev
                            </Button>
                            <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}