import Routes from "../../../shared/model/Routes";
import UserData from "../model/UserData";
import { UserManagementFilterFormSchemeType } from "../model/UserManagementFilterFormScheme";

class UserManagementController {
    public static async getUsers(currentPage: number, pageLimit: number, search: string, filterData: UserManagementFilterFormSchemeType): Promise<[boolean, UserData[], number, string]> {
        const url = new URL(Routes.USER_API.DEFAULT, window.location.origin)
        url.searchParams.set("isActive", "true")
        url.searchParams.set("page", currentPage.toString())
        url.searchParams.set("limit", pageLimit.toString())
        if (search.length > 0) url.searchParams.set("search", search)
        if (filterData && filterData.role !== "ALL") url.searchParams.set("role", filterData.role ?? "")
        
        const res = await fetch(url, {
            method: "GET"
        })

        const data = await res.json()
        let errorMessage = ""
        let maxPage = 0
        let users: UserData[] = []

        if (res.ok) {
            users = data.data.map((user: any) => new UserData(user.userId, user.username, user.role))
            maxPage = data.meta.totalPages
        } else {
            errorMessage = data.message
        }

        return [res.ok, users, maxPage, errorMessage]
    }
}

export default UserManagementController;