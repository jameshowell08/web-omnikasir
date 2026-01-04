import z from "zod";

export const UserManagementFilterFormScheme = z.object({
    role: z.string().optional(),
})

export type UserManagementFilterFormSchemeType = z.infer<typeof UserManagementFilterFormScheme>

export const UserManagementFilterFormSchemeDefaultValues: UserManagementFilterFormSchemeType = {
    role: "ALL"
}