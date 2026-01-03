import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

function TablePagination({currentPage, maxPage, onChangePage}: {currentPage: number, maxPage: number, onChangePage: (page: number) => void}) {
    return (
        <div className="mt-2 flex flex-row justify-between items-center">
            <Button type="button" variant="ghost" size="sm" onClick={() => onChangePage(currentPage - 1)} disabled={currentPage === 1}>
                <IconArrowLeft />
                <span className="text-xs font-bold">Sebelumnya</span>
            </Button>

            <span className="text-xs">Halaman {currentPage} dari {maxPage}</span>

            <Button type="button" variant="ghost" size="sm" onClick={() => onChangePage(currentPage + 1)} disabled={currentPage === maxPage}>
                <span className="text-xs font-bold">Selanjutnya</span>
                <IconArrowRight />
            </Button>
        </div>
    )
}

export default TablePagination;