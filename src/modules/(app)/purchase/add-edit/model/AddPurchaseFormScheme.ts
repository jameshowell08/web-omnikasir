import { AddEditItemFormScheme } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import z from "zod";

export const AddPurchaseFormScheme = z.object({
    status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"], {
        error: "Status tidak valid."
    }),
    supplier: z.string().min(1, "Supplier tidak boleh kosong."),
    items: z.array(AddEditItemFormScheme).min(1, "Harus ada minimal 1 item."),
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