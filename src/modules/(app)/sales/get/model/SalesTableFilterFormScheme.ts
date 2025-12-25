import z from "zod";

export const SalesTableFilterFormScheme = z.object({
    transactionMethod: z.string().optional(),
    transactionStatus: z.string().optional(),
    paymentMethod: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional()
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate
    }
    return true
}, {
    message: "Tanggal dari harus lebih besar dari tanggal sampai.",
    path: ["endDate"]
})

export type SalesTableFilterFormSchemeType = z.infer<typeof SalesTableFilterFormScheme>

export const SalesTableFilterFormSchemeDefaultValues: SalesTableFilterFormSchemeType = {
    transactionMethod: "",
    transactionStatus: "",
    paymentMethod: "",
    startDate: undefined,
    endDate: undefined
}