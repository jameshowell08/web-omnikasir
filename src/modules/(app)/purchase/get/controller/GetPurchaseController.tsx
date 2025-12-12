import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import PurchaseData from "../model/PurchaseData";

class GetPurchaseController {
    public static async getPurchase(): Promise<PurchaseData[]> {
        await BaseUtil.delay(2000);
        return [
            new PurchaseData(
                "2025-12-12",
                "1",
                "Drafted",
                "Produk 1",
                1,
                10000
            ),
            new PurchaseData(
                "2025-12-12",
                "2",
                "Completed",
                "Produk 2",
                2,
                20000
            ),
            new PurchaseData(
                "2025-12-12",
                "3",
                "Cancelled",
                "Produk 3",
                3,
                30000
            ),
        ];
    }
}

export default GetPurchaseController;