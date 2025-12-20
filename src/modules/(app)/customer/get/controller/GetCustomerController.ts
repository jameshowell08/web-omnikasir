import Routes from "@/src/modules/shared/model/Routes";
import CustomerTableData from "../model/CustomerTableData";

class GetCustomerController {
    public static async getCustomers(searchQuery: string, page: number, limit: number): Promise<[boolean, CustomerTableData[], string, number]> {
        const res = await fetch(Routes.CUSTOMER_API.GET + `?page=${page}&limit=${limit}` + (searchQuery && `&search=${searchQuery}`))
        const data = await res.json()

        let customers: CustomerTableData[] = []
        let errorMessage = ""
        let totalPages = 0

        if (res.ok) {
            customers = data.data.map((customer: any) => (new CustomerTableData(
                customer.customerId,
                customer.customerName,
                customer.customerEmail,
                customer.customerPhoneNumber,
                customer.customerAddress,
                customer.isActive
            )))
            totalPages = data.meta.totalPages
        } else {
            errorMessage = data.message
        }

        return [res.ok, customers, errorMessage, totalPages]
    }
}

export default GetCustomerController;