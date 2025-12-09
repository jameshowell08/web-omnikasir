import z from "zod";
import { AddEditProductCategoryCallback, NavigateTo, ShowErrorToast } from "../model/AddEditProductCategoryCallback";
import AddEditProductCategoryFormScheme from "../model/AddEditProductCategoryFormScheme";
import { Constants } from "@/src/modules/shared/model/Constants";

class AddEditProductCategoryController {
    
    constructor(
        private eventCallback: (event: AddEditProductCategoryCallback) => void
    ) {}

    public async createCategory(data: z.infer<typeof AddEditProductCategoryFormScheme>) {
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
    }

}

export default AddEditProductCategoryController;