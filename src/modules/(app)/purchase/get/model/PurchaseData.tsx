class PurchaseData {
    constructor(
        public date: Date,
        public id: string,
        public status: string,
        public product: string,
        public quantity: number,
        public total: number,
    ) { }
}

export default PurchaseData;