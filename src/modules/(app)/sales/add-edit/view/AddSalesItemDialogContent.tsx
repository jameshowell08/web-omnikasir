'use client';
import { AddEditItemFormSchemeType } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme";
import AddEditItemDialogContent from "@/src/modules/shared/component/add_edit_item_dialog/view/AddEditItemDialogContent";

function AddEditSalesItemDialogContent({ initialValues, onSubmitForm }: { initialValues?: AddEditItemFormSchemeType, onSubmitForm: (item: AddEditItemFormSchemeType) => void }) {
    return (
        <AddEditItemDialogContent
            dialogTitle={initialValues ? "Ubah Item" : "Tambah Item"}
            dialogDescription={initialValues ? "Ubah item ini" : "Tambahkan item baru ke dalam penjualan ini."}
            item={initialValues}
            mode="SELL"
            onSubmit={onSubmitForm}
        />
    )
}

export default AddEditSalesItemDialogContent;