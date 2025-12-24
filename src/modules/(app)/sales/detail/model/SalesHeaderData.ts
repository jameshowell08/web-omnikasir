import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import SalesUtil from "../../[shared]/util/SalesUtil";

class SalesHeaderData {

    constructor(
        public transactionId: string,
        private transactionDate: Date,
        public transactionMethod: string,
        private transactionStatus: string,
        public customerName: string,
        public paymentMethod: string,
    ) { }

    public getTransactionDate(): string {
        return BaseUtil.formatDate(this.transactionDate)
    }

    public getTransactionStatus(): string {
        return SalesUtil.mapStatusLabel(this.transactionStatus)
    }
}

export default SalesHeaderData;