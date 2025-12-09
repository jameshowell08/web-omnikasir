import z from "zod";
import { AddEditProductCategoryCallback, NavigateTo, ShowErrorToast, ShowHideLoadingOverlay, UpdateCategoryData } from "../model/AddEditProductCategoryCallback";
import AddEditProductCategoryFormScheme from "../model/AddEditProductCategoryFormScheme";
import { Constants } from "@/src/modules/shared/model/Constants";

class AddEditProductCategoryController {
    
    constructor(
        private eventCallback: (event: AddEditProductCategoryCallback) => void
    ) {}

    public async createCategory(data: z.infer<typeof AddEditProductCategoryFormScheme>) {
        this.eventCallback(new ShowHideLoadingOverlay(true));
        const res = await fetch(Constants.CREATE_CATEGORY_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryName: data.categoryName,
                description: data.categoryDescription,
                createdById: "US000"
            }),
        });

        if (res.ok) {
            this.eventCallback(new NavigateTo(Constants.CATEGORIES_URL));
        } else {
            this.eventCallback(new ShowErrorToast("Gagal menambahkan kategori"));
        }
        this.eventCallback(new ShowHideLoadingOverlay(false));
    }

    public async getCategoryData(sku: string) {
        this.eventCallback(new ShowHideLoadingOverlay(true));
        const res = await fetch(`/api/category/${sku}/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            const data = await res.json();
            this.eventCallback(new UpdateCategoryData(data.data.categoryName, data.data.description));
        } else {
            this.eventCallback(new ShowErrorToast("Gagal mengambil data kategori"));
        }
        this.eventCallback(new ShowHideLoadingOverlay(false));
    }

    public async updateCategory(data: z.infer<typeof AddEditProductCategoryFormScheme>, sku: string) {
        this.eventCallback(new ShowHideLoadingOverlay(true));
        const res = await fetch(`/api/category/${sku}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                categoryName: data.categoryName,
                description: data.categoryDescription,
                modifiedById: "US000"
            }),
        });

        if (res.ok) {
            this.eventCallback(new NavigateTo(Constants.CATEGORIES_URL));
        } else {
            this.eventCallback(new ShowErrorToast("Gagal mengupdate kategori"));
        }
        this.eventCallback(new ShowHideLoadingOverlay(false));
    }

}

export default AddEditProductCategoryController;