import z from "zod";
import { AddPurchaseItemFormScheme } from "./AddPurchaseItemFormScheme";

export const AddPurchaseFormScheme = z.object({
    status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"], {
        error: "Status tidak valid."
    }),
    supplier: z.string().min(1, "Supplier tidak boleh kosong."),
    items: z.array(AddPurchaseItemFormScheme),
})