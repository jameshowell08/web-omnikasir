'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconArrowLeft, IconArrowRight, IconDots, IconDotsCircleHorizontal, IconDotsVertical, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

function GetPaymentMethodHeader() {
    return (
        <header className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Metode Pembayaran</h1>
            <Button variant="ghost" size="sm" onClick={() => { }}>
                <IconPlus />
                <span className="text-xs font-bold">Tambah Metode Pembayaran</span>
            </Button>
        </header>
    )
}

function ItemAmountButton({
    amount,
    isSelected = false,
    onClick
}: {
    amount: number,
    isSelected?: boolean,
    onClick: () => void
}) {
    return (
        <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            className="text-sm"
        >
            {amount} item
        </Button>
    )
}

function PaymentMethodFilter({
    searchQuery,
    setSearchQuery,
    selectedAmount,
    setSelectedAmount
}: {
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    selectedAmount: number,
    setSelectedAmount: (amount: number) => void
}) {
    return (
        <div className="mt-3 flex flex-row justify-between items-center">
            <InputGroup className="w-sm">
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="Cari metode pembayaran..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
            </InputGroup>

            <div className="flex flex-row gap-2 items-center">
                <span className="text-sm">Produk per halaman</span>
                <ItemAmountButton amount={10} isSelected={selectedAmount === 10} onClick={() => setSelectedAmount(10)} />
                <ItemAmountButton amount={20} isSelected={selectedAmount === 20} onClick={() => setSelectedAmount(20)} />
                <ItemAmountButton amount={50} isSelected={selectedAmount === 50} onClick={() => setSelectedAmount(50)} />
            </div>
        </div>
    )
}

function TablePagination() {
    return (
        <div className="mt-4 flex flex-row justify-between items-center">
            <Button variant="ghost">
                <IconArrowLeft />
                <span className="text-xs font-bold">Sebelumnya</span>
            </Button>

            <span className="text-sm">Halaman 1 dari 10</span>

            <Button variant="ghost">
                <span className="text-xs font-bold">Selanjutnya</span>
                <IconArrowRight />
            </Button>
        </div>
    )
}

function PaymentMethodTable() {
    return (
        <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <TableHead className="font-bold text-white">ID</TableHead>
                        <TableHead className="font-bold text-white">Nama Metode</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>ME-001</TableCell>
                        <TableCell className="w-full">Transfer Bank</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost"><IconDots /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <IconEdit />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
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

function GetPaymentMethodView() {
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <GetPaymentMethodHeader />
            <PaymentMethodFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedAmount={limit} setSelectedAmount={setLimit} />
            <PaymentMethodTable />
            <TablePagination />
        </div>
    )
}

export default GetPaymentMethodView;