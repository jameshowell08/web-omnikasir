import z from "zod";
import { AddEditSalesItemFormScheme } from "./AddEditSalesItemFormScheme";

export const AddEditSalesFormScheme = z.object({
    customerName: z.string().min(1, "Nama pelanggan tidak boleh kosong"),
    paymentMethod: z.string().min(1, "Metode pembayaran tidak boleh kosong"),
    items: z.array(AddEditSalesItemFormScheme).min(1, "Harus ada minimal 1 item penjualan"),
})

export type AddEditSalesFormSchemeType = z.infer<typeof AddEditSalesFormScheme>;