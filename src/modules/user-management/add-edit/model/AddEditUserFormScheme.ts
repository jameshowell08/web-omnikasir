import z from "zod";

export const getAddEditUserFormScheme = (isEdit: boolean) => z.object({
    username: z.string().min(1, "Username tidak boleh kosong!"),
    password: z.string(),
    confirmPassword: z.string(),
    role: z.enum(["ADMIN", "CASHIER"], { error: "Role tidak boleh kosong!" })
}).superRefine((data, ctx) => {
    if (!isEdit || data.password.length > 0) {
        if (data.password.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password minimal 8 karakter!",
                path: ["password"]
            })
        }

        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Masukkan password yang sama dengan password yang diinputkan sebelumnya pada kolom Password!",
                path: ["confirmPassword"]
            })
        }
    }
})

export type AddEditUserFormSchemeType = z.infer<ReturnType<typeof getAddEditUserFormScheme>>

export const AddEditUserFormSchemeDefaultValues: AddEditUserFormSchemeType = {
    username: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER"
}