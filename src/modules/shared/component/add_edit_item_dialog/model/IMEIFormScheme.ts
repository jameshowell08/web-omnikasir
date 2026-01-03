import z from "zod";

export const IMEIFormScheme = z.object({
    value: z.string().min(1, "IMEI tidak boleh kosong."),
})

export type IMEIFormSchemeType = z.infer<typeof IMEIFormScheme>

export const DefaultIMEIFormScheme: IMEIFormSchemeType = {
    value: "",
}