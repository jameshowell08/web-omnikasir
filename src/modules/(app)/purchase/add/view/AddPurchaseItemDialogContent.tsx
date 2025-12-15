'use client';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AddPurchaseItemDialogForm from "./AddPurchaseItemDialogForm";
import { Button } from "@/components/ui/button";

function AddPurchaseItemDialogContent() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tambah Item</DialogTitle>
                <DialogDescription>
                    Tambahkan item baru ke dalam pembelian ini.
                </DialogDescription>
            </DialogHeader>

            <Separator />

            <AddPurchaseItemDialogForm id="add-purchase-item-form" />

            <DialogFooter>
                <Button type="submit" form="add-purchase-item-form">Tambah Item</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddPurchaseItemDialogContent;