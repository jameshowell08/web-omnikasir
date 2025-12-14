import Routes from "@/src/modules/shared/model/Routes";
import PurchaseDetailData from "../model/PurchaseDetailData";
import PurchaseDetailItem from "../model/PurchaseDetailItem";

class GetPurchaseDetailController {

    public static async getPurchaseDetail(id: string): Promise<[boolean, PurchaseDetailData | null, string]> {
        const res = await fetch(Routes.STOCK_API.BY_ID(id), {
            method: "GET",
        })

        const data = await res.json()
        let isSuccess = true
        let purchaseDetail: PurchaseDetailData | null = null
        let errorMessage = ""

        if (res.ok) {
            purchaseDetail = new PurchaseDetailData(
                data.data.id,
                new Date(data.data.createdDate),
                data.data.status,
                data.data.supplier,
                Object.values(data.data.productInventoryDetails.reduce((acc: any, item: any) => {
                    const sku = item.sku;
                    const price = parseFloat(item.price);
                    const quantity = parseInt(item.quantity);
                    const subtotal = price * quantity;
                    const imei = item.imeiCode;

                    if (!acc[sku]) {
                        acc[sku] = new PurchaseDetailItem(
                            sku,
                            item.Product.productName,
                            item.Product.brand,
                            item.Product.category.categoryName,
                            price,
                            0, // Initial quantity
                            imei === null ? null : [], // Initial imeis
                            0 // Initial subtotal
                        );
                    }

                    acc[sku].quantity += quantity;
                    acc[sku].subtotal += subtotal;

                    if (acc[sku].imeis !== null && imei) {
                        acc[sku].imeis.push(imei);
                    }

                    return acc;
                }, {})) as PurchaseDetailItem[],
                parseFloat(data.data.totalPrice)
            )
        } else {
            isSuccess = false
            errorMessage = data.message
        }

        return [isSuccess, purchaseDetail, errorMessage]
    }

}

export default GetPurchaseDetailController;