import z from "zod";
import { IMEIFormScheme } from "./IMEIFormScheme";

export const AddEditItemFormScheme = z.object({
    sku: z.string().min(1, "SKU tidak boleh kosong"),
    productName: z.string().min(1, "Nama produk tidak boleh kosong"),
    productCategory: z.string().min(1, "Kategori produk tidak boleh kosong"),
    productBrand: z.string().min(1, "Merek produk tidak boleh kosong"),
    quantity: z.string().min(1, "Jumlah produk tidak boleh kosong"),
    price: z.string().min(1, "Harga produk tidak boleh kosong"),
    isNeedImei: z.boolean(),
    imeis: z.array(IMEIFormScheme),
})

export type AddEditItemFormSchemeType = z.infer<typeof AddEditItemFormScheme>

export const AddEditItemFormSchemeDefaultValues = {
    sku: "",
    productName: "",
    productCategory: "",
    productBrand: "",
    quantity: "",
    price: "",
    isNeedImei: false,
    imeis: []
}