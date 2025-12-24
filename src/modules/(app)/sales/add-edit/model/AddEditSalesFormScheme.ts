import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import z from "zod";
import { AddEditSalesItemFormScheme } from "./AddEditSalesItemFormScheme";

export const AddEditSalesFormScheme = z.object({
    customerId: z.string().min(1, "Nama pelanggan tidak boleh kosong"),
    paymentId: z.string().min(1, "Metode pembayaran tidak boleh kosong"),
    items: z.array(AddEditSalesItemFormScheme).min(1, "Harus ada minimal 1 item penjualan"),
}).superRefine((data, ctx) => {
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        if (item.isNeedImei && BaseUtil.unformatNumberV2(item.quantity) !== item.imeis.length) {
            ctx.addIssue({
                code: "custom",
                message: "Jumlah IMEI tidak sesuai dengan jumlah item",
                path: ["items"]
            })
            break;
        }
    }
})

export type AddEditSalesFormSchemeType = z.infer<typeof AddEditSalesFormScheme>;