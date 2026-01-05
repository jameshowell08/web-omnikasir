import Routes from "@/src/modules/shared/model/Routes";
import ProductsPayload from "../model/ProductsPayload";
import ProductData from "../model/ProductData";
import CartData from "../model/CartData";

class DummyEcommerceController {
    
    public static async getProducts(page: number) {
        const url = new URL(Routes.PRODUCTS_API.DEFAULT, window.location.origin)
        url.searchParams.set("page", page.toString())

        const res = await fetch(url)
        const data = await res.json()

        const payload = new ProductsPayload(res.ok)

        if (res.ok) {
            payload.products = data.data.map((item: any) => new ProductData(item.sku, item.productName, parseFloat(item.sellingPrice), parseFloat(item.quantity), item.brand, item.categoryName))
            payload.totalPages = data.totalPages
        } else {
            payload.errorMessage = data.message
        }

        return payload
    }

    public static async checkout(carts: CartData[]) {
        const res = await fetch(Routes.ECOMMERCE_API.CHECKOUT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event: "ONLINE_ORDER_CREATED",
                data: {
                    externalOrderId: "SHOPEDIA-12345",
                    customer: {
                        name: "Pengguna Shopedia"
                    },
                    items: carts.map((cart) => ({
                        sku: cart.product.sku,
                        qty: cart.quantity
                    }))
                }
            })
        })

        const data = await res.json()

        return res.ok && data.success
    }
}

export default DummyEcommerceController;