
class ProductData {
    constructor(
        public sku: string,
        public name: string,
        public price: number,
        public stock: number,
        public brand: string,
        public category: string
    ) {}
}

export default ProductData;