import z from "zod";

export const AddEditCustomerFormScheme = z.object({
    customerId: z.string().optional(),
    customerName: z.string(),
    email: z.email("Format email tidak valid!").optional(),
    phoneNumber: z.string().max(20, "Nomor telepon tidak boleh lebih dari 20 karakter!").optional(),
    address: z.string().optional()
})