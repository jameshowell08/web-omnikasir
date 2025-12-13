import Routes from "@/src/modules/shared/model/Routes";
import PurchaseData from "../model/PurchaseData";

class GetPurchaseController {
    public static async getPurchases(itemAmount: number, currentPage: number): Promise<[boolean, number, PurchaseData[], string]> {
        const res = await fetch(Routes.STOCK_API.DEFAULT + `?limit=${itemAmount}&page=${currentPage}`, {
            method: "GET"
        });

        const data = await res.json();
        let errorMsg = ""
        let totalPage = 0
        let purchaseDatas: PurchaseData[] = []

        if (res.ok) {
            purchaseDatas = data.data.map((purchase: any) => {
                return new PurchaseData(
                    new Date(purchase.createdDate),
                    purchase.id,
                    purchase.status,
                    purchase.productInventoryDetails[0].Product.productName,
                    purchase.totalQuantity,
                    purchase.totalPrice
                )
            })
            totalPage = data.meta.totalPages
        } else {
            errorMsg = data.error
        }

        return [res.ok, totalPage, purchaseDatas, errorMsg];
    }
}

export default GetPurchaseController;