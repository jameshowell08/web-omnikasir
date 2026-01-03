'use client';
import { AddEditItemFormSchemeType } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme";
import AddEditItemDialogContent from "@/src/modules/shared/component/add_edit_item_dialog/view/AddEditItemDialogContent";

function AddEditPurchaseItemDialogContent({ onAddPurchaseItem }: { onAddPurchaseItem: (productItem: AddEditItemFormSchemeType) => void }) {
    return (
        <AddEditItemDialogContent
            dialogTitle="Tambah Item"
            dialogDescription="Tambahkan item baru ke dalam pembelian ini."
            onSubmit={onAddPurchaseItem}
        />
    )
}

export default AddEditPurchaseItemDialogContent;