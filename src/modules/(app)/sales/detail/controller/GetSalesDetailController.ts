import Routes from "@/src/modules/shared/model/Routes";
import SalesData from "../model/SalesData";
import SalesHeaderData from "../model/SalesHeaderData";
import SalesItemData from "../model/SalesItemData";
import StoreData from "../model/StoreData";
import BillItemData from "../model/BillItemData";
import BillData from "../model/BillData";

class GetSalesDetailController {

    private static parseTransactionDetails(transactionDetails: any[]): SalesItemData[] {
        return Object.values(
            transactionDetails.reduce((salesItemDataMap: Record<string, SalesItemData>, transactionDetail: any) => {
                const sku = transactionDetail.sku
                const imeiCode = transactionDetail.imeiCode

                if (!salesItemDataMap[sku]) {
                    salesItemDataMap[sku] = new SalesItemData(
                        transactionDetail.transactionDetailId,
                        sku,
                        transactionDetail.product.productName,
                        transactionDetail.product.brand,
                        0,
                        transactionDetail.price,
                        []
                    )
                }

                salesItemDataMap[sku].quantity += parseFloat(transactionDetail.quantity)
                if (imeiCode) salesItemDataMap[sku].imeis.push(imeiCode)

                return salesItemDataMap
            }, {})
        ) as SalesItemData[]
    }

    public static async getStoreData(): Promise<[boolean, StoreData | undefined, string]> {
        const res = await fetch(Routes.STORE_PROFILE_API.GET, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()
        let errorMessage = ""
        let storeData: StoreData | undefined = undefined

        if (res.ok) {
            storeData = new StoreData(
                data.nama,
                data.alamat,
                data.noHp,
                data.profilePicture
            )
        } else {
            errorMessage = data.message ?? "Gagal mengambil data toko"
        }

        return [res.ok, storeData, errorMessage]
    }

    public static mapToBillData(storeData: StoreData | undefined, salesData: SalesData | undefined): BillData {
        return new BillData(
            storeData?.storeImage ?? "",
            storeData?.storeName ?? "",
            storeData?.storeAddress ?? "",
            storeData?.storePhone ?? "",
            salesData?.headerData?.transactionId ?? "",
            salesData?.headerData?.getTransactionDate() ?? "",
            salesData?.headerData?.paymentMethod ?? "",
            salesData?.itemsData?.map((item) => new BillItemData(
                item?.productName ?? "",
                item?.quantity ?? 0,
                item?.price ?? 0,
                item?.getSubtotal() ?? 0
            )) ?? []
        )
    }

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

            const itemDatas = this.parseTransactionDetails(response.transactionDetails)

            console.log(itemDatas)

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