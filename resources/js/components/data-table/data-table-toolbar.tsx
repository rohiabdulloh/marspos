import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

export function DataTableToolbar({
    table,
    globalFilter,
    setGlobalFilter,
    enableSearch,
    statusFilter,
}: any) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            {enableSearch && (
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 bg-background text-foreground border-input"
                    />
                </div>
            )}

            <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
                {statusFilter}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="lg" className="gap-1 border-input bg-background hover:bg-accent hover:text-accent-foreground">
                            Columns <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-popover dark:text-popover-foreground dark:border-border">
                        {table.getAllLeafColumns()
                            .filter((col: any) => col.getCanHide())
                            .map((column: any) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                    className="dark:focus:bg-accent dark:focus:text-accent-foreground"
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>            
            </div>
        </div>
    );
}