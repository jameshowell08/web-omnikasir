import { Constants } from "@/src/modules/shared/model/Constants";
import { ProductCategoryListEventCallback, RefreshProductCategoryList, ShowHideLoadingOverlay, ShowToast, UpdateProductCategoryEventCallback } from "../model/ProductCategoryListEventCallback";

class ProductCategoryListController {
    constructor(
        private eventCallback: (e: ProductCategoryListEventCallback) => void
    ) { }

    public async getCategories(searchQuery?: string) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        const res = await fetch(Constants.GET_CATEGORY_API + (searchQuery ? `?search=${searchQuery}` : ""))
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
            this.eventCallback(new RefreshProductCategoryList())
        } else {
            this.eventCallback(new ShowToast(data.message, "error"))
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }
}

export default ProductCategoryListController;