import Routes from "@/src/modules/shared/model/Routes";
import AddEditPaymentMethodFormScheme from "../model/AddEditPaymentMethodFormScheme";
import z from "zod";

class AddEditPaymentMethodController {
    public static async handleSubmitForm(data: z.infer<typeof AddEditPaymentMethodFormScheme>): Promise<[boolean, string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.CREATE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        const isSuccess = res.ok;
        let errorMsg = ""

        if (!isSuccess) {
            const data = await res.json();
            errorMsg = data.message;
        }

        return [isSuccess, errorMsg];
    }
}

export default AddEditPaymentMethodController;