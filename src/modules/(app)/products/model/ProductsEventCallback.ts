import { Product } from "./Product";

export abstract class ProductsEventCallback {
  readonly eventType = "products";
}

export class UpdateTotalPageAmount extends ProductsEventCallback {
    constructor(
        public newTotalPage: number
    ) { super() }
}

export class UpdateDisplayedProducts extends ProductsEventCallback {
    constructor(
        public newDisplayedProducts: Product[]
    ) { super() }
}

export class ShowHideLoadingOverlay extends ProductsEventCallback {
    constructor(
        public showLoadingOverlay: boolean
    ) { super() }
}

export class ShowErrorToast extends ProductsEventCallback {
    constructor(
        public errorMessage: string
    ) { super() }
}