class PurchaseDetailItem {
    constructor(
        public sku: string,
        public productName: string,
        public brand: string,
        public category: string,
        public price: number,
        public quantity: number,
        public imeis: string[] | null,
        public subtotal: number
    ) { }
}

export default PurchaseDetailItem;