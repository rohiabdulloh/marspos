'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    ExpandedState,
    getExpandedRowModel,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { ConfirmDialog } from '@/components/confirm-dialog'; // Pastikan path import ini sesuai dengan project Anda

import { DataTableToolbar } from './data-table-toolbar';
import { DataTableBulkActions } from './data-table-bulk-actions';
import { DataTablePagination } from './data-table-pagination';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    
    paginationMeta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters?: {
        search?: string;
        sort?: string;
        direction?: string;
        [key: string]: any;
    };
    routeName: string;

    isTree?: boolean;
    getSubRows?: (row: TData) => TData[] | undefined;
    enableSearch?: boolean;
    enableSorting?: boolean;
    enablePagination?: boolean;
    enableRowSelection?: boolean;
    bulkActions?: (rows: TData[]) => React.ReactNode;
    bulkDeleteRoute?: string; // <-- Tambahan props untuk endpoint hapus massal
    getRowId?: (row: TData) => string;
    pageSizeOptions?: number[];
    emptyText?: string;
    statusFilter?: React.ReactNode;
    renderSubComponent?: (props: { row: any }) => React.ReactNode;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    paginationMeta,
    filters = {},
    routeName,
    getSubRows,
    enableSearch = true,
    enableSorting = true,
    enablePagination = true,
    enableRowSelection = false,
    bulkActions,
    bulkDeleteRoute, // <-- Tangkap props-nya di sini
    getRowId,
    pageSizeOptions = [10, 20, 50, 100],
    emptyText = 'No data found.',
    statusFilter,
    renderSubComponent,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>(
        filters.sort ? [{ id: filters.sort, desc: filters.direction === 'desc' }] : []
    );
    const [globalFilter, setGlobalFilter] = React.useState<string>(filters.search ?? '');
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Debounce Search effect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (globalFilter !== (filters.search ?? '')) {
                router.get(routeName, { ...filters, search: globalFilter, page: 1 }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Sorting effect
    React.useEffect(() => {
        if (sorting.length > 0 && sorting[0]) {
            const currentSort = sorting[0];
            if (typeof currentSort.id !== 'string') {
                return;
            }

            const sortField = String(sorting[0].id);
            if (!sortField || sortField.startsWith('__') || sortField === 'actions') return;

            const sortDirection = sorting[0].desc ? 'desc' : 'asc';
            if (sortField !== filters.sort || sortDirection !== filters.direction) {
                router.get(routeName, { ...filters, sort: sortField, direction: sortDirection }, { preserveState: true, replace: true });
            }
        }
    }, [sorting]);

    const selectionColumn: ColumnDef<TData> = {
        id: '__select',
        header: ({ table }) => (
            <input type="checkbox" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />
        ),
        cell: ({ row }) => (
            <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
        ),
        size: 40,
    };

    const finalColumns = React.useMemo(() => {
        if (!enableRowSelection) return columns;
        return [selectionColumn, ...columns];
    }, [columns, enableRowSelection]);

    const table = useReactTable({
        data,
        columns: finalColumns,
        pageCount: paginationMeta?.last_page ?? -1,
        state: {
            sorting,
            globalFilter,
            expanded,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: (paginationMeta?.current_page ?? 1) - 1,
                pageSize: paginationMeta?.per_page ?? 10,
            },
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        enableRowSelection,
        getRowId: getRowId ?? ((row: any) => row.id),
        getSubRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(), 
        getRowCanExpand: () => true,
    });

    const selectedRows = table.getSelectedRowModel().rows.map(r => r.original);

    // Fungsi otomatis untuk menghapus data massal jika bulkDeleteRoute disediakan
    const handleDefaultBulkDelete = () => {
        if (!bulkDeleteRoute) return;
        const ids = selectedRows.map((row: any) => row.id);

        router.post(bulkDeleteRoute, { ids }, {
            preserveScroll: true,
            onSuccess: () => {
                table.resetRowSelection(); // Bersihkan pilihan setelah sukses
            },
        });
    };

    const handlePageChange = (newPage: number) => {
        router.get(routeName, { ...filters, page: newPage }, { preserveState: true, replace: true });
    };

    const handlePageSizeChange = (newSize: number) => {
        router.get(routeName, { ...filters, per_page: newSize, page: 1 }, { preserveState: true, replace: true });
    };

    return (
        <div className="space-y-4">
            {/* Tampilkan custom bulkActions jika ada, atau fallback otomatis ke tombol hapus bawaan jika bulkDeleteRoute diisi */}
            {enableRowSelection && selectedRows.length > 0 && (
                <>
                    {bulkActions ? (
                        <DataTableBulkActions selectedRows={selectedRows} bulkActions={bulkActions} />
                    ) : bulkDeleteRoute ? (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50 dark:bg-muted/30 border-border">
                            <span className="text-sm font-medium text-foreground">
                                {selectedRows.length} data dipilih
                            </span>
                            <ConfirmDialog
                                trigger={
                                    <Button variant="destructive" size="sm">
                                        <Trash2 size={15} className="mr-1.5" /> Hapus Terpilih
                                    </Button>
                                }
                                title="Hapus Data Terpilih?"
                                description={`Yakin ingin menghapus ${selectedRows.length} data yang dipilih secara massal?`}
                                confirmText="Hapus"
                                onConfirm={handleDefaultBulkDelete}
                            />
                        </div>
                    ) : null}
                </>
            )}

            <DataTableToolbar
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                enableSearch={enableSearch}
                statusFilter={statusFilter}
            />

            {/* TABLE */}
            <div className="border border-[var(--border)] rounded-md overflow-hidden bg-card text-card-foreground">
                <Table>
                    <TableHeader className="dark:bg-muted/50">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="border-[var(--border)]">
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={enableSorting && header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        className={enableSorting && header.column.getCanSort() ? 'cursor-pointer select-none dark:text-muted-foreground' : 'dark:text-muted-foreground'}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                                <React.Fragment key={row.id}>
                                    <TableRow className="border-[var(--border)] dark:hover:bg-muted/50">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="dark:text-foreground">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Render Sub Component Tepat di Bawah Baris Persis */}
                                    {row.getIsExpanded() && renderSubComponent && (
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableCell colSpan={row.getVisibleCells().length} className="p-4">
                                                {renderSubComponent({ row })}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={finalColumns.length} className="text-center py-6 text-muted-foreground">
                                    {emptyText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {enablePagination && (
                <DataTablePagination
                    paginationMeta={paginationMeta}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
}