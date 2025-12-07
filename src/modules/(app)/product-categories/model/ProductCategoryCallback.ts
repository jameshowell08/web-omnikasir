import { Callback } from "@/src/modules/shared/model/Callback";
import ProductCategory from "./ProductCategory";

export class ProductCategoryEventCallback extends Callback {
    constructor() {
        super("product-category")
    }

}

export class UpdateProductCategoryEventCallback extends ProductCategoryEventCallback {
    constructor(
        public categories: ProductCategory[]
    ) { super() }
}

export class ShowHideLoadingOverlay extends ProductCategoryEventCallback {
    constructor(
        public show: boolean
    ) { super() }
}

export class ShowToast extends ProductCategoryEventCallback {
    constructor(
        public message: string,
        public type: "success" | "error"
    ) { super() }
}