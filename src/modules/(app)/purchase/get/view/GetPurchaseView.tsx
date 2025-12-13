'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import { IconDots, IconEdit, IconEye, IconEyeBitcoin, IconEyeFilled, IconFilter, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import PurchaseData from "../model/PurchaseData";
import { useEffect, useState } from "react";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import GetPurchaseController from "../controller/GetPurchaseController";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import toast from "react-hot-toast";
import Link from "next/link";
import Routes from "@/src/modules/shared/model/Routes";

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

function SearchField() {
    return (
        <div className="flex flex-row items-center gap-2">
            <InputGroup className="w-sm">
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>
                <InputGroupInput placeholder="Cari Pembelian" />
            </InputGroup>
            <Button size="icon">
                <IconFilter />
            </Button>
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

function TableFilter({ itemAmount, onItemAmountChange }: { itemAmount: number, onItemAmountChange: (amount: number) => void }) {
    return (
        <div className="mt-2 flex flex-row items-center justify-between">
            <SearchField />
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
                            <TableCell>{purchase.total}</TableCell>
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

    const fetchPurchasesData = async () => {
        const [isSuccess, totalPage, fetchedPurchases, errorMsg] = await GetPurchaseController.getPurchases(itemAmount, currentPage);
        if (isSuccess) {
            setDisplayedPurchases(fetchedPurchases);
            setTotalPage(totalPage);
        } else {
            toast.error(errorMsg)
        }
    }

    useEffect(() => {
        fetchPurchasesData();
    }, [itemAmount, currentPage]);

    return (
        <div>
            <GetPurchaseHeader />
            <TableFilter itemAmount={itemAmount} onItemAmountChange={setItemAmount} />
            {
                displayedPurchases ? <PurchaseTable purchases={displayedPurchases} /> : <TablePlaceholder />
            }
            <TablePagination currentPage={currentPage} maxPage={totalPage} onNextPage={() => setCurrentPage(currentPage + 1)} onPreviousPage={() => setCurrentPage(currentPage - 1)} />
        </div>
    )
}

export default GetPurchaseView;