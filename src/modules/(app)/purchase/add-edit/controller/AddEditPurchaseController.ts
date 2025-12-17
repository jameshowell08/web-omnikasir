import Routes from "@/src/modules/shared/model/Routes";
import PurchaseItemData from "../model/PurchaseItemData";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import z from "zod";
import { AddPurchaseItemFormScheme } from "../model/AddPurchaseItemFormScheme";
import { AddPurchaseFormScheme } from "../model/AddPurchaseFormScheme";

class AddEditPurchaseController {
    public static async getPurchaseById(id: string): Promise<[boolean, z.infer<typeof AddPurchaseFormScheme> | undefined, string]> {
        const res = await fetch(Routes.STOCK_API.BY_ID(id))

        const data = await res.json()
        let addPurchaseFormValue: z.infer<typeof AddPurchaseFormScheme> | undefined = undefined
        let errorMessage = ""

        if (res.ok) {
            const content = data.data
            addPurchaseFormValue = {
                supplier: content.supplier,
                status: content.status,
                items: Object.values(content.productInventoryDetails.reduce((acc: any, item: any) => {
                    const sku = item.sku;
                    const price = parseFloat(item.price);
                    const quantity = parseInt(item.quantity);
                    const imei = item.imeiCode;

                    if (!acc[sku]) {
                        acc[sku] = {
                            sku,
                            productName: item.Product.productName,
                            productCategory: item.Product.category.categoryName,
                            productBrand: item.Product.brand,
                            quantity,
                            price,
                            isNeedImei: item.Product.isNeedImei,
                            imeis: imei ? [imei] : []
                        }
                    }

                    acc[sku].quantity += quantity;

                    if (acc[sku].imeis !== null && imei) {
                        acc[sku].imeis.push(imei);
                    }

                    return acc;
                }, {})).map((item: any) => ({
                    ...item,
                    quantity: BaseUtil.formatNumberV2(item.quantity),
                    price: BaseUtil.formatNumberV2(item.price)
                }))
            }
        } else {
            errorMessage = data.message ?? "Ada yang salah. Coba lagi."
        }

        return [res.ok, addPurchaseFormValue, errorMessage]
    }

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
                content.buyingPrice,
                content.isNeedImei
            )
        } else {
            errorMessage = data.message ?? "Ada yang salah. Coba lagi."
        }

        return [res.ok, purchaseItemData, errorMessage]
    }

    public static async postPurchase(purchase: z.infer<typeof AddPurchaseFormScheme>): Promise<[boolean, string]> {
        const requestBodyItems: { sku: string, quantity: number, price: number, imeiCode?: string }[] = []

        purchase.items.forEach(item => {
            if (item.isNeedImei) {
                item.imeis.forEach(imei => {
                    requestBodyItems.push({
                        sku: item.sku,
                        quantity: 1,
                        price: BaseUtil.unformatNumberV2(item.price),
                        imeiCode: imei.value
                    })
                })
            } else {
                requestBodyItems.push({
                    sku: item.sku,
                    quantity: BaseUtil.unformatNumberV2(item.quantity),
                    price: BaseUtil.unformatNumberV2(item.price)
                })
            }
        })

        const requestBody = {
            supplier: purchase.supplier,
            status: purchase.status,
            items: requestBodyItems
        }

        const res = await fetch(Routes.STOCK_API.DEFAULT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })

        const data = await res.json()
        let errorMessage = ""

        if (!res.ok) {
            errorMessage = data.message ?? "Ada yang salah. Coba lagi."
        }

        return [res.ok, errorMessage]
    }

    private static calculateSubtotal(itemPrice: string, itemQuantity: string): number {
        const price = BaseUtil.unformatNumberV2(itemPrice)
        const quantity = BaseUtil.unformatNumberV2(itemQuantity)
        return price * quantity
    }

    public static calculateSubtotalToString(itemPrice: string, itemQuantity: string): string {
        return BaseUtil.formatNumberV2(this.calculateSubtotal(itemPrice, itemQuantity))
    }

    public static calculateTotal(purchaseItems: z.infer<typeof AddPurchaseItemFormScheme>[]): string {
        let total = 0
        purchaseItems.forEach(item => {
            total += this.calculateSubtotal(item.price, item.quantity)
        })
        return BaseUtil.formatNumberV2(total)
    }

    public static isImeiBadgeError(item: z.infer<typeof AddPurchaseItemFormScheme>): boolean {
        const quantityInt = BaseUtil.unformatNumberV2(item.quantity)
        return item.isNeedImei && quantityInt !== item.imeis.length
    }
}

export default AddEditPurchaseController;