import { Callback } from "@/src/modules/shared/model/Callback";
import { Product } from "./Product";

export abstract class ProductsEventCallback extends Callback {
  constructor() { super("products") }
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