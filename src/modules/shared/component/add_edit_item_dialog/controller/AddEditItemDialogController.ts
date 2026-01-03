import Routes from "../../../model/Routes";
import { BaseUtil } from "../../../util/BaseUtil";
import ProductByIdPayload from "../model/ProductByIdPayload";
import ProductData from "../model/ProductData";
import ProductPayload from "../model/ProductPayload";

class AddEditItemDialogController {
    
    public static async getProducts(page: number, searchQuery: string) : Promise<ProductPayload> {
        const url = new URL(Routes.PRODUCTS_API.DEFAULT, window.location.origin)
        url.searchParams.set("limit", "5")
        url.searchParams.set("page", page.toString())
        if (searchQuery.length > 0) url.searchParams.set("search", searchQuery)

        const res = await fetch(url)
        const data = await res.json()
        
        const payload = new ProductPayload(
            res.ok,
            [],
            "",
            0
        )

        if (res.ok) {
            payload.data = data.data.map((item: any) => {
                return new ProductData(
                    item.sku,
                    item.productName,
                    item.quantity
                )
            })
            payload.totalPages = data.totalPages
        } else {
            payload.message = data.message
        }

        return payload
    }

    public static async getProductById(sku: string) : Promise<ProductByIdPayload> {
        const url = new URL(Routes.PRODUCTS_API.GET_BY_ID(sku), window.location.origin)

        const res = await fetch(url)
        const data = await res.json()
        
        const payload = new ProductByIdPayload(
            res.ok,
            {
                sku: "",
                productName: "",
                productBrand: "",
                productCategory: "",
                price: "",
                quantity: "",
                isNeedImei: false,
                imeis: []
            },
            ""
        )

        if (res.ok) {
            payload.data.sku = data.data.sku
            payload.data.productName = data.data.productName
            payload.data.productBrand = data.data.brand
            payload.data.productCategory = data.data.categoryName
            payload.data.price = BaseUtil.formatNumberV2(parseFloat(data.data.buyingPrice)) // todo need to be changed if the page is sales
            payload.data.isNeedImei = data.data.isNeedImei
        } else {
            payload.message = data.message
        }

        return payload
    }

}

export default AddEditItemDialogController;