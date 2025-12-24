import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

class SalesItemData {
    constructor(
        public id: string,
        public sku: string,
        public productName: string,
        public brand: string,
        private quantity: number,
        private price: number
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