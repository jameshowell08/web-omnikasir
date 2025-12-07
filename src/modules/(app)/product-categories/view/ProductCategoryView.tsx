'use client';
import { useState } from "react";
import ProductCategoryController from "../controller/ProductCategoryController";
import ProductCategoryEventCallback from "../model/ProductCategoryCallback";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight, IconDots, IconEdit, IconFilter, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

function ProductCategoryHeader() {
    return (
        <header className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Kategori Produk</h1>
            <Button size="sm" variant="ghost">
                <IconPlus />
                <span className="text-xs font-bold">Tambah Kategori</span>
            </Button>
        </header>
    )
}

function ItemAmountButton(props: { label: string, selected: boolean }) {
    return (
        <Button size="sm" variant={props.selected ? "default" : "outline"} className="text-xs">
            {props.label}
        </Button>
    )
}

function FilterSection() {
    return (
        <section className="mt-5 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
                <InputGroup className="w-96">
                    <InputGroupInput
                        placeholder="Cari ID / Nama..."
                    />
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="text-xs flex flex-row items-center gap-2">
                Produk per halaman
                <ItemAmountButton label="10 items" selected={true} />
                <ItemAmountButton label="20 items" selected={false} />
                <ItemAmountButton label="50 items" selected={false} />
            </div>
        </section>
    )
}

function TablePagination() {
    return (
        <div className="flex flex-row justify-between items-center mt-5">
            <Button size="sm" variant="ghost">
                <IconArrowLeft />
                Sebelumnya
            </Button>

            <span className="text-sm">Halaman 1 dari 1</span>

            <Button size="sm" variant="ghost">
                Selanjutnya
                <IconArrowRight />
            </Button>
        </div>
    )
}

function ProductCategoryTable() {
    return (
        <div className="border rounded-lg overflow-hidden mt-5">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <TableHead className="text-white font-bold">ID Kategori</TableHead>
                        <TableHead className="text-white font-bold">Nama Kategori</TableHead>
                        <TableHead className="text-white font-bold">Deskripsi</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Nama Kategori</TableCell>
                        <TableCell wrap>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente culpa libero alias cum aliquid aliquam! Recusandae, deserunt laboriosam asperiores quis eos cumque nam quas molestias obcaecati aut maxime fugiat tempore!</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <IconDots />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <IconEdit />
                                        Ubah
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

function ProductCategoryView() {
    function eventCallback(e: ProductCategoryEventCallback) {

    }

    const [controller] = useState(() => new ProductCategoryController(eventCallback))

    return (
        <div className="flex flex-col w-full">
            <ProductCategoryHeader />
            <FilterSection />
            <ProductCategoryTable />
            <TablePagination />
        </div>
    )
}

export default ProductCategoryView;