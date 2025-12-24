import Routes from "@/src/modules/shared/model/Routes"
import SalesTableData from "../model/SalesTableData"
import PaymentMethodData from "../model/PaymentMethodData"
import { SalesTableFilterFormSchemeType } from "../model/SalesTableFilterFormScheme"


class GetSalesController {
    private static getTotalPrice(transactionDetails: any[]): number {
        return transactionDetails.reduce((total, detail) => total + detail.price * detail.quantity, 0)
    }

    public static async getSales(page: number, limit: number, searchQuery: string, filterForm: SalesTableFilterFormSchemeType | undefined): Promise<[boolean, SalesTableData[], string, number]> {
        const res = await fetch(
            Routes.TRANSACTION_API.DEFAULT
            + `?page=${page}&limit=${limit}`
            + (searchQuery ? `&search=${searchQuery}` : "")
            + (filterForm?.startDate ? `&startDate=${filterForm.startDate.toISOString()}` : "")
            + (filterForm?.endDate ? `&endDate=${filterForm.endDate.toISOString()}` : "")
            + (filterForm?.transactionMethod ? `&transactionMethod=${filterForm.transactionMethod}` : "")
            + (filterForm?.paymentMethod ? `&paymentId=${filterForm.paymentMethod}` : "")
            + (filterForm?.transactionStatus ? `&status=${filterForm.transactionStatus}` : "")
        )
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
                sale.customer.customerName,
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

    public static mapStatusLabel(status: string) {
        return status === "SUCCESS" ? "Selesai" : status === "IN_PROGRESS" ? "Dalam proses" : status
    }
}

export default GetSalesController;