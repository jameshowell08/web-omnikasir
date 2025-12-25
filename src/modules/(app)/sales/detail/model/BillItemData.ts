import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

class BillItemData {
    constructor(
        public productName: string,
        public quantity: number,
        public price: number,
        public subtotal: number
    ) { }

    public getQuantity(): string {
        return BaseUtil.formatNumberV2(this.quantity)
    }

    public getPrice(): string {
        return BaseUtil.formatRupiah(this.price)
    }

    public getSubtotal(): string {
        return BaseUtil.formatRupiah(this.subtotal)
    }
}

export default BillItemData;