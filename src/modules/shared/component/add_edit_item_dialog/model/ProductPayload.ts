import ProductData from "./ProductData";

class ProductPayload {
    constructor(
        public isSuccess: boolean,
        public data: ProductData[],
        public message: string,
        public totalPages: number
    ) {}
}

export default ProductPayload;