import EditProductView from "@/src/modules/(app)/products/edit/view/EditProductView";

async function EditProductPage({params}: {params: Promise<{productSku: string}>}) {
    const { productSku } = await params
    return (<EditProductView sku={productSku} />)
}

export default EditProductPage;