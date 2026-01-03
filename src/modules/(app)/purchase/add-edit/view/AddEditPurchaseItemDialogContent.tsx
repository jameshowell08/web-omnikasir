'use client';
import { AddEditItemFormSchemeType } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme";
import AddEditItemDialogContent from "@/src/modules/shared/component/add_edit_item_dialog/view/AddEditItemDialogContent";

function AddEditPurchaseItemDialogContent({ item, onSubmit }: { item?: AddEditItemFormSchemeType, onSubmit: (productItem: AddEditItemFormSchemeType) => void }) {
    return (
        <AddEditItemDialogContent
            dialogTitle={ item ? "Ubah Item" : "Tambah Item" }
            dialogDescription={ item ? "Ubah item ini" : "Tambahkan item baru ke dalam pembelian ini." }
            item={item}
            onSubmit={onSubmit}
        />
    )
}

export default AddEditPurchaseItemDialogContent;