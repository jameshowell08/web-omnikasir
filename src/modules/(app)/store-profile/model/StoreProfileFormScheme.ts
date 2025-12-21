import z from "zod";

export const StoreProfileFormScheme = z.object({
    storeImage: z.file(),
    storeName: z.string().min(1, "Nama toko tidak boleh kosong."),
    storePhone: z.string().min(1, "Nomor telepon tidak boleh kosong."),
    storeAddress: z.string().min(1, "Alamat tidak boleh kosong."),
})

export type StoreProfileFormSchemeType = z.infer<typeof StoreProfileFormScheme>