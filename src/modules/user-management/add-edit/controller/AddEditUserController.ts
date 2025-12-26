import Routes from "@/src/modules/shared/model/Routes"
import { AddEditUserFormSchemeType } from "../model/AddEditUserFormScheme"

class AddEditUserController {
    public static async postSubmit(isEdit: boolean, id: string, formValue: AddEditUserFormSchemeType): Promise<[boolean, string]> {
        const res = await fetch(isEdit ? Routes.USER_API.BY_ID(id) : Routes.USER_API.DEFAULT, {
            method: isEdit ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: formValue.role,
                username: formValue.username,
                password: formValue.password,
            })
        })

        const data = await res.json()
        let errorMessage = ""

        if (!res.ok) {
            errorMessage = data.message
        }

        return [res.ok, errorMessage]
    }

    public static async getUser(id: string): Promise<[boolean, AddEditUserFormSchemeType | undefined, string]> {
        const res = await fetch(Routes.USER_API.BY_ID(id))

        const data = await res.json()
        let errorMessage = ""
        let user: AddEditUserFormSchemeType | undefined = undefined

        if (res.ok) {
            user = {
                role: data.data.role,
                username: data.data.username,
                password: "",
                confirmPassword: ""
            }
        } else {
            errorMessage = data.message
        }

        return [res.ok, user, errorMessage]
    }
}

export default AddEditUserController;