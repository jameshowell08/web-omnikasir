class SalesTableData {
    constructor(
        public transactionHeaderId: string,
        public transactionDate: Date,
        public transactionMethod: string,
        public status: string,
        public paymentMethod: string,
        public totalAmount: number
    ) {}

}

export default SalesTableData;