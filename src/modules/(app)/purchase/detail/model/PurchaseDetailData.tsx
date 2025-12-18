import PurchaseDetailItem from "./PurchaseDetailItem";

class PurchaseDetailData {
    constructor(
        public id: string,
        public createdDate: Date,
        public status: string,
        public supplierName: string,
        public items: PurchaseDetailItem[],
        public totalPrice: number
    ) { }
}

export default PurchaseDetailData;