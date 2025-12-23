import Routes from "@/src/modules/shared/model/Routes"
import SalesTableData from "../model/SalesTableData"

class GetSalesController {
    private static getTotalPrice(transactionDetails: any[]): number {
        return transactionDetails.reduce((total, detail) => total + detail.price * detail.quantity, 0)
    }

    public static async getSales(page: number, limit: number, searchQuery: string): Promise<[boolean, SalesTableData[], string, number]> {
        const res = await fetch(Routes.TRANSACTION_API.DEFAULT + `?page=${page}&limit=${limit}` + (searchQuery ? `&search=${searchQuery}` : ""))
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
}

export default GetSalesController;