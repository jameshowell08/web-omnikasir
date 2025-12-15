class PurchaseItemData {
    constructor(
        public sku: string,
        public productName: string,
        public productCategory: string,
        public productBrand: string,
        public buyPrice: number
    ) {}
}

export default PurchaseItemData;