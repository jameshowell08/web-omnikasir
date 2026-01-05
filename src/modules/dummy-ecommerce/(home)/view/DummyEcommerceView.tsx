'use client'
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import DummyEcommerceController from "../controller/DummyEcommerceController";
import toast from "react-hot-toast";
import ProductData from "../model/ProductData";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { IconMinus, IconPlus, IconShoppingBagPlus, IconTrash } from "@tabler/icons-react";
import CartData from "../model/CartData";
import { Separator } from "@/components/ui/separator";

function CartItem({ cart, onChangeCartAmount }: { cart: CartData, onChangeCartAmount: (cart: CartData, newQuantity: number) => void }) {
    const onAdd = () => {
        const newQuantity = cart.quantity + 1
        if (newQuantity > cart.product.stock) {
            toast.error("Stok tidak mencukupi")
            return
        }
        onChangeCartAmount(cart, newQuantity)
    }

    const onReduce = () => {
        onChangeCartAmount(cart, cart.quantity - 1)
    }
    
    return (
        <div className="flex flex-col border rounded-lg p-3 gap-2">
            <div className="flex flex-row gap-2 justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{cart.product.sku}</span>
                    <span className="font-bold text-lg">{cart.product.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Harga per item</span>
                    <span className="font-bold text-lg">{BaseUtil.formatRupiah(cart.product.price)}</span>
                </div>
            </div>

            <Separator />

            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Subtotal</span>
                    <span className="font-bold text-sm">{BaseUtil.formatRupiah(cart.subtotal)}</span>
                </div>

                <div className="flex flex-row gap-1 items-center">
                    <Button variant={cart.quantity <= 1 ? "destructive" : "outline"} size="icon-sm" onClick={onReduce}>
                        {
                            cart.quantity <= 1 ? (
                                <IconTrash />
                            ) : (
                                <IconMinus />
                            )
                        }
                    </Button>
                    <span className="w-8 text-center">{cart.quantity}</span>
                    <Button variant="outline" size="icon-sm" disabled={cart.quantity >= cart.product.stock} onClick={onAdd}>
                        <IconPlus />
                    </Button>
                </div>
            </div>
        </div>
    )
}

function CartSection({ carts, onChangeCartAmount, onCheckout }: { carts: CartData[], onChangeCartAmount: (cart: CartData, newQuantity: number) => void, onCheckout: () => void }) {    
    return (
        <section className="flex flex-col h-full w-96 overflow-y-auto gap-2">
            <h1 className="text-xl font-bold">Keranjang</h1>
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {carts.map((cart) => (
                    <CartItem key={cart.product.sku} cart={cart} onChangeCartAmount={onChangeCartAmount} />
                ))}
            </div>
            <div className="flex flex-col gap-2 mb-5 border-t-1 pt-3">
                <div className="flex flex-row justify-between">
                    <span className="font-bold">Total</span>
                    <span>{BaseUtil.formatRupiah(carts.reduce((total, cart) => total + cart.subtotal, 0))}</span>
                </div>
                <Button onClick={onCheckout}>Checkout</Button>
            </div>
        </section>
    )
}

function ProductCard({ product, disableAddButton, addToCart }: { product: ProductData, disableAddButton: boolean, addToCart: (product: ProductData) => void }) {
    return (
        <div className="border rounded-lg p-3 flex flex-row justify-between">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">{product.sku}</span>
                <span className="font-bold text-lg">{product.name}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                    <span className="text-end text-xs">Tersedia {BaseUtil.formatNumberV2(product.stock)} item</span>
                    <span className="text-end text-lg font-bold">{BaseUtil.formatRupiah(product.price)}</span>
                </div>
                <Button size="icon" disabled={disableAddButton} onClick={() => addToCart(product)}>
                    <IconShoppingBagPlus />
                </Button>
            </div>
        </div>
    )
}

function ProductList({ products, carts, showLoadMoreButton, loadMore, addToCart }: { products: ProductData[], carts: CartData[], showLoadMoreButton: boolean, loadMore: () => void, addToCart: (product: ProductData) => void }) {
    return (
        <section className="flex-1 flex flex-col gap-2 h-full">
            <h1 className="text-xl font-bold">Produk</h1>
            <div className="flex-1 overflow-y-auto mb-5 flex flex-col gap-2">
                {products.map((product) => (
                    <ProductCard key={product.sku} product={product} disableAddButton={product.stock <= 0 || carts.some((cart) => cart.product.sku === product.sku)} addToCart={addToCart} />
                ))}
                {
                    showLoadMoreButton && (
                        <Button onClick={loadMore}>Muat lebih banyak</Button>
                    )
                }
            </div>
        </section>
    )
}

function DummyEcommerceView() {
    const [carts, setCarts] = useState<CartData[]>([])
    const [products, setProducts] = useState<ProductData[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchProducts = useCallback(async (page: number, initialProducts: ProductData[] = []) => {
        const payload = await DummyEcommerceController.getProducts(page)

        if (payload.isSuccess) {
            setProducts([...initialProducts, ...(payload.products || [])])
            setTotalPages(payload.totalPages || 1)
        } else {
            toast.error(payload.errorMessage || "Terjadi Kesalahan")
        }
    }, [])

    useEffect(() => {
        fetchProducts(1)
    }, [fetchProducts])

    const loadMore = () => {
        setCurrentPage(currentPage + 1)
        fetchProducts(currentPage + 1, products)
    }

    const addToCart = (product: ProductData) => {
        setCarts([...carts, new CartData(product, 1, product.price)])
    }

    const onChangeCartAmount = (cart: CartData, newQuantity: number) => {
        let newCarts

        if (newQuantity <= 0) {
            newCarts = carts.filter((item) => item.product.sku !== cart.product.sku)
        } else {
            newCarts = carts.map((item) => item.product.sku === cart.product.sku ? new CartData(item.product, newQuantity, item.product.price * newQuantity) : item)
        }

        setCarts(newCarts)
    }

    const onCheckout = async () => {
        const payload = await DummyEcommerceController.checkout(carts)

        if (payload) {
            toast.success("Checkout berhasil")
            setCarts([])
            fetchProducts(1)
        } else {
            toast.error("Checkout gagal")
        }
    }

    return (
        <div className="flex flex-row h-full gap-5">
            <ProductList products={products} carts={carts} showLoadMoreButton={currentPage < totalPages} loadMore={loadMore} addToCart={addToCart} />
            <CartSection carts={carts} onChangeCartAmount={onChangeCartAmount} onCheckout={onCheckout} />
        </div>
    )
}

export default DummyEcommerceView;