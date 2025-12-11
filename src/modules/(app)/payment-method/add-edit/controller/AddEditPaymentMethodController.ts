import Routes from "@/src/modules/shared/model/Routes";
import z from "zod";
import AddEditPaymentMethodFormScheme from "../model/AddEditPaymentMethodFormScheme";

class AddEditPaymentMethodController {
    public static async handleAddPaymentMethod(data: z.infer<typeof AddEditPaymentMethodFormScheme>): Promise<[boolean, string]> {
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

    public static async handleEditPaymentMethod(id: string, data: z.infer<typeof AddEditPaymentMethodFormScheme>): Promise<[boolean, string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.UPDATE(id), {
            method: "PUT",
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

    public static async getPaymentMethodById(id: string): Promise<[Response, string, string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.GET_BY_ID(id))
        const data = await res.json();

        let paymentMethodName = ""
        let errorMsg = ""

        if (res.ok) {
            paymentMethodName = data.data.paymentName
        } else {
            errorMsg = data.message
        }

        return [res, paymentMethodName, errorMsg]
    }
}

export default AddEditPaymentMethodController;