'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import { IconDots, IconPlus } from "@tabler/icons-react";
import AddEditSalesController from "../controller/AddEditSalesController";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import AddSalesItemDialogContent from "./AddSalesItemDialogContent";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import clsx from "clsx";

function AddEditSalesItemSectionHeader({ disableAddItemBtn, onAddItem }: { disableAddItemBtn: boolean, onAddItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <header className="flex flex-row justify-between">
            <h2 className="text-lg font-bold">Item Penjualan</h2>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild disabled={disableAddItemBtn}>
                    <Button size="sm" type="button" disabled={disableAddItemBtn}>
                        <IconPlus />
                        Tambah Item
                    </Button>
                </DialogTrigger>

                <AddSalesItemDialogContent onAddItem={(item) => {
                    onAddItem(item);
                    setShowDialog(false);
                }} />
            </Dialog>
        </header>
    )
}

function SalesItemRow({ saleItem }: { saleItem: AddEditSalesItemFormSchemeType }) {
    const imeiIsInvalid = saleItem.imeis.length < BaseUtil.unformatNumberV2(saleItem.quantity);

    return (
        <TableRow>
            <TableCell>{saleItem.sku}</TableCell>
            <TableCell>{saleItem.productName}</TableCell>
            <TableCell>{saleItem.brand}</TableCell>
            <TableCell>Rp{saleItem.price}</TableCell>
            <TableCell>{saleItem.quantity}</TableCell>
            <TableCell>{saleItem.isNeedImei ? (
                <Badge
                    variant="outline"
                    aria-invalid={imeiIsInvalid}
                    className={imeiIsInvalid ? "text-red-500" : ""}
                >
                    {saleItem.imeis.length}/{saleItem.quantity}
                </Badge>
            ) : "-"}
            </TableCell>
            <TableCell>Rp{AddEditSalesController.calculateSubtotalToString(saleItem)}</TableCell>
            <TableCell>
                <Button variant="ghost" size="icon-sm">
                    <IconDots />
                </Button>
            </TableCell>
        </TableRow>
    )
}

function AddEditSalesItemTable({ salesItems }: { salesItems: AddEditSalesItemFormSchemeType[] }) {
    return (
        <CustomTable headers={["SKU", "Nama Produk", "Merek", "Harga", "Jumlah", "IMEI", "Subtotal"]} haveActions>
            {
                salesItems.length > 0 ? (
                    <>
                        {
                            salesItems.map((item) => (
                                <SalesItemRow key={item.sku} saleItem={item} />
                            ))
                        }
                        <TableRow>
                            <TableCell colSpan={6} className="font-bold">Total</TableCell>
                            <TableCell>Rp{AddEditSalesController.calculateTotalToString(salesItems)}</TableCell>
                            <TableCell />
                        </TableRow>
                    </>
                ) : (
                    <TableRow>
                        <TableCell colSpan={8}>
                            <p className="text-center">Tidak ada item penjualan</p>
                        </TableCell>
                    </TableRow>
                )
            }
        </CustomTable>
    )
}

function AddEditSalesItemSection({ disableAddItemBtn, salesItems, onAddItem }: { disableAddItemBtn: boolean, salesItems: AddEditSalesItemFormSchemeType[], onAddItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    return (
        <section className="mt-5">
            <AddEditSalesItemSectionHeader disableAddItemBtn={disableAddItemBtn} onAddItem={onAddItem} />
            <AddEditSalesItemTable salesItems={salesItems} />
        </section>
    )
}

export default AddEditSalesItemSection;