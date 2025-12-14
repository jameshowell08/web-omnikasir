import z from "zod";

const PurchaseFilterFormScheme = z.object({
    supplier: z.string().optional(),
    status: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional()
}).refine((data) => {
    if (data.dateFrom && data.dateTo) {
        return data.dateFrom <= data.dateTo
    }
    return true
}, {
    message: "Tanggal dari harus lebih awal dari tanggal hingga",
    path: ["dateTo"]
})

export default PurchaseFilterFormScheme;