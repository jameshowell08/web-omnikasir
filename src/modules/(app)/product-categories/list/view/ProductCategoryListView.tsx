'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { IconDots, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import ProductCategoryListController from "../controller/ProductCategoryListController";
import ProductCategory from "../model/ProductCategory";
import { ProductCategoryListEventCallback, RefreshProductCategoryList, ShowHideLoadingOverlay, ShowToast, UpdateProductCategoryEventCallback } from "../model/ProductCategoryListEventCallback";
import toast from "react-hot-toast";
import Link from "next/link";
import { Constants } from "@/src/modules/shared/model/Constants";

function ProductCategoryHeader() {
    return (
        <header className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Kategori Produk</h1>
            <Button size="sm" variant="ghost" asChild>
                <Link href={Constants.ADD_CATEGORY_URL}>
                    <IconPlus />
                    <span className="text-xs font-bold">Tambah Kategori</span>
                </Link>
            </Button>
        </header>
    )
}

function FilterSection(props: { searchQuery: string, setSearchQuery: (query: string) => void }) {
    return (
        <section className="mt-5 flex flex-row justify-between items-center">
            <InputGroup className="w-96">
                <InputGroupInput
                    placeholder="Cari ID / Nama..."
                    value={props.searchQuery}
                    onChange={(e) => props.setSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>
            </InputGroup>
        </section>
    )
}

function ProductCategoryTable(props: { categories: ProductCategory[], deleteCategory: (sku: string) => void }) {
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
                    {
                        props.categories.map((category) => (
                            <TableRow key={category.categoryId}>
                                <TableCell>{category.categoryId}</TableCell>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell wrap>{category.description}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <IconDots />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/product-categories/edit/${category.categoryId}`}>
                                                    <IconEdit />
                                                    Ubah
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem variant="destructive" onClick={() => props.deleteCategory(category.categoryId)}>
                                                <IconTrash />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function ProductCategoryListView() {
    function eventCallback(e: ProductCategoryListEventCallback) {
        if (e instanceof UpdateProductCategoryEventCallback) {
            setDisplayedCategories(e.categories)
        } else if (e instanceof ShowHideLoadingOverlay) {
            showLoadingOverlay(e.show)
        } else if (e instanceof ShowToast) {
            if (e.type === "success") {
                toast.success(e.message)
            } else {
                toast.error(e.message)
            }
        } else if (e instanceof RefreshProductCategoryList) {
            controller.getCategories(searchQuery)
        }
    }

    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const [controller] = useState(() => new ProductCategoryListController(eventCallback))
    const [displayedCategories, setDisplayedCategories] = useState<ProductCategory[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const timerId = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        controller.getCategories()
    }, [])

    useEffect(() => {
        if (timerId.current) {
            clearTimeout(timerId.current)
        }
        timerId.current = setTimeout(() => {
            controller.getCategories(searchQuery)
        }, 500)
        return () => {
            if (timerId.current) {
                clearTimeout(timerId.current)
            }
        }
    }, [searchQuery])

    return (
        <div className="flex flex-col w-full">
            <ProductCategoryHeader />
            <FilterSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ProductCategoryTable categories={displayedCategories} deleteCategory={(sku) => { controller.deleteCategory(sku) }} />
        </div>
    )
}

export default ProductCategoryListView;