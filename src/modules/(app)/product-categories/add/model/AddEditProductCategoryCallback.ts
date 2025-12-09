import { Callback } from "@/src/modules/shared/model/Callback";

export class AddEditProductCategoryCallback extends Callback {
    constructor() {
        super("add-edit-product-category");
    }
}

export class ShowErrorToast extends AddEditProductCategoryCallback {
    constructor(public message: string) {
        super();
    }
}

export class NavigateTo extends AddEditProductCategoryCallback {
    constructor(public url: string) {
        super();
    }
}