import AddEditUserView from "@/src/modules/user-management/add-edit/view/AddEditUserView"

async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return <AddEditUserView id={id} isEdit />
}

export default EditUserPage;