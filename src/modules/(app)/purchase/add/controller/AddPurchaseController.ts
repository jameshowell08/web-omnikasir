import Routes from "@/src/modules/shared/model/Routes";
import PurchaseItemData from "../model/PurchaseItemData";

class AddPurchaseController {
    public static async getPurchaseItemBySku(sku: string): Promise<[boolean, PurchaseItemData | null, string]> {
        const res = await fetch(Routes.PRODUCTS_API.GET_BY_ID(sku))

        const data = await res.json()
        let purchaseItemData: PurchaseItemData | null = null
        let errorMessage = ""
        
        if (res.ok) {
            const content = data.data
            purchaseItemData = new PurchaseItemData(
                content.sku,
                content.productName,
                content.categoryName,
                content.brand,
                content.buyingPrice
            )
        } else {
            errorMessage = data.message
        }

        return [res.ok, purchaseItemData, errorMessage]
    }
}

export default AddPurchaseController;