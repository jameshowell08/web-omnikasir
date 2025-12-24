import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

class SalesHeaderData {

    constructor(
        public transactionId: string,
        private transactionDate: Date,
        public transactionStatus: string,
        public customerName: string,
        public paymentMethod: string,
    ) { }

    public getTransactionDate(): string {
        return BaseUtil.formatDate(this.transactionDate)
    }

}

export default SalesHeaderData;