'use client';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AddEditPurchaseItemDialogForm from "./AddEditPurchaseItemDialogForm";
import { Button } from "@/components/ui/button";
import { AddPurchaseItemFormScheme } from "../model/AddPurchaseItemFormScheme";
import z from "zod";

function EditPurchaseItemDialogContent({ item, onEditPurchaseItem }: { item: z.infer<typeof AddPurchaseItemFormScheme>, onEditPurchaseItem: (item: z.infer<typeof AddPurchaseItemFormScheme>) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ubah Item</DialogTitle>
                <DialogDescription>
                    Ubah item ini.
                </DialogDescription>
            </DialogHeader>

            <Separator />

            <AddEditPurchaseItemDialogForm id="edit-purchase-item-form" onSubmitForm={onEditPurchaseItem} isEdit={true} initialValues={item} />

            <DialogFooter>
                <Button type="submit" form="edit-purchase-item-form">Ubah Item</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default EditPurchaseItemDialogContent;