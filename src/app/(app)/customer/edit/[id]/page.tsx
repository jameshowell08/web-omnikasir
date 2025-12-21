import AddEditCustomerView from "@/src/modules/(app)/customer/add-edit/view/AddEditCustomerView";

async function EditCustomerPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    return (<AddEditCustomerView id={id} isEdit={true} />)
}

export default EditCustomerPage;