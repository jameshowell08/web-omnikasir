'use client';
import TextField from "@/src/modules/shared/view/TextField"
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react"
import ItemButton from "./component/ItemButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Constants } from "@/src/modules/shared/model/constants";

function ProductsView() {
    const router = useRouter();
    const [selectedAmountOfItem, setSelectedAmountOfItem] = useState(10)

    return (
        <>
            <header className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">Produk</h1>
                <span 
                    className="flex flex-row gap-1 items-center px-2 py-1 rounded-lg hover:bg-black/10 select-none"
                    onClick={() => {router.push(Constants.ADD_PRODUCT_URL)}}>
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
                        onClick={() => {setSelectedAmountOfItem(10)}} />
                    <ItemButton
                        text="20 item"
                        isSelected={selectedAmountOfItem == 20}
                        onClick={() => {setSelectedAmountOfItem(20)}} />
                    <ItemButton
                        text="50 item"
                        isSelected={selectedAmountOfItem == 50}
                        onClick={() => setSelectedAmountOfItem(50)} />
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
                    {Array.from({ length: selectedAmountOfItem }).map((_, i) => (
                        <tr key={i} className="text-sm hover:bg-black/10" onClick={() => { router.push(Constants.EDIT_PRODUCT_URL) }}>
                            <td className="py-2 pl-3 rounded-l-lg">SM-A546E-128G</td>
                            <td className="py-2">Samsung Galaxy A54 5G 128GB</td>
                            <td className="py-2">Smartphone</td>
                            <td className="py-2">7</td>
                            <td className="py-2 pr-3 rounded-r-lg">Rp5.499.000</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="mt-12 flex flex-row items-center justify-between text-sm">
                <span className="flex flex-row items-center gap-1 px-2 py-1 text-black/20 w-fit select-none font-bold">
                    <IconArrowNarrowLeft color="black" className="opacity-20" />
                    Halaman sebelum
                </span>

                <span>Halaman 1 dari 21</span>

                <span className="flex flex-row items-center gap-1 px-2 py-1 w-fit select-none font-bold hover:bg-black/10 rounded-lg">
                    Halaman selanjutnya
                    <IconArrowNarrowRight />
                </span>
            </footer>
        </>
    )
}

export default ProductsView