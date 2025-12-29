import { Constants } from "@/src/modules/shared/model/Constants";
import { Product } from "../model/Product";
import { ApplyFilters, ProductsEventCallback, ShowErrorToast, ShowHideLoadingOverlay, ShowSuccessfulToast, UpdateCategories, UpdateDisplayedProducts, UpdateTotalPageAmount } from "../model/ProductsEventCallback";
import { ProductApiResponse } from "../model/ProductApiResponse";
import { ProductFilterFormScheme } from "../model/ProductFilterFormScheme";
import z from "zod";
import { Category } from "../model/Category";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

export class ProductsController {

    constructor(
        private eventCallback: (e: ProductsEventCallback) => void
    ) { }

    private async getCategories() {
        const res = await fetch(Constants.GET_CATEGORY_API)
        const data = await res.json()
        if (res.ok) {
            this.eventCallback(new UpdateCategories(data.data.map((c: any) => new Category(c.categoryId, c.categoryName))))
        } else {
            this.eventCallback(new ShowErrorToast(data.message))
        }
    }

    public async initialize() {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        this.getCategories()
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }

    public async getProducts(
        pageSize: number,
        pageNumber: number,
        search: string | null,
        categoryId: string | null,
        minPrice: number | null,
        maxPrice: number | null,
        minStock: number | null,
        maxStock: number | null
    ) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        let responseContent = null

        try {
            const searchParams = new URLSearchParams(
                {
                    page: pageNumber.toString(),
                    limit: pageSize.toString(),
                }
            )
            if (search) searchParams.set("search", search)
            if (categoryId) searchParams.set("categoryId", categoryId)
            if (minPrice) searchParams.set("minPrice", minPrice.toString())
            if (maxPrice) searchParams.set("maxPrice", maxPrice.toString())
            if (minStock) searchParams.set("minStock", minStock.toString())
            if (maxStock) searchParams.set("maxStock", maxStock.toString())

            const res = await fetch(`${Constants.GET_PRODUCTS_API}${searchParams ? "?" + searchParams.toString() : ""}`)
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

    public onApplyFilters(data: z.infer<typeof ProductFilterFormScheme>) {
        this.eventCallback(new ApplyFilters(data))
    }

    public async deleteProduct(
        sku: string,
        pageSize: number,
        pageNumber: number,
        search: string | null,
        categoryId: string | null,
        minPrice: number | null,
        maxPrice: number | null,
        minStock: number | null,
        maxStock: number | null
    ) {
        this.eventCallback(new ShowHideLoadingOverlay(true))
        const res = await fetch(BaseUtil.formatString(Constants.DELETE_PRODUCT_API, encodeURIComponent(sku)), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            this.eventCallback(new ShowSuccessfulToast("Produk berhasil dihapus!"))
            await this.getProducts(pageSize, pageNumber, search, categoryId, minPrice, maxPrice, minStock, maxStock)
        } else {
            const resVal = await res.json()
            this.eventCallback(new ShowErrorToast(resVal.message))
        }
        this.eventCallback(new ShowHideLoadingOverlay(false))
    }
}