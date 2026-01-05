import ProductData from "./ProductData";

class CartData {
    constructor(
        public product: ProductData,
        public quantity: number,
        public subtotal: number
    ) {}
}

export default CartData;