import { Button } from '@/components/ui/button';

export function DataTablePagination({
    paginationMeta,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
}: any) {
    if (!paginationMeta) return null;

    return (
        <div className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2 text-sm">
                <span>Rows per page:</span>
                <select
                    value={paginationMeta.per_page}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 bg-background text-foreground dark:border-input"
                >
                    {pageSizeOptions.map((size: number) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                    Page {paginationMeta.current_page} of {paginationMeta.last_page}
                </span>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(paginationMeta.current_page - 1)}
                        disabled={paginationMeta.current_page <= 1}
                        className="dark:bg-background dark:border-input"
                    >
                        Prev
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(paginationMeta.current_page + 1)}
                        disabled={paginationMeta.current_page >= paginationMeta.last_page}
                        className="dark:bg-background dark:border-input"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}