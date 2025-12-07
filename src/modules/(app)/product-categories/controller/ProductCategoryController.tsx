import ProductCategoryEventCallback from "../model/ProductCategoryCallback";

class ProductCategoryController {
    constructor(
        private eventCallback: (e: ProductCategoryEventCallback) => void
    ){}
}

export default ProductCategoryController;