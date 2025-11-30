import { Callback } from "@/src/modules/shared/model/Callback";
import { Product } from "./Product";
import { Category } from "./Category";

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

export class UpdateCategories extends ProductsEventCallback {
    constructor(
        public newCategories: Category[]
    ) { super() }
}

export class ApplyFilters extends ProductsEventCallback {
    constructor(
        public newFilters: {
            category: string | null,
            minPrice: number | null,
            maxPrice: number | null,
            minStock: number | null,
            maxStock: number | null,
        }
    ) { super() }
}