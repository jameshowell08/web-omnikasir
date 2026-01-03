import { AddEditItemFormSchemeType } from "./AddEditItemFormScheme";

class ProductByIdPayload {
    constructor(
        public isSuccess: boolean,
        public data: AddEditItemFormSchemeType,
        public message: string
    ) {}
}

export default ProductByIdPayload