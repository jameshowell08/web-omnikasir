'use client';
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { TableCell, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import Header from "@/src/modules/shared/view/Header";
import ItemAmountSelectSection from "@/src/modules/shared/view/ItemAmountSelectSection";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import { IconDots, IconFilter, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import SalesTableData from "../model/SalesTableData";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import GetSalesController from "../controller/GetSalesController";
import toast from "react-hot-toast";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { Spinner } from "@/components/ui/spinner";

function FilterSales({ selectedAmount, onAmountChange, onQueryChange }: { selectedAmount: number, onAmountChange: (amount: number) => void, onQueryChange: (query: string) => void }) {
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const debounce = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (query: string) => {
        setIsLoading(true);
        setDebouncedSearchQuery(query);
        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        debounce.current = setTimeout(() => {
            onQueryChange(query);
            setIsLoading(false);
        }, 500);
    }

    return (
        <div className="mt-4 flex flex-row justify-between">
            <span className="flex flex-row gap-2 w-100">
                <InputGroup>
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>

                    <InputGroupInput value={debouncedSearchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Cari penjualan" />

                    {isLoading && (
                        <InputGroupAddon align="inline-end">
                            <Spinner />
                        </InputGroupAddon>
                    )}
                </InputGroup>

                <Button size="icon">
                    <IconFilter />
                </Button>
            </span>

            <ItemAmountSelectSection selectedAmount={selectedAmount} onAmountChange={onAmountChange} />
        </div>
    )
}

function GetSalesView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAmount, setSelectedAmount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sales, setSales] = useState<SalesTableData[] | undefined>(undefined);
    const [totalPage, setTotalPage] = useState(1);

    const fetchSales = async (currentPage: number, selectedAmount: number, searchQuery: string) => {
        const [success, salesData, errorMessage, totalPages] = await GetSalesController.getSales(currentPage, selectedAmount, searchQuery)

        if (success) {
            setSales(salesData)
            setTotalPage(totalPages)
        } else {
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        fetchSales(currentPage, selectedAmount, searchQuery)
    }, [currentPage, selectedAmount, searchQuery])

    return (
        <div>
            <Header title="Penjualan" buttonLabel="Tambah penjualan" buttonHref={Routes.SALES.ADD} />
            <FilterSales selectedAmount={selectedAmount} onAmountChange={setSelectedAmount} onQueryChange={setSearchQuery} />
            {
                sales ? (
                    <CustomTable headers={["ID", "Tanggal", "Metode Transaksi", "Status", "Metode Pembayaran", "Total"]} haveActions>
                        {
                            sales.map((sale) => (
                                <TableRow key={sale.transactionHeaderId}>
                                    <TableCell>{sale.transactionHeaderId}</TableCell>
                                    <TableCell>{BaseUtil.formatDate(sale.transactionDate)}</TableCell>
                                    <TableCell>{sale.transactionMethod}</TableCell>
                                    <TableCell>{sale.status}</TableCell>
                                    <TableCell>{sale.paymentMethod}</TableCell>
                                    <TableCell>{BaseUtil.formatRupiah(sale.totalAmount)}</TableCell>
                                    <TableCell className="w-0">
                                        <Button size="icon-sm" variant="ghost">
                                            <IconDots />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </CustomTable>
                ) : (<TablePlaceholder />)
            }
            <TablePagination currentPage={currentPage} maxPage={totalPage} onChangePage={setCurrentPage} />
        </div>
    )
}

export default GetSalesView;