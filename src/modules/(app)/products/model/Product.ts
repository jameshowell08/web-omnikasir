import { ProductApiResponseData } from "./ProductApiResponse";

export class Product {

    constructor(
        public sku: string,
        public name: string,
        public brand: string,
        public category: string,
        public stock: number,
        public price: number,
        public createdBy: string,
        public modifiedBy: string
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
            "",
            data.category?.categoryName ?? "",
            data.stock ?? 0,
            data.priceSell ? Number(data.priceSell) : 0,
            "",
            ""
        );
    }
}