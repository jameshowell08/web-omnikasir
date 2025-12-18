import { ProductApiResponseData } from "./ProductApiResponse";

export class Product {

    constructor(
        public sku: string,
        public name: string,
        public brand: string,
        public category: string,
        public stock: number,
        public price: number
    ) { }

    public formatRupiah(): string {
        return 'Rp' + this.price.toLocaleString('id-ID');
    }

    /**
     * Parse a ProductApiResponseData object into a Product instance
     */
    public static fromApiResponse(data: ProductApiResponseData): Product {
        return new Product(
            data.sku ?? "",
            data.productName ?? "",
            data.brand ?? "",
            data.categoryName ?? "",
            data.quantity ?? 0,
            data.sellingPrice ?? 0
        );
    }
}