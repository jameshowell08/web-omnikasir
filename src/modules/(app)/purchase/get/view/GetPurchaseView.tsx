'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { IconDots, IconEdit, IconEye, IconFilter, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GetPurchaseController from "../controller/GetPurchaseController";
import PurchaseData from "../model/PurchaseData";
import { FieldGroup } from "@/components/ui/field";
import FilterDialogBody from "./FilterDialogBody";
import PurchaseFilterFormScheme from "../model/PurchaseFilterFormScheme";
import z from "zod";

function GetPurchaseHeader() {
    return (
        <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Pembelian</h1>
            <Button variant="ghost" size="sm">
                <IconPlus />
                <span className="text-xs font-bold">Tambah Pembelian</span>
            </Button>
        </div>
    )
}

function SearchField({ 
    searchQuery, 
    setSearchQuery, 
    isSearchLoading,
    appliedFilters,
    setAppliedFilters
}: { 
    searchQuery: string, 
    setSearchQuery: (query: string) => void, 
    isSearchLoading: boolean,
    appliedFilters: z.infer<typeof PurchaseFilterFormScheme>,
    setAppliedFilters: (filters: z.infer<typeof PurchaseFilterFormScheme>) => void
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex flex-row items-center gap-2">
            <InputGroup className="w-sm">
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>
                <InputGroupInput placeholder="Cari Pembelian" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {
                    isSearchLoading && (
                        <InputGroupAddon align="inline-end">
                            <Spinner />
                        </InputGroupAddon>
                    )
                }
            </InputGroup>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                    <Button size="icon">
                        <IconFilter />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filter</DialogTitle>
                    </DialogHeader>

                    <FilterDialogBody dismissDialog={() => setIsFilterOpen(false)} appliedFilters={appliedFilters} handleSubmitFilter={(data) => { setAppliedFilters(data) }} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ItemPerPage({ amount, isSelected, onSelect }: { amount: number, isSelected: boolean, onSelect: () => void }) {
    return (
        <Button variant={isSelected ? "default" : "outline"} size="sm" className="text-xs" onClick={onSelect}>
            {amount} item
        </Button>
    )
}

function ItemsPerPage({ itemAmount, onItemAmountChange }: { itemAmount: number, onItemAmountChange: (amount: number) => void }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <span className="text-xs">Item per halaman</span>
            <ItemPerPage amount={10} isSelected={itemAmount === 10} onSelect={() => onItemAmountChange(10)} />
            <ItemPerPage amount={20} isSelected={itemAmount === 20} onSelect={() => onItemAmountChange(20)} />
            <ItemPerPage amount={50} isSelected={itemAmount === 50} onSelect={() => onItemAmountChange(50)} />
        </div>
    )
}

function TableFilter({
    appliedFilters,
    setAppliedFilters,
    itemAmount,
    onItemAmountChange,
    searchQuery,
    setSearchQuery,
    isSearchLoading
}: {
    appliedFilters: z.infer<typeof PurchaseFilterFormScheme>,
    setAppliedFilters: (filters: z.infer<typeof PurchaseFilterFormScheme>) => void,
    itemAmount: number,
    onItemAmountChange: (amount: number) => void,
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    isSearchLoading: boolean
}) {
    return (
        <div className="mt-2 flex flex-row items-center justify-between">
            <SearchField 
                appliedFilters={appliedFilters} 
                setAppliedFilters={setAppliedFilters} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                isSearchLoading={isSearchLoading} 
            />
            <ItemsPerPage itemAmount={itemAmount} onItemAmountChange={onItemAmountChange} />
        </div>
    )
}

function CustomTableHead({ children }: { children: React.ReactNode }) {
    return (
        <TableHead className="font-bold text-white">
            {children}
        </TableHead>
    )
}

function PurchaseTable({ purchases }: { purchases: PurchaseData[] }) {
    return (
        <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <CustomTableHead>Tanggal</CustomTableHead>
                        <CustomTableHead>ID Pembelian</CustomTableHead>
                        <CustomTableHead>Status</CustomTableHead>
                        <CustomTableHead>Supplier</CustomTableHead>
                        <CustomTableHead>Total Transaksi</CustomTableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                            <TableCell>{BaseUtil.formatDate(purchase.date)}</TableCell>
                            <TableCell>{purchase.id}</TableCell>
                            <TableCell>{purchase.status}</TableCell>
                            <TableCell>{purchase.supplier}</TableCell>
                            <TableCell>{BaseUtil.formatRupiah(purchase.total)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <IconDots />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <Link href={Routes.PURCHASE.GET_BY_ID(purchase.id)}>
                                                <IconEye />
                                                Lihat
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <IconEdit />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive">
                                            <IconTrash />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function GetPurchaseView() {
    const [displayedPurchases, setDisplayedPurchases] = useState<PurchaseData[] | null>(null);
    const [itemAmount, setItemAmount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debounce = useRef<NodeJS.Timeout | null>(null);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<z.infer<typeof PurchaseFilterFormScheme>>({
        supplier: "",
        status: "ALL",
        dateFrom: undefined,
        dateTo: undefined,
    });

    const fetchPurchasesData = async () => {
        const [isSuccess, totalPage, fetchedPurchases, errorMsg] = await GetPurchaseController.getPurchases(itemAmount, currentPage, debouncedSearchQuery, appliedFilters);
        if (isSuccess) {
            setDisplayedPurchases(fetchedPurchases);
            setTotalPage(totalPage);
        } else {
            toast.error(errorMsg)
        }
        setIsSearchLoading(false);
    }

    const handleSearchChange = async (query: string) => {
        setIsSearchLoading(false);
        setSearchQuery(query);
        if (debounce.current) {
            clearTimeout(debounce.current);
        }
        debounce.current = setTimeout(() => {
            setIsSearchLoading(true);
            setDebouncedSearchQuery(query);
            setCurrentPage(1);
        }, 500);
    }

    useEffect(() => {
        fetchPurchasesData();
    }, [itemAmount, currentPage, debouncedSearchQuery, appliedFilters]);

    return (
        <div>
            <GetPurchaseHeader />
            <TableFilter appliedFilters={appliedFilters} setAppliedFilters={setAppliedFilters} itemAmount={itemAmount} onItemAmountChange={setItemAmount} searchQuery={searchQuery} setSearchQuery={handleSearchChange} isSearchLoading={isSearchLoading} />
            {
                displayedPurchases ? <PurchaseTable purchases={displayedPurchases} /> : <TablePlaceholder />
            }
            <TablePagination currentPage={currentPage} maxPage={totalPage} onNextPage={() => setCurrentPage(currentPage + 1)} onPreviousPage={() => setCurrentPage(currentPage - 1)} />
        </div>
    )
}

export default GetPurchaseView;