import Routes from "@/src/modules/shared/model/Routes";
import z from "zod";
import { AddEditCustomerFormScheme } from "../model/AddEditCustomerFormScheme";

class AddEditCustomerController {

    public static async addEditCustomer(customer: z.infer<typeof AddEditCustomerFormScheme>, isEdit: boolean): Promise<[boolean, string]> {
        const res = await fetch(isEdit ? Routes.CUSTOMER_API.BY_ID(customer.customerId!) : Routes.CUSTOMER_API.DEFAULT, {
            method: isEdit ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customerName: customer.customerName,
                customerEmail: customer.email,
                customerPhoneNumber: customer.phoneNumber,
                customerAddress: customer.address
            })
        })

        const data = await res.json()
        let errorMessage = ""

        if (!res.ok) {
            errorMessage = data.message
        }

        return [res.ok, errorMessage]
    }

    public static async getCustomerById(id: string): Promise<[boolean, z.infer<typeof AddEditCustomerFormScheme> | undefined, string]> {
        const res = await fetch(`${Routes.CUSTOMER_API.DEFAULT}/${id}`)
        const data = await res.json()
        let content: z.infer<typeof AddEditCustomerFormScheme> | undefined = undefined
        let errorMessage = ""

        if (res.ok) {
            content = {
                customerId: data.data.customerId,
                customerName: data.data.customerName,
                email: data.data.customerEmail,
                phoneNumber: data.data.customerPhoneNumber,
                address: data.data.customerAddress
            }
        } else {
            errorMessage = data.message
        }

        return [res.ok, content, errorMessage]
    }

}

export default AddEditCustomerController;