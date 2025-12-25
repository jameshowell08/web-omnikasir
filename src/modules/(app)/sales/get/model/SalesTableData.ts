class SalesTableData {
    constructor(
        public transactionHeaderId: string,
        public transactionDate: Date,
        public transactionMethod: string,
        public status: string,
        public paymentMethod: string,
        public customerName: string,
        public totalAmount: number
    ) {}

}

export default SalesTableData;