import Routes from "@/src/modules/shared/model/Routes";
import CustomerData from "../model/CustomerData";
import PaymentMethodData from "../model/PaymentMethodData";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import ProductData from "../model/ProductData";

class AddEditSalesController {
    public static async getProduct(sku: string): Promise<[boolean, ProductData | undefined, string]> {
        const res = await fetch(Routes.PRODUCTS_API.GET_BY_ID(sku), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        let errorMessage = ""
        let product: ProductData | undefined = undefined

        if (res.ok) {
            product = new ProductData(
                data.data.sku,
                data.data.productName,
                data.data.brand,
                BaseUtil.formatNumberV2(data.data.buyingPrice),
                data.data.isNeedImei
            )
        } else {
            errorMessage = data.message ?? "Gagal mengambil data produk"
        }

        return [res.ok, product, errorMessage];
    }

    public static async getCustomer(): Promise<[boolean, CustomerData[], string]> {
        const res = await fetch(Routes.CUSTOMER_API.DEFAULT + "?limit=0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        let errorMessage = ""
        let customers: CustomerData[] = []

        if (res.ok) {
            customers = data.data.map((customer: any) => new CustomerData(customer.customerId, customer.customerName))
        } else {
            errorMessage = data.message
        }

        return [res.ok, customers, errorMessage];
    }

    public static async getPaymentMethod(): Promise<[boolean, PaymentMethodData[], string]> {
        const res = await fetch(Routes.PAYMENT_METHOD_API.GET + "?usePaging=false", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        let errorMessage = "";
        let paymentMethods: PaymentMethodData[] = [];

        if (res.ok) {
            paymentMethods = data.data.map((paymentMethod: any) => new PaymentMethodData(paymentMethod.paymentId, paymentMethod.paymentName))
        } else {
            errorMessage = data.message
        }

        return [res.ok, paymentMethods, errorMessage];
    }

    public static calculateSubtotal(item: AddEditSalesItemFormSchemeType): number {
        return BaseUtil.unformatNumberV2(item.price) * BaseUtil.unformatNumberV2(item.quantity);
    }

    public static calculateSubtotalToString(item: AddEditSalesItemFormSchemeType): string {
        return BaseUtil.formatNumberV2(this.calculateSubtotal(item));
    }

    public static calculateTotal(items: AddEditSalesItemFormSchemeType[]): number {
        return items.reduce((acc, item) => acc + BaseUtil.unformatNumberV2(item.subtotal), 0);
    }

    public static calculateTotalToString(items: AddEditSalesItemFormSchemeType[]): string {
        return BaseUtil.formatNumberV2(this.calculateTotal(items));
    }
}

export default AddEditSalesController;