export function DataTableBulkActions({ selectedRows, bulkActions }: any) {
    if (!selectedRows || selectedRows.length === 0) return null;

    return (
        <div className="flex items-center justify-between p-3 border rounded bg-muted dark:bg-muted/50 dark:border-border">
            <span className="text-sm text-foreground">{selectedRows.length} selected</span>
            <div className="flex gap-2">{bulkActions(selectedRows)}</div>
        </div>
    );
}