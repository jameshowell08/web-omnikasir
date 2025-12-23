import Routes from "@/src/modules/shared/model/Routes"
import SalesTableData from "../model/SalesTableData"
import PaymentMethodData from "../model/PaymentMethodData"


class GetSalesController {
    private static getTotalPrice(transactionDetails: any[]): number {
        return transactionDetails.reduce((total, detail) => total + detail.price * detail.quantity, 0)
    }

    public static async getSales(page: number, limit: number, searchQuery: string, startDate: Date | undefined, endDate: Date | undefined, transactionMethod: string | undefined, paymentMethod: string | undefined): Promise<[boolean, SalesTableData[], string, number]> {
        const res = await fetch(Routes.TRANSACTION_API.DEFAULT + `?page=${page}&limit=${limit}` + (searchQuery ? `&search=${searchQuery}` : "") + (startDate ? `&startDate=${startDate.toISOString()}` : "") + (endDate ? `&endDate=${endDate.toISOString()}` : "") + (transactionMethod ? `&transactionMethod=${transactionMethod}` : "") + (paymentMethod ? `&paymentId=${paymentMethod}` : ""))
        const data = await res.json()

        let sales: SalesTableData[] = []
        let errorMessage = ""
        let totalPages = 0

        if (res.ok) {
            sales = data.data.map((sale: any) => new SalesTableData(
                sale.transactionHeaderId,
                new Date(sale.transactionDate),
                sale.transactionMethod,
                sale.status,
                sale.paymentMethod.paymentName,
                this.getTotalPrice(sale.transactionDetails)
            ))
            totalPages = data.meta.totalPages
        } else {
            errorMessage = data.message
        }

        return [res.ok, sales, errorMessage, totalPages]
    }

    public static async getPaymentMethods(): Promise<[boolean, PaymentMethodData[], string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.GET + `?usePaging=false`)
        const data = await res.json()

        let paymentMethods: PaymentMethodData[] = []
        let errorMessage = ""

        if (res.ok) {
            paymentMethods = data.data.map((paymentMethod: any) => new PaymentMethodData(
                paymentMethod.paymentId,
                paymentMethod.paymentName
            ))
        } else {
            errorMessage = data.message
        }

        return [res.ok, paymentMethods, errorMessage]
    }
}

export default GetSalesController;