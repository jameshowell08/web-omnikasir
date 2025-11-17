import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

function FilterDialog() {
    const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
    const [showBrandDropDown, setShowBrandDropDown] = useState(false);

    return (
        <form className="flex flex-col gap-4" onSubmit={() => {/* TODO: On Apply Filter */ }}>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="category">Kategori</label>
                    <div className="flex flex-row gap-1">
                        <div className="flex flex-col relative">
                            <p className="px-3 py-2 border min-w-50 rounded-lg">Smartphone</p>
                            {
                                showCategoryDropDown &&
                                <div className="absolute flex flex-col top-12 border bg-white w-full rounded-lg">
                                    <span className="px-3 py-2 hover:bg-black/20">hi</span>
                                    <hr />
                                    <span className="px-3 py-2 hover:bg-black/20">hello</span>
                                </div>
                            }
                        </div>
                        <span className="p-2 rounded-lg bg-black hover:bg-black/80 select-none" onClick={() => setShowCategoryDropDown(!showCategoryDropDown)}>
                            <IconChevronDown color="white" className="mt-0.5" />
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="brand">Merek</label>
                    <div className="flex flex-row gap-1">
                        <div className="flex flex-col relative">
                            <p className="px-3 py-2 border min-w-50 rounded-lg">Smartphone</p>
                            {
                                showBrandDropDown &&
                                <div className="absolute flex flex-col top-12 border bg-white w-full rounded-lg">
                                    <span className="px-3 py-2 hover:bg-black/20">hi</span>
                                    <hr />
                                    <span className="px-3 py-2 hover:bg-black/20">hello</span>
                                </div>
                            }
                        </div>
                        <span className="p-2 rounded-lg bg-black hover:bg-black/80 select-none" onClick={() => setShowBrandDropDown(!showBrandDropDown)}>
                            <IconChevronDown color="white" className="mt-0.5" />
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label>Harga</label>
                <div className="flex flex-row items-center gap-2">
                    <input name="minPrice" type="text" placeholder="Harga minimum..." className="px-3 py-2 border rounded-lg flex-1" />
                    <span>-</span>
                    <input name="maxPrice" type="text" placeholder="Harga maksimum..." className="px-3 py-2 border rounded-lg flex-1" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label>Stok</label>
                <div className="flex flex-row items-center gap-2">
                    <input name="minStock" type="text" placeholder="Stok minimum..." className="px-3 py-2 border rounded-lg flex-1" />
                    <span>-</span>
                    <input name="maxStock" type="text" placeholder="Stok maksimum..." className="px-3 py-2 border rounded-lg flex-1" />
                </div>
            </div>

            <div className="flex flex-row self-end gap-5">
                <button type="reset" className="underline">Reset</button>
                <button type="submit" className="px-3 py-2 bg-black rounded-lg text-white hover:bg-black/80">Terapkan</button>
            </div>
        </form>
    )
}

export default FilterDialog;