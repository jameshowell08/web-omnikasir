import z from "zod";

export const AddPurchaseHeaderFormScheme = z.object({
    status: z.string().min(1, "Status is required"),
    supplierName: z.string().min(1, "Supplier name is required"),
})