class PurchaseItemData {
    constructor(
        public sku: string,
        public productName: string,
        public productCategory: string,
        public productBrand: string,
        public buyPrice: number,
        public isNeedImei: boolean
    ) {}
}

export default PurchaseItemData;