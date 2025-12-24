class ProductData {
    constructor(
        public sku: string,
        public name: string,
        public brand: string,
        public price: string,
        public isNeedImei: boolean,
    ) {}
}

export default ProductData;