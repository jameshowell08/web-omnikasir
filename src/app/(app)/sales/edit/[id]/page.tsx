import AddEditSalesView from "@/src/modules/(app)/sales/add-edit/view/AddEditSalesView";

async function EditSalesPage({ params }: { params: Promise<{ id: string}> }) {
    const { id } = await params;

    return <AddEditSalesView isEdit={true} id={id} />
}

export default EditSalesPage;