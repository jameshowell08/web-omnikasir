import AddEditPaymentMethodView from "@/src/modules/(app)/payment-method/add-edit/view/AddEditPaymentMethodView";

async function EditPaymentMethodPage({params}: { params: Promise<{id: string}> }) {
    const { id } = await params
    return <AddEditPaymentMethodView isEdit id={id} />
}

export default EditPaymentMethodPage;