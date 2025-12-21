/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Constants } from "@/src/modules/shared/model/Constants";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconDots, IconEdit, IconFilter, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { ProductsController } from "../controller/ProductsController";
import { Category } from "../model/Category";
import { Product } from "../model/Product";
import { ProductFilterFormScheme } from "../model/ProductFilterFormScheme";
import { ApplyFilters, ProductsEventCallback, ShowErrorToast, ShowHideLoadingOverlay, ShowSuccessfulToast, UpdateCategories, UpdateDisplayedProducts, UpdateTotalPageAmount } from "../model/ProductsEventCallback";

function ProductsView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const router = useRouter();
    const [selectedAmountOfItem, setSelectedAmountOfItem] = useState(10)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [searchField, setSearchField] = useState<string>("")

    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    function performSearch(searchTerm: string) {
        controller.getProducts(
            selectedAmountOfItem,
            currentPage,
            searchTerm == "" ? null : searchTerm,
            appliedFilters.category,
            appliedFilters.minPrice,
            appliedFilters.maxPrice,
            appliedFilters.minStock,
            appliedFilters.maxStock
        )
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
            performSearch(searchField)
        }
    }

    const filterForm = useForm({
        resolver: zodResolver(ProductFilterFormScheme),
        defaultValues: {
            category: null,
            minPrice: null,
            maxPrice: null,
            minStock: null,
            maxStock: null,
        }
    })

    const [appliedFilters, setAppliedFilters] = useState<z.infer<typeof ProductFilterFormScheme>>({
        category: null,
        minPrice: null,
        maxPrice: null,
        minStock: null,
        maxStock: null,
    })

    const [isFilterDialogOpen, showFilterDialog] = useState(false)

    function eventCallback(e: ProductsEventCallback) {
        if (e instanceof UpdateTotalPageAmount) {
            setTotalPage(e.newTotalPage)
        } else if (e instanceof UpdateDisplayedProducts) {
            setDisplayedProducts(e.newDisplayedProducts)
        } else if (e instanceof ShowHideLoadingOverlay) {
            showLoadingOverlay(e.showLoadingOverlay)
        } else if (e instanceof ShowErrorToast) {
            toast.error(e.errorMessage)
        } else if (e instanceof ShowSuccessfulToast) {
            toast.success(e.message)
        } else if (e instanceof UpdateCategories) {
            setCategories(e.newCategories)
        } else if (e instanceof ApplyFilters) {
            setAppliedFilters(e.newFilters)
            showFilterDialog(false)
        }
    }
    const [controller] = useState(new ProductsController(eventCallback))

    useEffect(() => {
        controller.getProducts(
            selectedAmountOfItem,
            currentPage,
            searchField == "" ? null : searchField,
            appliedFilters.category,
            appliedFilters.minPrice,
            appliedFilters.maxPrice,
            appliedFilters.minStock,
            appliedFilters.maxStock
        )
    }, [controller, selectedAmountOfItem, currentPage, appliedFilters])

    useEffect(() => {
        controller.initialize()
    }, [])

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            performSearch(searchField)
        }, 500)
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
        }
    }, [searchField])

    return (
        <>
            <header className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">Produk</h1>
                <Button onClick={() => { router.push(Constants.ADD_PRODUCT_URL) }} variant="ghost" size="sm">
                    <IconPlus />
                    <span className="text-xs font-bold">Tambah Produk</span>
                </Button>
            </header>

            <section className="mt-4 flex flex-row justify-between items-center">
                <Dialog
                    open={isFilterDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            showFilterDialog(false)
                            filterForm.resetField("category")
                            filterForm.resetField("minPrice")
                            filterForm.resetField("maxPrice")
                            filterForm.resetField("minStock")
                            filterForm.resetField("maxStock")
                        } else {
                            showFilterDialog(true)
                            filterForm.setValue("category", appliedFilters.category)
                            filterForm.setValue("minPrice", appliedFilters.minPrice ? BaseUtil.formatNumber(appliedFilters.minPrice) : null)
                            filterForm.setValue("maxPrice", appliedFilters.maxPrice ? BaseUtil.formatNumber(appliedFilters.maxPrice) : null)
                            filterForm.setValue("minStock", appliedFilters.minStock ? BaseUtil.formatNumber(appliedFilters.minStock) : null)
                            filterForm.setValue("maxStock", appliedFilters.maxStock ? BaseUtil.formatNumber(appliedFilters.maxStock) : null)
                        }
                    }}
                >
                    <div className="flex flex-row gap-2 w-80">
                        <InputGroup>
                            <InputGroupInput
                                value={searchField}
                                placeholder="Cari produk..."
                                onChange={(e) => setSearchField(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <InputGroupAddon>
                                <IconSearch />
                            </InputGroupAddon>
                        </InputGroup>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                aria-label="Filter"
                                type="button"
                                onClick={() => showFilterDialog(true)}
                            >
                                <IconFilter />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filter</DialogTitle>
                            </DialogHeader>
                            <form id="filter-form" onSubmit={filterForm.handleSubmit((val) => controller.onApplyFilters(val))}>
                                <FieldGroup className="gap-3">
                                    <Controller
                                        name="category"
                                        control={filterForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel className="font-bold" htmlFor="product-form-category">Kategori</FieldLabel>
                                                <Select
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger id="product-form-category" aria-invalid={fieldState.invalid}>
                                                        <SelectValue placeholder="Pilih kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            categories.map((category) => (
                                                                <SelectItem key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <div className="flex flex-row gap-3">
                                        <Controller
                                            name="minPrice"
                                            control={filterForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel className="font-bold">Harga Minimum</FieldLabel>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            id="filter-form-min-price"
                                                            placeholder="Harga minimum"
                                                            aria-invalid={fieldState.invalid}
                                                            onFocus={(val) => {
                                                                const unformatted = BaseUtil.unformatNumber(val.target.value);
                                                                field.onChange(unformatted);
                                                            }}
                                                            onBlur={(val) => {
                                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                                field.onChange(formatted);
                                                                field.onBlur();
                                                            }}
                                                        />
                                                        <InputGroupAddon>
                                                            <InputGroupText>
                                                                Rp
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {
                                                        fieldState.invalid && (
                                                            <FieldError>
                                                                {fieldState.error?.message}
                                                            </FieldError>
                                                        )
                                                    }
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="maxPrice"
                                            control={filterForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel className="font-bold">Harga Maksimum</FieldLabel>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            id="filter-form-max-price"
                                                            placeholder="Harga maksimum"
                                                            aria-invalid={fieldState.invalid}
                                                            onFocus={(val) => {
                                                                const unformatted = BaseUtil.unformatNumber(val.target.value);
                                                                field.onChange(unformatted);
                                                            }}
                                                            onBlur={(val) => {
                                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                                field.onChange(formatted);
                                                                field.onBlur();
                                                            }}
                                                        />
                                                        <InputGroupAddon>
                                                            <InputGroupText>
                                                                Rp
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {
                                                        fieldState.invalid && (
                                                            <FieldError>
                                                                {fieldState.error?.message}
                                                            </FieldError>
                                                        )
                                                    }
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-row gap-3">
                                        <Controller
                                            name="minStock"
                                            control={filterForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel className="font-bold">Stok Minimum</FieldLabel>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            id="filter-form-min-stock"
                                                            placeholder="Stok minimum"
                                                            aria-invalid={fieldState.invalid}
                                                            onFocus={(val) => {
                                                                const unformatted = BaseUtil.unformatNumber(val.target.value);
                                                                field.onChange(unformatted);
                                                            }}
                                                            onBlur={(val) => {
                                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                                field.onChange(formatted);
                                                                field.onBlur();
                                                            }}
                                                        />
                                                    </InputGroup>
                                                    {
                                                        fieldState.invalid && (
                                                            <FieldError>
                                                                {fieldState.error?.message}
                                                            </FieldError>
                                                        )
                                                    }
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="maxStock"
                                            control={filterForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel className="font-bold">Stok Maksimum</FieldLabel>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            id="filter-form-max-stock"
                                                            placeholder="Stok maksimum"
                                                            aria-invalid={fieldState.invalid}
                                                            onFocus={(val) => {
                                                                const unformatted = BaseUtil.unformatNumber(val.target.value);
                                                                field.onChange(unformatted);
                                                            }}
                                                            onBlur={(val) => {
                                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                                field.onChange(formatted);
                                                                field.onBlur();
                                                            }}
                                                        />
                                                    </InputGroup>
                                                    {
                                                        fieldState.invalid && (
                                                            <FieldError>
                                                                {fieldState.error?.message}
                                                            </FieldError>
                                                        )
                                                    }
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </FieldGroup>
                            </form>

                            <DialogFooter>
                                <Button
                                    variant="link"
                                    type="button"
                                    onClick={() => filterForm.reset()}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" form="filter-form">
                                    Terapkan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </div>
                </Dialog>

                <div className="flex flex-row gap-2 items-center">
                    <span className="text-sm">Item per halaman</span>
                    <Button variant={selectedAmountOfItem == 10 ? "default" : "outline"} size="sm" onClick={() => {
                        setCurrentPage(1)
                        setSelectedAmountOfItem(10)
                    }}>
                        10 item
                    </Button>
                    <Button variant={selectedAmountOfItem == 20 ? "default" : "outline"} size="sm" onClick={() => {
                        setCurrentPage(1)
                        setSelectedAmountOfItem(20)
                    }}>
                        20 item
                    </Button>
                    <Button variant={selectedAmountOfItem == 50 ? "default" : "outline"} size="sm" onClick={() => {
                        setCurrentPage(1)
                        setSelectedAmountOfItem(50)
                    }}>
                        50 item
                    </Button>
                </div>
            </section >

            <div className="border rounded-lg mt-4 overflow-hidden">
                <Table>
                    <TableHeader className="bg-black">
                        <TableRow>
                            <TableHead className="font-bold text-white">SKU</TableHead>
                            <TableHead className="font-bold text-white">Nama Produk</TableHead>
                            <TableHead className="font-bold text-white">Brand</TableHead>
                            <TableHead className="font-bold text-white">Kategori</TableHead>
                            <TableHead className="font-bold text-white">Stok</TableHead>
                            <TableHead className="font-bold text-white">Harga</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {displayedProducts.map((value: Product) => (
                            <TableRow key={value.sku}>
                                <TableCell>{value.sku}</TableCell>
                                <TableCell>{value.name}</TableCell>
                                <TableCell>{value.brand}</TableCell>
                                <TableCell>{value.category}</TableCell>
                                <TableCell>{value.stock}</TableCell>
                                <TableCell>{value.formatRupiah()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <IconDots />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                showLoadingOverlay(true)
                                                router.push(BaseUtil.formatString(Constants.EDIT_PRODUCT_URL, value.sku))
                                                showLoadingOverlay(false)
                                            }}>
                                                <IconEdit />
                                                Ubah
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => {
                                                    controller.deleteProduct(
                                                        value.sku,
                                                        selectedAmountOfItem,
                                                        currentPage,
                                                        searchField == "" ? null : searchField,
                                                        appliedFilters.category,
                                                        appliedFilters.minPrice,
                                                        appliedFilters.maxPrice,
                                                        appliedFilters.minStock,
                                                        appliedFilters.maxStock)
                                                }}>
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

            <footer className="mt-6 flex flex-row items-center justify-between text-sm">
                <span
                    className={clsx(
                        "flex flex-row items-center gap-1 px-2 py-1 w-fit select-none font-bold",
                        currentPage > 1 && "hover:bg-black/10 rounded-lg",
                    )}
                    onClick={() => {
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}>
                    <IconArrowNarrowLeft opacity={currentPage <= 1 ? 0.2 : 1} />
                    <span className={clsx(currentPage <= 1 && "text-black/20")}>Halaman sebelum</span>
                </span>

                <span>Halaman {currentPage} dari {totalPage}</span>

                <span
                    className={clsx(
                        "flex flex-row items-center gap-1 px-2 py-1 w-fit select-none font-bold",
                        currentPage < totalPage && "hover:bg-black/10 rounded-lg",
                    )}
                    onClick={() => {
                        if (currentPage < totalPage) setCurrentPage(currentPage + 1)
                    }}>
                    <span className={clsx(currentPage >= totalPage && "text-black/20")}>Halaman selanjutnya</span>
                    <IconArrowNarrowRight opacity={currentPage >= totalPage ? 0.2 : 1} />
                </span>
            </footer>
        </>
    )
}

export default ProductsView