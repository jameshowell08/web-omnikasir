import z from "zod";

export const AddCustomerFormScheme = z.object({
    customerName: z.string().min(1, "Nama pelanggan tidak boleh kosong!"),
    email: z.email({ error: "Format email tidak valid!" }).min(1, "Email tidak boleh kosong!"),
    phoneNumber: z.string().min(1, "Nomor telepon tidak boleh kosong!"),
    address: z.string().min(1, "Alamat tidak boleh kosong!")
})