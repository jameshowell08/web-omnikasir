import z from "zod";
import { Brand } from "../model/Brand";
import { Category } from "../model/Category";
import { ProductFormEventCallback, UpdateBrands, UpdateCategories } from "../model/ProductFormEventCallback";
import { ShowHideLoadingOverlay } from "../model/ProductsEventCallback";
import { ProductFormScheme } from "../model/ProductFormScheme";

export class ProductFormController {
    
    constructor(
        private eventCallback: (e: ProductFormEventCallback) => void
    ) { }

    private getBrand() {
        this.eventCallback(new UpdateBrands([
            new Brand("brand-1", "Samsung"),
            new Brand("brand-2", "Apple"),
            new Brand("brand-3", "Xiaomi"),
            new Brand("brand-4", "Oppo"),
            new Brand("brand-5", "Vivo"),
            new Brand("brand-6", "Realme"),
            new Brand("brand-7", "OnePlus"),
            new Brand("brand-8", "Google"),
            new Brand("brand-9", "Sony"),
            new Brand("brand-10", "LG"),
        ]))
    }

    private getCategories() {
        this.eventCallback(new UpdateCategories([
            new Category("category-1", "Smartphone"),
            new Category("category-2", "Accessories"),
            new Category("category-3", "Laptop"),
            new Category("category-4", "Tablet"),
            new Category("category-5", "Smartwatch"),
            new Category("category-6", "Headphone"),
            new Category("category-7", "Keyboard"),
            new Category("category-8", "Mouse"),
            new Category("category-9", "Monitor"),
            new Category("category-10", "Printer"),
        ]) )
    }

    public initializeForm() {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        this.getBrand()
        this.getCategories()
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

    public submitForm(data: z.infer<typeof ProductFormScheme>) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        console.log(data)
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

}