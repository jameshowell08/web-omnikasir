import Routes from "@/src/modules/shared/model/Routes";
import z from "zod";
import PurchaseData from "../model/PurchaseData";
import { PurchaseFilterFormScheme } from "../model/PurchaseFilterFormScheme";

class GetPurchaseController {
    public static async getPurchases(itemAmount: number, currentPage: number, searchQuery: string, filters: z.infer<typeof PurchaseFilterFormScheme>): Promise<[boolean, number, PurchaseData[], string]> {
        let url = Routes.STOCK_API.DEFAULT + `?limit=${itemAmount}&page=${currentPage}`

        if (searchQuery) {
            url += `&search=${searchQuery}`
        }

        if (filters.supplier) {
            url += `&supplier=${filters.supplier}`
        }

        if (filters.status !== "ALL") {
            url += `&status=${filters.status}`
        }

        if (filters.dateFrom) {
            url += `&startDate=${filters.dateFrom}`
        }

        if (filters.dateTo) {
            url += `&endDate=${filters.dateTo}`
        }

        const res = await fetch(url, {
            method: "GET"
        });

        const data = await res.json();
        let errorMsg = ""
        let totalPage = 0
        let purchaseDatas: PurchaseData[] = []

        if (res.ok) {
            purchaseDatas = data.data.map((purchase: any) => {
                return new PurchaseData(
                    new Date(purchase.createdDate),
                    purchase.id,
                    purchase.status,
                    purchase.supplier,
                    parseFloat(purchase.totalPrice)
                )
            })
            totalPage = data.meta.totalPages
        } else {
            errorMsg = data.error
        }

        return [res.ok, totalPage, purchaseDatas, errorMsg];
    }

    public static async deletePurchase(id: string): Promise<[boolean, string]> {
        const res = await fetch(Routes.STOCK_API.BY_ID(id), {
            method: "DELETE"
        })

        const data = await res.json()

        return [res.ok, data.message]
    }
}

export default GetPurchaseController;