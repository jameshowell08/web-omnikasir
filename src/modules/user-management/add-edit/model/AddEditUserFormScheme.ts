import z from "zod";

export const AddEditUserFormScheme = z.object({
    username: z.string().min(1, "Username tidak boleh kosong!"),
    password: z.string().min(8, "Password minimal 8 karakter!"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter!"),
    role: z.enum(["ADMIN", "CASHIER"], { error: "Role tidak boleh kosong!" })
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Password pada kolom konfirmasi password tidak sama!",
            path: ["confirmPassword"]
        })
    }
})

export type AddEditUserFormSchemeType = z.infer<typeof AddEditUserFormScheme>

export const AddEditUserFormSchemeDefaultValues: AddEditUserFormSchemeType = {
    username: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER"
}