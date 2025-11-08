import { Product } from "./Product";

export type ProductsEventCallback = object;

export class UpdateTotalPageAmount implements ProductsEventCallback {
    constructor(
        public newTotalPage: number
    ) { }
}

export class UpdateDisplayedProducts implements ProductsEventCallback {
    constructor(
        public newDisplayedProducts: Product[]
    ) { }
}

export class ShowHideLoadingOverlay implements ProductsEventCallback {
    constructor(
        public showLoadingOverlay: boolean
    ) { }
}

export class ShowErrorToast implements ProductsEventCallback {
    constructor(
        public errorMessage: string
    ) { }
}