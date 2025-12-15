import z from "zod";

export const AddPurchaseItemFormScheme = z.object({
    sku: z.string().min(1, "SKU tidak boleh kosong."),
    productName: z.string(),
    productCategory: z.string(),
    productBrand: z.string(),
    quantity: z.string().min(1, "Jumlah tidak boleh kosong."),
    price: z.string().min(1, "Harga tidak boleh kosong."),
})