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

    // Tree support (optional)
    isTree?: boolean;
    getSubRows?: (row: TData) => TData[] | undefined;

    // Feature toggles
    enableSearch?: boolean;
    enableSorting?: boolean;
    enablePagination?: boolean;

    // Pagination config
    pageSizeOptions?: number[];
    initialPageSize?: number;

    // Optional: custom empty text
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

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            expanded,
            pagination,
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: enableSorting ? setSorting : undefined,
        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            // Auto-expand semua node saat search di mode tree
            if (isTree && value) setExpanded(true);
        },
        onExpandedChange: setExpanded,
        onPaginationChange: setPagination,

        // Core + features
        getSubRows,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: enableSearch ? getFilteredRowModel() : undefined,
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getExpandedRowModel: isTree ? getExpandedRowModel() : undefined,
        getPaginationRowModel: enablePagination
            ? getPaginationRowModel()
            : undefined,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                {/* SEARCH */}
                {enableSearch && (
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ''}
                            onChange={(e) =>
                                table.setGlobalFilter(e.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                )}

                {/* COLUMN VISIBILITY */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                        Columns
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {table
                            .getAllLeafColumns()
                            .filter((col) => col.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 📊TABLE */}
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
                                        style={{
                                            width: header.column.getSize(),
                                            maxWidth: header.column.getSize(),
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    
                                            {/* 🔽 SORT ICON */}
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
                                <TableCell colSpan={columns.length}>
                                    {emptyText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 📄 FOOTER */}
            {enablePagination && (
                <div className="flex items-center justify-between">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2 text-sm">
                        <span>Rows per page:</span>
                        <select
                            value={
                                table.getState().pagination.pageSize
                            }
                            onChange={(e) =>
                                table.setPageSize(
                                    Number(e.target.value)
                                )
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

                    {/* Pagination */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            Page{' '}
                            {table.getState().pagination.pageIndex + 1}{' '}
                            of {table.getPageCount()}
                        </span>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                {'<<'}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Prev
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                {'>>'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}