import ProductDetailForm from "../../view/component/ProductDetailForm";

function EditProductView({ sku }: { sku: string }) {
    return (<ProductDetailForm title="Edit Produk" isEdit sku={decodeURIComponent(sku)} />)
}

export default EditProductView;