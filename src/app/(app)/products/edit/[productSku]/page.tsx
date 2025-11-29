import EditProductView from "@/src/modules/(app)/products/edit/view/EditProductView";

function EditProductPage({params}: {params: {productSku: string}}) {
    return (<EditProductView sku={params.productSku} />)
}

export default EditProductPage;