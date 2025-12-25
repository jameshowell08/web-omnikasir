import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import BillItemData from "./BillItemData";

class BillData {
    constructor(
        public storeImage: string,
        public storeName: string,
        public storeAddress: string,
        public storePhone: string,

        public transactionId: string,
        public transactionDate: string,
        public paymentMethod: string,

        public billItemsData: BillItemData[]
    ) { }

    private calculateTotal(): number {
        return this.billItemsData.reduce((total, billItemData) => total + billItemData.subtotal, 0)
    }

    public getTotal(): string {
        return BaseUtil.formatRupiah(this.calculateTotal())
    }
}

export default BillData;