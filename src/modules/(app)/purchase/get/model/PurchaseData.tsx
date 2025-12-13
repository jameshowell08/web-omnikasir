class PurchaseData {
    constructor(
        public date: Date,
        public id: string,
        public status: string,
        public total: number,
    ) { }
}

export default PurchaseData;