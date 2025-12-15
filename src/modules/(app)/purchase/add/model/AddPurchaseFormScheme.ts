import z from "zod";

const PurchaseItemScheme = z.object({
    sku: z.string(),
    productName: z.string(),
    productCategory: z.string(),
    productBrand: z.string(),
    quantity: z.number(),
    price: z.number(),
})

export const AddPurchaseFormScheme = z.object({
    status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"], {
        error: "Status tidak valid."
    }),
    supplier: z.string().min(1, "Supplier tidak boleh kosong."),
    items: z.array(PurchaseItemScheme),
})