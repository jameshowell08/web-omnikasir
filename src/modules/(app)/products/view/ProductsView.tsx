'use client';
import TextField from "@/src/modules/shared/view/TextField"
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react"

function ProductsView() {
    return (
        <div className="w-full p-6">
            <header className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">Produk</h1>
                <span className="flex flex-row gap-1 items-center px-2 py-1 rounded-lg hover:bg-black/10 select-none">
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
                        prefixIcon={<IconSearch />} />
                    <button className="bg-black p-3 rounded-lg hover:bg-black/85" title="filter">
                        <IconFilter color="white" />
                    </button>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <span className="text-xs">Produk per halaman</span>
                    <span className="px-2 py-1 bg-black rounded-lg text-white text-xs select-none hover:bg-black/85">
                        10 item
                    </span>
                    <span className="px-2 py-1 border border-black rounded-lg text-xs select-none hover:bg-black/10">
                        20 item
                    </span>
                    <span className="px-2 py-1 border border-black rounded-lg text-xs select-none hover:bg-black/10">
                        50 item
                    </span>
                </div>
            </section>

            <section className="flex flex-col gap-1">
                <header className="flex flex-row py-2 px-3 bg-black rounded-lg text-white text-sm font-bold mt-2">
                    <span className="flex-1/6">SKU</span>
                    <span className="flex-1/2">Nama Produk</span>
                    <span className="flex-1/6">Kategori</span>
                    <span className="flex-1/6">Harga</span>
                </header>

                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex flex-row py-2 px-3 text-sm hover:bg-black/10 rounded-lg">
                        <span className="flex-1/6">SM-A546E-128G</span>
                        <span className="flex-1/2">Samsung Galaxy A54 5G 128GB</span>
                        <span className="flex-1/6">Smartphone</span>
                        <span className="flex-1/6">Rp5.499.000</span>
                    </div>
                ))}
            </section>

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
        </div>
    )
}

export default ProductsView