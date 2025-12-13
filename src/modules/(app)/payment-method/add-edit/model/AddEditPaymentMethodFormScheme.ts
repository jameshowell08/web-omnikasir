import z from "zod";

const AddEditPaymentMethodFormScheme = z.object({
    paymentName: z.string().min(1, "Nama metode pembayaran tidak boleh kosong"),
})

export default AddEditPaymentMethodFormScheme;