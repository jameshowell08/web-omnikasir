import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

class SalesItemData {
    constructor(
        public id: string,
        public sku: string,
        public productName: string,
        public brand: string,
        public quantity: number,
        public price: number,
        public imeis: string[]
    ) { }

    public getQuantity(): string {
        return BaseUtil.formatNumberV2(this.quantity)
    }

    public getPrice(): string {
        return BaseUtil.formatRupiah(this.price)
    }

    public getSubtotalInString(): string {
        return BaseUtil.formatRupiah(this.quantity * this.price)
    }

    public getSubtotal(): number {
        return this.quantity * this.price
    }
}

export default SalesItemData;