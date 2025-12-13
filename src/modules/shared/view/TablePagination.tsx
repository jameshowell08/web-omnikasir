import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

function TablePagination({currentPage, maxPage, onNextPage, onPreviousPage}: {currentPage: number, maxPage: number, onNextPage: () => void, onPreviousPage: () => void}) {
    return (
        <div className="mt-2 flex flex-row justify-between items-center">
            <Button variant="ghost" size="sm" onClick={onPreviousPage} disabled={currentPage === 1}>
                <IconArrowLeft />
                <span className="text-xs font-bold">Sebelumnya</span>
            </Button>

            <span className="text-xs">Halaman {currentPage} dari {maxPage}</span>

            <Button variant="ghost" size="sm" onClick={onNextPage} disabled={currentPage === maxPage}>
                <span className="text-xs font-bold">Selanjutnya</span>
                <IconArrowRight />
            </Button>
        </div>
    )
}

export default TablePagination;