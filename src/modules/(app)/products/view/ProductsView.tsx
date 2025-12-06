'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Constants } from "@/src/modules/shared/model/Constants";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
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
import { ApplyFilters, ProductsEventCallback, ShowErrorToast, ShowHideLoadingOverlay, UpdateCategories, UpdateDisplayedProducts, UpdateTotalPageAmount } from "../model/ProductsEventCallback";
import ItemButton from "./component/ItemButton";


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
                <span
                    className="flex flex-row gap-1 items-center px-2 py-1 rounded-lg hover:bg-black/10 select-none"
                    onClick={() => { router.push(Constants.ADD_PRODUCT_URL) }}>
                    <IconPlus />
                    <span className="text-xs font-bold">Tambah Produk</span>
                </span>
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
                    <span className="text-xs">Produk per halaman</span>
                    <ItemButton
                        text="10 item"
                        isSelected={selectedAmountOfItem == 10}
                        onClick={() => {
                            setCurrentPage(1)
                            setSelectedAmountOfItem(10)
                        }} />
                    <ItemButton
                        text="20 item"
                        isSelected={selectedAmountOfItem == 20}
                        onClick={() => {
                            setCurrentPage(1)
                            setSelectedAmountOfItem(20)
                        }} />
                    <ItemButton
                        text="50 item"
                        isSelected={selectedAmountOfItem == 50}
                        onClick={() => {
                            setCurrentPage(1)
                            setSelectedAmountOfItem(50)
                        }} />
                </div>
            </section >

            <section className="min-h-96">
                <table className="table-auto w-full overflow-x-auto border-separate border-spacing-y-1 mt-3">
                    <thead>
                        <tr className="bg-black text-white text-sm font-bold text-left">
                            <th className="py-2 pl-3 rounded-l-lg">SKU</th>
                            <th className="py-2">Nama Produk</th>
                            <th className="py-2">Brand</th>
                            <th className="py-2">Kategori</th>
                            <th className="py-2">Stok</th>
                            <th className="py-2 pr-3 rounded-r-lg">Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.map((value: Product) => (
                            <tr key={value.sku} className="text-sm hover:bg-black/10 select-none" onClick={() => { router.push(Constants.EDIT_PRODUCT_URL + "/" + value.sku) }}>
                                <td className="py-2 pl-3 rounded-l-lg">{value.sku}</td>
                                <td className="py-2">{value.name}</td>
                                <td className="py-2">{value.brand}</td>
                                <td className="py-2">{value.category}</td>
                                <td className="py-2">{value.stock}</td>
                                <td className="py-2 pr-3 rounded-r-lg">{value.formatRupiah()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <footer className="mt-12 flex flex-row items-center justify-between text-sm">
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