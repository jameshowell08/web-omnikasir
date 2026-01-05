import ProductData from "./ProductData";

class ProductsPayload {
    constructor(
        public isSuccess: boolean,
        public products?: ProductData[],
        public totalPages?: number,
        public errorMessage?: string
    ) {}
}

export default ProductsPayload;