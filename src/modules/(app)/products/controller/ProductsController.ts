import { Constants } from "@/src/modules/shared/model/constants";
import { Product } from "../model/Product";
import { ProductsEventCallback, ShowErrorToast, ShowHideLoadingOverlay, UpdateDisplayedProducts, UpdateTotalPageAmount } from "../model/ProductsEventCallback";
import { ProductApiResponse } from "../model/ProductApiResponse";

export class ProductsController {

    constructor(
        private eventCallback: (e: ProductsEventCallback) => void
    ) { }

    public async getAllProducts(pageSize: number, pageNumber: number) {
        this.eventCallback(new ShowHideLoadingOverlay(true))

        const params = new URLSearchParams({
            page: pageNumber.toString(),
            limit: pageSize.toString()
        });

        let responseContent = null
        try {
            const res = (await fetch(`${Constants.GET_PRODUCTS_API}?${params.toString()}`))
            if (res.ok) {
                responseContent = await res.json() as ProductApiResponse
            } else {
                responseContent = null
            }
        } catch {
            responseContent = null;
        }

        if (responseContent?.status == true) {
            this.eventCallback(new UpdateTotalPageAmount(responseContent?.totalPages ?? 0))

            const newDisplayedProducts = responseContent?.data?.map((responseData) => Product.fromApiResponse(responseData)) ?? []
            this.eventCallback(new UpdateDisplayedProducts(newDisplayedProducts))
        } else {
            this.eventCallback(new ShowErrorToast(responseContent?.message ?? "Ada yang salah. Coba beberapa saat lagi."))
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

}