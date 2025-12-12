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

function ItemsPerPage() {
    return (
        <div className="flex flex-row items-center gap-2">
            <span className="text-xs">Item per halaman</span>
            <ItemPerPage amount={10} isSelected={true} onSelect={() => { }} />
            <ItemPerPage amount={20} isSelected={false} onSelect={() => { }} />
            <ItemPerPage amount={50} isSelected={false} onSelect={() => { }} />
        </div>
    )
}

function TableFilter() {
    return (
        <div className="mt-2 flex flex-row items-center justify-between">
            <SearchField />
            <ItemsPerPage />
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
                        <CustomTableHead>Produk</CustomTableHead>
                        <CustomTableHead>Jumlah</CustomTableHead>
                        <CustomTableHead>Total Transaksi</CustomTableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                            <TableCell>{purchase.date}</TableCell>
                            <TableCell>{purchase.id}</TableCell>
                            <TableCell>{purchase.status}</TableCell>
                            <TableCell>{purchase.product}</TableCell>
                            <TableCell>{purchase.quantity}</TableCell>
                            <TableCell>{purchase.total}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <IconDots />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <IconEye />
                                            Lihat
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

    const fetchPurchasesData = async () => {
        const fetchedPurchases = await GetPurchaseController.getPurchase();
        setDisplayedPurchases(fetchedPurchases);
    }

    useEffect(() => {
        fetchPurchasesData();
    }, []);

    return (
        <div>
            <GetPurchaseHeader />
            <TableFilter />
            {
                displayedPurchases ? <PurchaseTable purchases={displayedPurchases} /> : <TablePlaceholder />
            }
            <TablePagination currentPage={1} maxPage={10} onNextPage={() => { }} onPreviousPage={() => { }} />
        </div>
    )
}

export default GetPurchaseView;