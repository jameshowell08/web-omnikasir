import AddEditProductCategoryView from "@/src/modules/(app)/product-categories/add/view/AddEditProductCategoryView";

async function EditProductPage({params}: {params: Promise<{ id: string }>}) {
    const { id } = await params
    return (
        <AddEditProductCategoryView isEdit={true} sku={id} />
    )
}

export default EditProductPage;