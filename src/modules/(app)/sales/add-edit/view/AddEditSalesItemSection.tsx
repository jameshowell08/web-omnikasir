'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import { IconDots, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import AddEditSalesController from "../controller/AddEditSalesController";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import AddEditSalesItemDialogContent from "./AddSalesItemDialogContent";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

                <AddEditSalesItemDialogContent onSubmitForm={(item) => {
                    onAddItem(item);
                    setShowDialog(false);
                }} />
            </Dialog>
        </header>
    )
}

function SalesItemRow({ saleItem, onChangeItem, onRemoveItem }: { saleItem: AddEditSalesItemFormSchemeType, onChangeItem: (item: AddEditSalesItemFormSchemeType) => void, onRemoveItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    const [showDialog, setShowDialog] = useState(false);
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
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                                <IconDots />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    <IconEdit />
                                    Edit
                                </DropdownMenuItem>
                            </DialogTrigger>

                            <DropdownMenuItem variant="destructive" onClick={() => onRemoveItem(saleItem)}>
                                <IconTrash />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AddEditSalesItemDialogContent isEdit initialValues={saleItem} onSubmitForm={(data) => {
                        onChangeItem(data);
                        setShowDialog(false);
                    }} />
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

function AddEditSalesItemTable({ salesItems, onChangeItem, onRemoveItem }: { salesItems: AddEditSalesItemFormSchemeType[], onChangeItem: (item: AddEditSalesItemFormSchemeType) => void, onRemoveItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    return (
        <CustomTable headers={["SKU", "Nama Produk", "Merek", "Harga", "Jumlah", "IMEI", "Subtotal"]} haveActions>
            {
                salesItems.length > 0 ? (
                    <>
                        {
                            salesItems.map((item) => (
                                <SalesItemRow key={item.sku} saleItem={item} onChangeItem={onChangeItem} onRemoveItem={onRemoveItem} />
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

function AddEditSalesItemSection({ disableAddItemBtn, salesItems, onAddItem, onChangeItem, onRemoveItem }: { disableAddItemBtn: boolean, salesItems: AddEditSalesItemFormSchemeType[], onAddItem: (item: AddEditSalesItemFormSchemeType) => void, onChangeItem: (item: AddEditSalesItemFormSchemeType) => void, onRemoveItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    return (
        <section className="mt-5">
            <AddEditSalesItemSectionHeader disableAddItemBtn={disableAddItemBtn} onAddItem={onAddItem} />
            <AddEditSalesItemTable salesItems={salesItems} onChangeItem={onChangeItem} onRemoveItem={onRemoveItem} />
        </section>
    )
}

export default AddEditSalesItemSection;