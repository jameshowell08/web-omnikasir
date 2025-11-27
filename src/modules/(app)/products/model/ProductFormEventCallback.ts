import { Callback } from "@/src/modules/shared/model/Callback";
import { Category } from "./Category";
import { Brand } from "./Brand";

export abstract class ProductFormEventCallback extends Callback {
    constructor() { super("product-form") }
}

export class ShowHideLoadingOverlay extends ProductFormEventCallback {
    constructor(
        public show: boolean
    ) { super() }
}

export class UpdateBrands extends ProductFormEventCallback {
    constructor(
        public brands: Brand[]
    ) { super() }
}

export class UpdateCategories extends ProductFormEventCallback {
    constructor(
        public categories: Category[]
    ) { super() }
}