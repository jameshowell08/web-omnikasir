'use client';
import TextField from "@/src/modules/shared/view/TextField";
import { IconArrowBackUp, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

function ProductDetailForm(
    {
        title,
        isEdit = false
    }: {
        title: string,
        isEdit?: boolean
    }
) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-between">
                <div className="p-2 w-fit rounded-lg hover:bg-black/10" onClick={() => { router.back() }}>
                    <IconArrowBackUp />
                </div>

                {
                    isEdit &&
                    <div className="p-2 w-fit rounded-lg hover:bg-black/10" onClick={() => { /* TODO: Delete Product */ }}>
                        <IconTrash />
                    </div>
                }
            </div>
            <h1 className="text-2xl font-bold my-6">{title}</h1>

            <form
                className="flex flex-col gap-8 w-md"
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)

                    formData.forEach((value, key) => {
                        console.log(`${key}: ${value}`)
                    })
                }}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-lg">Kode Produk</span>
                        <TextField name="productCode" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg">Nama Produk</span>
                        <TextField name="productCode" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg">Stok</span>
                        <TextField name="productCode" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg">Kategori Produk</span>
                        <TextField name="productCode" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg">Harga Produk</span>
                        <TextField name="productCode" />
                    </div>
                </div>

                <button title="Simpan" type="submit" className="py-3 font-bold text-white bg-black rounded-lg hover:bg-black/85">
                    Simpan
                </button>
            </form>
        </div>
    )
}

export default ProductDetailForm;