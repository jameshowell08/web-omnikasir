import z from "zod";

const IMEIFormScheme = z.object({
    imeiCode: z.string().min(1, "IMEI tidak boleh kosong"),
})