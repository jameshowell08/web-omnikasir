import z from "zod"

const IMEI = z.object({
    imei: z.string()
})

export const ProductFormScheme = z.object({
    sku: z.string().min(1, "SKU tidak boleh kosong."),
    name: z.string().min(1, "Nama produk tidak boleh kosong."),
    brand: z.string().min(1, "Merek produk tidak boleh kosong."),
    category: z.string().min(1, "Kategori produk tidak boleh kosong."),
    sellPrice: z.string()
        .transform((val) => Number(val.replace(/\./g, "")))
        .pipe(z.number().min(1, "Harga jual tidak boleh kosong.")),
    buyPrice: z.string()
        .transform((val) => Number(val.replace(/\./g, ""))),
    stock: z.string()
        .transform((val) => Number(val.replace(/\./g, ""))),
    needImei: z.boolean(),
    imeis: z.array(IMEI),
}).refine((data) => (!data.needImei || data.imeis.length === data.stock), {
    message: "Jumlah IMEI harus sama dengan jumlah stok.",
    path: ["imeis"],
})