'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import { IconDots, IconEdit, IconEye, IconEyeBitcoin, IconEyeFilled, IconFilter, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";

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

function PurchaseTable() {
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
                    <TableRow>
                        <TableCell>23/12/2025</TableCell>
                        <TableCell>98767890987678</TableCell>
                        <TableCell>Drafted</TableCell>
                        <TableCell>Samsung S23 Ultra 256 GB</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>Rp135,000</TableCell>
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
                </TableBody>
            </Table>
        </div>
    )
}

function GetPurchaseView() {
    return (
        <div>
            <GetPurchaseHeader />
            <TableFilter />
            <PurchaseTable />
            <TablePagination currentPage={1} maxPage={10} onNextPage={() => { }} onPreviousPage={() => { }} />
        </div>
    )
}

export default GetPurchaseView;