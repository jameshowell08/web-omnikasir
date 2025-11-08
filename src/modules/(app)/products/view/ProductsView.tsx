'use client';
import TextField from "@/src/modules/shared/view/TextField"
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react"
import ItemButton from "./component/ItemButton";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Constants } from "@/src/modules/shared/model/constants";
import { ProductsController } from "../controller/ProductsController";
import { Product } from "../model/Product";
import clsx from "clsx";
import { ProductsEventCallback, ShowErrorToast, ShowHideLoadingOverlay, UpdateDisplayedProducts, UpdateTotalPageAmount } from "../model/ProductsEventCallback";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import toast from "react-hot-toast";

function ProductsView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const router = useRouter();
    const [selectedAmountOfItem, setSelectedAmountOfItem] = useState(10)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])

    function eventCallback(e: ProductsEventCallback) {
        if (e instanceof UpdateTotalPageAmount) {
            setTotalPage(e.newTotalPage)
        } else if (e instanceof UpdateDisplayedProducts) {
            setDisplayedProducts(e.newDisplayedProducts)
        } else if (e instanceof ShowHideLoadingOverlay) {
            showLoadingOverlay(e.showLoadingOverlay)
        } else if (e instanceof ShowErrorToast) {
            toast.error(e.errorMessage)
        }
    }
    const [controller] = useState(() => {
        console.log("ProductsController created!")
        return new ProductsController(eventCallback)
    })

    useEffect(() => {
        console.log("Refreshed Product")
        controller.getAllProducts(selectedAmountOfItem, currentPage)
    }, [controller, selectedAmountOfItem, currentPage])

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
                <div className="flex flex-row gap-2">
                    <TextField
                        className="w-sm"
                        name="search"
                        placeholder="Cari SKU / Nama produk..."
                        prefixIcon={IconSearch} />
                    <button className="bg-black p-3 rounded-lg hover:bg-black/85" title="filter">
                        <IconFilter color="white" />
                    </button>
                </div>

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
            </section>

            <table className="table-auto w-full border-separate border-spacing-y-1 mt-3">
                <thead>
                    <tr className="bg-black text-white text-sm font-bold text-left">
                        <th className="py-2 pl-3 rounded-l-lg">SKU</th>
                        <th className="py-2">Nama Produk</th>
                        <th className="py-2">Kategori</th>
                        <th className="py-2">Stok</th>
                        <th className="py-2 pr-3 rounded-r-lg">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedProducts.map((value: Product) => (
                        <tr key={value.sku} className="text-sm hover:bg-black/10 select-none" onClick={() => { router.push(Constants.EDIT_PRODUCT_URL) }}>
                            <td className="py-2 pl-3 rounded-l-lg">{value.sku}</td>
                            <td className="py-2">{value.name}</td>
                            <td className="py-2">{value.category}</td>
                            <td className="py-2">{value.stock}</td>
                            <td className="py-2 pr-3 rounded-r-lg">{value.formatRupiah()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="mt-12 flex flex-row items-center justify-between text-sm">
                <span
                    className={clsx(
                        "flex flex-row items-center gap-1 px-2 py-1 w-fit select-none font-bold",
                        currentPage <= 1 ? "text-black/20" : "hover:bg-black/10 rounded-lg",
                    )}
                    onClick={() => {
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}>
                    <IconArrowNarrowLeft className={clsx(currentPage <= 1 && "opacity-20")} />
                    Halaman sebelum
                </span>

                <span>Halaman {currentPage} dari {totalPage}</span>

                <span
                    className={clsx(
                        "flex flex-row items-center gap-1 px-2 py-1 w-fit select-none font-bold",
                        currentPage >= totalPage ? "text-black/20" : "hover:bg-black/10 rounded-lg",
                    )}
                    onClick={() => {
                        if (currentPage < totalPage) setCurrentPage(currentPage + 1)
                    }}>
                    Halaman selanjutnya
                    <IconArrowNarrowRight className={clsx(currentPage >= totalPage && "opacity-20")} />
                </span>
            </footer>
        </>
    )
}

export default ProductsView