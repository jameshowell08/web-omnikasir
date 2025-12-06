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

export class UpdateCategories extends ProductFormEventCallback {
    constructor(
        public categories: Category[]
    ) { super() }
}

export class UpdateProductDetail extends ProductFormEventCallback {
    constructor(
        public sku: string,
        public name: string,
        public brand: string,
        public category: string,
        public sellPrice: number,
        public buyPrice: number,
        public stock: number,
        public needImei: boolean,
        public imeis: string[]
    ) { super() }
}

export class ShowSuccessfulToast extends ProductFormEventCallback {
    constructor(
        public message: string
    ) { super() }
}

export class ShowErrorToast extends ProductFormEventCallback {
    constructor(
        public errorMessage: string
    ) { super() }
}

export class NavigateTo extends ProductFormEventCallback {
    constructor(
        public path: string
    ) { super() }
}