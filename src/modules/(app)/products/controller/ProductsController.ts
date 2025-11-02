import { Product } from "../model/Product";
import { ProductsEventCallback } from "../model/ProductsEventCallback";

export class ProductsController {

    constructor(
        private eventCallback: (e: ProductsEventCallback) => void
    ) { }

    public getAllProducts(pageSize: number, pageNumber: number): Product[]  {
        return Array.from({length: pageSize}).map((_, index) =>
            new Product(
                "SM-A546E-128G" + (index + (pageSize * (pageNumber - 1))),
                "Samsung Galaxy A54 5G 128GB",
                "Smartphone",
                7,
                5_499_000
            )
        )
    }

    public getMaxPageSize(pageSize: number): number {
        return Math.ceil(100 / pageSize)
    }

}