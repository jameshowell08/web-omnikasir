import { Constants } from "@/src/modules/shared/model/Constants";
import ProductCategory from "../model/ProductCategory";
import { ProductCategoryEventCallback, ShowHideLoadingOverlay, ShowToast, UpdateProductCategoryEventCallback } from "../model/ProductCategoryCallback";

class ProductCategoryController {
    constructor(
        private eventCallback: (e: ProductCategoryEventCallback) => void
    ) { }

    public async getCategories() {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        const res = await fetch(Constants.GET_CATEGORY_API)
        const data = await res.json()
        if (res.ok) {
            this.eventCallback(new UpdateProductCategoryEventCallback(data.data))
        } else {
            this.eventCallback(new ShowToast(data.message, "error"))
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

    public async deleteCategory(sku: string) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        const res = await fetch(Constants.DELETE_CATEGORY_API.replace("[sku]", sku), {
            method: "DELETE"
        })
        const data = await res.json()
        if (res.ok) {
            this.getCategories()
        } else {
            this.eventCallback(new ShowToast(data.message, "error"))
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }
}

export default ProductCategoryController;