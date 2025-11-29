import z from "zod";
import { Brand } from "../model/Brand";
import { Category } from "../model/Category";
import { ProductFormEventCallback, ShowErrorToast, UpdateBrands, UpdateCategories } from "../model/ProductFormEventCallback";
import { ShowHideLoadingOverlay } from "../model/ProductsEventCallback";
import { ProductFormScheme } from "../model/ProductFormScheme";
import { Constants } from "@/src/modules/shared/model/Constants";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

export class ProductFormController {

    constructor(
        private eventCallback: (e: ProductFormEventCallback) => void
    ) { }

    private async getBrand() {
        await BaseUtil.delay(1000)
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

    private async getCategories() {
        const res = await fetch(Constants.GET_CATEGORY_API)
        const data = await res.json()
        if (res.ok) {
            this.eventCallback(new UpdateCategories(data.data.map((c: any) => new Category(c.categoryId, c.categoryName))))
        } else {
            this.eventCallback(new ShowErrorToast(data.message))
        }
    }

    public async initializeForm() {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        await this.getBrand()
        await this.getCategories()
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

    public submitForm(data: z.infer<typeof ProductFormScheme>) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        console.log(data)
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

}