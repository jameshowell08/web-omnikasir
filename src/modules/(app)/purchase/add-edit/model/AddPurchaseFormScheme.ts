import z from "zod";
import { AddPurchaseItemFormScheme } from "./AddPurchaseItemFormScheme";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

export const AddPurchaseFormScheme = z.object({
    status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"], {
        error: "Status tidak valid."
    }),
    supplier: z.string().min(1, "Supplier tidak boleh kosong."),
    items: z.array(AddPurchaseItemFormScheme).min(1, "Harus ada minimal 1 item."),
}).superRefine((data, ctx) => {
    if (data.status === "COMPLETED") {
        data.items.forEach((item) => {
            if (item.isNeedImei) {
                const quantity = BaseUtil.unformatNumberV2(item.quantity);
                if (item.imeis.length !== quantity) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Item ${item.productName} membutuhkan ${quantity} IMEI, tetapi ${item.imeis.length} dimasukkan.`,
                        path: ["items"],
                    });
                }
            }
        });
    }
})