import Routes from "@/src/modules/shared/model/Routes";
import PaymentMethod from "../model/PaymentMethod";

class GetPaymentMethodController {
    public static async getPaymentMethods(page: number, limit: number, searchQuery: string): Promise<[Response, PaymentMethod[], string, number]> {
        const res = await fetch(`${Routes.PAYMENT_METHOD_API.GET}?page=${page}&limit=${limit}&search=${searchQuery}`);
        const data = await res.json();

        let paymentMethods: PaymentMethod[] = [];
        let errorMessage = "";
        let totalPages = 0;

        if (res.ok) {
            data.data.map((pm: any) => {
                paymentMethods.push({
                    id: pm.paymentId,
                    name: pm.paymentName,
                });
            });
            totalPages = data.totalPages;
        } else {
            errorMessage = data.message;
        }

        return [res, paymentMethods, errorMessage, totalPages];
    }

    public static async deletePaymentMethod(id: string): Promise<[Response, string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.DELETE(id), {
            method: "DELETE",
        })

        let errorMsg = "";

        if (!res.ok) {
            const data = await res.json();
            errorMsg = data.message
        }

        return [res, errorMsg]
    }
}

export default GetPaymentMethodController;