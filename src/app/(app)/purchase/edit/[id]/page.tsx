import AddEditPurchaseView from "@/src/modules/(app)/purchase/add-edit/view/AddEditPurchaseView";

async function EditPurchasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <AddEditPurchaseView id={id} isEdit />
    )
}

export default EditPurchasePage;