import Routes from "@/src/modules/shared/model/Routes";
import SalesData from "../model/SalesData";
import SalesHeaderData from "../model/SalesHeaderData";
import SalesItemData from "../model/SalesItemData";

class GetSalesDetailController {

    public static async getSalesDetail(id: string): Promise<[boolean, SalesData | undefined, string]> {
        const res = await fetch(Routes.TRANSACTION_API.BY_ID(id), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()
        let errorMessage = ""
        let salesData: SalesData | undefined = undefined

        if (res.ok) {
            const response = data.data

            const headerData = new SalesHeaderData(
                response.transactionHeaderId,
                new Date(response.transactionDate),
                response.transactionMethod,
                response.status,
                response.customer.customerName,
                response.paymentMethod.paymentName
            )

            const itemDatas = response.transactionDetails.map((transactionDetail: any) => new SalesItemData(
                transactionDetail.transactionDetailId,
                transactionDetail.sku,
                transactionDetail.product.productName,
                transactionDetail.product.brand,
                parseFloat(transactionDetail.quantity),
                parseFloat(transactionDetail.price)
            ))

            salesData = new SalesData(headerData, itemDatas)
        } else {
            errorMessage = data.message ?? "Gagal mengambil data penjualan"
        }

        return [res.ok, salesData, errorMessage]
    }


    public static getTotalSales(salesItemData: SalesItemData[]): number {
        return salesItemData.reduce((total, item) => total + item.getSubtotal(), 0)
    }
}

export default GetSalesDetailController;