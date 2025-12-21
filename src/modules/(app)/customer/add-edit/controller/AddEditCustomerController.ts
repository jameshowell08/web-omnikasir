import z from "zod";
import { AddEditCustomerFormScheme } from "../model/AddEditCustomerFormScheme";
import Routes from "@/src/modules/shared/model/Routes";

class AddEditCustomerController {
    
    public static async addCustomer(customer: z.infer<typeof AddEditCustomerFormScheme>): Promise<[boolean, string]> {
        const res = await fetch(Routes.CUSTOMER_API.DEFAULT, {
            method: "POST",
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

        return [ res.ok, errorMessage ]
    }

}

export default AddEditCustomerController;