import { Skeleton } from "@/components/ui/skeleton";


function TablePlaceholder() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="mt-4 h-10" />
            <Skeleton className="h-[400px]" />
        </div>
    )
}

export default TablePlaceholder;