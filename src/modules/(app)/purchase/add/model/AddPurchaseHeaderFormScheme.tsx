import z from "zod";

export const AddPurchaseHeaderFormScheme = z.object({
    status: z.string().min(1, "Status tidak boleh kosong."),
    supplierName: z.string().min(1, "Nama supplier tidak boleh kosong."),
})