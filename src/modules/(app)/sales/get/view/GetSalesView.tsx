'use client';
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import Header from "@/src/modules/shared/view/Header";
import ItemAmountSelectSection from "@/src/modules/shared/view/ItemAmountSelectSection";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { Dialog } from "@radix-ui/react-dialog";
import { IconDots, IconFilter, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GetSalesController from "../controller/GetSalesController";
import SalesTableData from "../model/SalesTableData";

function FilterDialogBody() {
    return (
        <section>
            <FieldGroup>
                <Field>
                    <FieldLabel>Metode Transaksi</FieldLabel>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih metode transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OFFLINE">Offline</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel>Metode Pembayaran</FieldLabel>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih metode pembayaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="gopay">Gopay</SelectItem>
                            <SelectItem value="ovo">Ovo</SelectItem>
                            <SelectItem value="shopee-pay">Shopee Pay</SelectItem>
                            <SelectItem value="dana">Dana</SelectItem>
                            <SelectItem value="linkaja">Linkaja</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <div className="flex flex-row gap-2">
                    <Field>
                        <FieldLabel>Dari tanggal</FieldLabel>
                        <DatePicker date={new Date("2025-02-10")} setDate={() => { }} />
                    </Field>
                    <Field>
                        <FieldLabel>Sampai tanggal</FieldLabel>
                        <DatePicker date={new Date("2025-02-10")} setDate={() => { }} />
                    </Field>
                </div>
            </FieldGroup>
        </section>
    )
}

function FilterSales({ selectedAmount, isSearchLoading, onAmountChange, onQueryChange, setIsSearchLoading }: { selectedAmount: number, onAmountChange: (amount: number) => void, onQueryChange: (query: string) => void, isSearchLoading: boolean, setIsSearchLoading: (isLoading: boolean) => void }) {
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const debounce = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (query: string) => {
        setIsSearchLoading(true);
        setDebouncedSearchQuery(query);
        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        debounce.current = setTimeout(() => {
            onQueryChange(query);
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

                    {isSearchLoading && (
                        <InputGroupAddon align="inline-end">
                            <Spinner />
                        </InputGroupAddon>
                    )}
                </InputGroup>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="icon">
                            <IconFilter />
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Filter penjualan</DialogTitle>
                        <DialogDescription>Filter penjualan berdasarkan metode transaksi, metode pembayaran, dan tanggal transaksi.</DialogDescription>

                        <FilterDialogBody />

                        <DialogFooter>
                            <Button>Terapkan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const fetchSales = async (currentPage: number, selectedAmount: number, searchQuery: string) => {
        const [success, salesData, errorMessage, totalPages] = await GetSalesController.getSales(currentPage, selectedAmount, searchQuery)

        if (success) {
            setSales(salesData)
            setTotalPage(totalPages)
        } else {
            toast.error(errorMessage)
        }
        setIsSearchLoading(false)
    }

    useEffect(() => {
        fetchSales(currentPage, selectedAmount, searchQuery)
    }, [currentPage, selectedAmount, searchQuery])

    return (
        <div>
            <Header title="Penjualan" buttonLabel="Tambah penjualan" buttonHref={Routes.SALES.ADD} />
            <FilterSales isSearchLoading={isSearchLoading} selectedAmount={selectedAmount} onAmountChange={setSelectedAmount} setIsSearchLoading={setIsSearchLoading} onQueryChange={setSearchQuery} />
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