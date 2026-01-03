import { AddEditItemFormSchemeType } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme"
import Routes from "@/src/modules/shared/model/Routes"
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil"
import z from "zod"
import { AddPurchaseFormScheme } from "../model/AddPurchaseFormScheme"

class AddEditPurchaseController {
  public static async getPurchaseById(
    id: string
  ): Promise<
    [boolean, z.infer<typeof AddPurchaseFormScheme> | undefined, string]
  > {
    const res = await fetch(Routes.STOCK_API.BY_ID(id))

    const data = await res.json()
    let addPurchaseFormValue:
      | z.infer<typeof AddPurchaseFormScheme>
      | undefined = undefined
    let errorMessage = ""

    if (res.ok) {
      const content = data.data
      addPurchaseFormValue = {
        supplier: content.supplier,
        status: content.status,
        items: Object.values(
          content.productInventoryDetails.reduce((acc: any, item: any) => {
            const sku = item.sku
            const price = parseFloat(item.price)
            const quantity = parseInt(item.quantity)
            const imei = item.imeiCode

            if (!acc[sku]) {
              acc[sku] = {
                sku,
                productName: item.Product.productName,
                productCategory: item.Product.category.categoryName,
                productBrand: item.Product.brand,
                quantity: 0,
                price,
                isNeedImei: item.Product.isNeedImei,
                imeis: [],
              }
            }

            acc[sku].quantity += quantity

            if (acc[sku].imeis !== null && imei) {
              acc[sku].imeis.push({ value: imei })
            }

            return acc
          }, {})
        ).map((item: any) => ({
          ...item,
          quantity: BaseUtil.formatNumberV2(item.quantity),
          price: BaseUtil.formatNumberV2(item.price),
        })),
      }
    } else {
      errorMessage = data.message ?? "Ada yang salah. Coba lagi."
    }

    return [res.ok, addPurchaseFormValue, errorMessage]
  }

  public static async postPurchase(
    purchase: z.infer<typeof AddPurchaseFormScheme>,
    isEdit: boolean,
    id: string
  ): Promise<[boolean, string]> {
    const requestBodyItems: {
      sku: string
      quantity: number
      price: number
      imeiCode?: string
    }[] = []

    purchase.items.forEach((item) => {
      if (purchase.status === "COMPLETED" && item.isNeedImei && item.imeis.length > 0) {
        item.imeis.forEach((imei) => {
          requestBodyItems.push({
            sku: item.sku,
            quantity: 1,
            price: BaseUtil.unformatNumberV2(item.price),
            imeiCode: imei.value,
          })
        })
      } else {
        requestBodyItems.push({
          sku: item.sku,
          quantity: BaseUtil.unformatNumberV2(item.quantity),
          price: BaseUtil.unformatNumberV2(item.price),
        })
      }
    })

    const requestBody = {
      supplier: purchase.supplier,
      status: purchase.status,
      items: requestBodyItems,
    }

    const res = await fetch(
      isEdit ? Routes.STOCK_API.BY_ID(id) : Routes.STOCK_API.DEFAULT,
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )

    const data = await res.json()
    let errorMessage = ""

    if (!res.ok) {
      errorMessage = data.message ?? "Ada yang salah. Coba lagi."
    }

    return [res.ok, errorMessage]
  }

  private static calculateSubtotal(
    itemPrice: string,
    itemQuantity: string
  ): number {
    const price = BaseUtil.unformatNumberV2(itemPrice)
    const quantity = BaseUtil.unformatNumberV2(itemQuantity)
    return price * quantity
  }

  public static calculateSubtotalToString(
    itemPrice: string,
    itemQuantity: string
  ): string {
    return BaseUtil.formatNumberV2(
      this.calculateSubtotal(itemPrice, itemQuantity)
    )
  }

  public static calculateTotal(
    purchaseItems: AddEditItemFormSchemeType[]
  ): string {
    let total = 0
    purchaseItems.forEach((item) => {
      total += this.calculateSubtotal(item.price, item.quantity)
    })
    return BaseUtil.formatNumberV2(total)
  }

  public static isImeiBadgeError(
    item: AddEditItemFormSchemeType
  ): boolean {
    const quantityInt = BaseUtil.unformatNumberV2(item.quantity)
    return item.isNeedImei && quantityInt !== item.imeis.length
  }
}

export default AddEditPurchaseController
