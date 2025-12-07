import { Constants } from "@/src/modules/shared/model/Constants";
import z from "zod";
import { Category } from "../model/Category";
import { NavigateTo, ProductFormEventCallback, ShowErrorToast, ShowHideLoadingOverlay, ShowSuccessfulToast, UpdateCategories, UpdateProductDetail } from "../model/ProductFormEventCallback";
import { ProductFormScheme } from "../model/ProductFormScheme";

export class ProductFormController {

    constructor(
        private eventCallback: (e: ProductFormEventCallback) => void
    ) { }

    private async getCategories() {
        const res = await fetch(Constants.GET_CATEGORY_API)
        const data = await res.json()
        if (res.ok) {
            this.eventCallback(new UpdateCategories(data.data.map((c: any) => new Category(c.categoryId, c.categoryName))))
        } else {
            this.eventCallback(new ShowErrorToast(data.message))
        }
    }

    private async getProductDetail(sku: string) {
        const res = await fetch(Constants.GET_PRODUCT_DETAIL_API + sku)
        const data = await res.json()

        if (res.ok) {
            const productData = data.data
            this.eventCallback(new UpdateProductDetail(
                productData.sku,
                productData.productName,
                productData.brand,
                productData.categoryId,
                productData.sellingPrice,
                productData.buyingPrice,
                productData.quantity,
                productData.isNeedImei,
                productData.imeis
            ))
        } else {
            this.eventCallback(new ShowErrorToast(data.message))
            console.log(res)
        }
    }

    public async initializeForm(sku: string | null) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        await this.getCategories()
        if (sku) {
            await this.getProductDetail(sku)
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

    public async submitForm(data: z.infer<typeof ProductFormScheme>) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        const res = await fetch(Constants.CREATE_PRODUCT_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sku: data.sku,
                productName: data.name,
                brand: data.brand,
                categoryId: data.category,
                quantity: data.stock,
                sellingPrice: data.sellPrice,
                buyingPrice: data.buyPrice,
                isNeedImei: data.needImei,
                imeis: data.imeis.map((imei) => imei.value),
            }),
        })
        this.eventCallback(new ShowHideLoadingOverlay(false))

        if (res.ok) {
            this.eventCallback(new ShowSuccessfulToast("Produk berhasil dibuat!"))
            this.eventCallback(new NavigateTo(Constants.PRODUCTS_URL))
        } else {
            const resVal = await res.json()
            this.eventCallback(new ShowErrorToast(resVal.message))
        }
    }

}