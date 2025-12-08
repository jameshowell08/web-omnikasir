import { Callback } from "@/src/modules/shared/model/Callback";
import ProductCategory from "./ProductCategory";

export class ProductCategoryListEventCallback extends Callback {
    constructor() {
        super("product-category")
    }

}

export class UpdateProductCategoryEventCallback extends ProductCategoryListEventCallback {
    constructor(
        public categories: ProductCategory[]
    ) { super() }
}

export class ShowHideLoadingOverlay extends ProductCategoryListEventCallback {
    constructor(
        public show: boolean
    ) { super() }
}

export class ShowToast extends ProductCategoryListEventCallback {
    constructor(
        public message: string,
        public type: "success" | "error"
    ) { super() }
}

export class RefreshProductCategoryList extends ProductCategoryListEventCallback {
    constructor() { super() }
}