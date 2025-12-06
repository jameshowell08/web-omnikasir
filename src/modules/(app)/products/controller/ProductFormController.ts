import { Constants } from "@/src/modules/shared/model/Constants";
import z from "zod";
import { Category } from "../model/Category";
import { NavigateTo, ProductFormEventCallback, ShowErrorToast, ShowSuccessfulToast, UpdateCategories, UpdateProductDetail } from "../model/ProductFormEventCallback";
import { ProductFormScheme } from "../model/ProductFormScheme";
import { ShowHideLoadingOverlay } from "../model/ProductsEventCallback";
import { URL } from "url";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

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

    // TODO: Request BE to create api for this
    private async getProductDetail(sku: string) {
        BaseUtil.delay(1000)
        this.eventCallback(new UpdateProductDetail(
            sku,
            "Product 1",
            "Brand 1",
            "cat-dummy-001",
            10000,
            5000,
            2,
            true,
            ["01928374392093849320", "01928374392093849321"]
        ))
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
                createdById: "US000", // TODO: Need to be handled by BE (shouldn't be in FE)
                quantity: data.stock,
                sellingPrice: data.sellPrice,
                buyingPrice: data.buyPrice,
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