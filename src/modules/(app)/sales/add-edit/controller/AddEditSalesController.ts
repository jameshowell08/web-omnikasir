import Routes from "@/src/modules/shared/model/Routes";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { AddEditSalesFormSchemeType } from "../model/AddEditSalesFormScheme";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import CustomerData from "../model/CustomerData";
import PaymentMethodData from "../model/PaymentMethodData";
import ProductData from "../model/ProductData";

class AddEditSalesController {
    public static async postSales(isEdit: boolean, sales: AddEditSalesFormSchemeType): Promise<[boolean, string]> {
        const salesItems: any[] = []

        sales.items.forEach((item) => {
            if (item.isNeedImei) {
                item.imeis.forEach((imei) => {
                    salesItems.push({
                        sku: item.sku,
                        quantity: 1,
                        price: BaseUtil.unformatNumberV2(item.price),
                        imeiCode: imei.value,
                    })
                })
            } else {
                salesItems.push({
                    sku: item.sku,
                    quantity: BaseUtil.unformatNumberV2(item.quantity),
                    price: BaseUtil.unformatNumberV2(item.price),
                })
            }
        })

        const salesData = {
            customerId: sales.customerId,
            paymentId: sales.paymentId,
            items: salesItems
        }

        const res = await fetch(isEdit ? Routes.TRANSACTION_API.BY_ID(sales.transactionId!) : Routes.TRANSACTION_API.DEFAULT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(salesData),
        });

        const data = await res.json();
        let errorMessage = ""

        if (!res.ok) {
            errorMessage = data.message ?? `Gagal ${isEdit ? "memperbarui" : "menambahkan"} penjualan`
        }

        return [res.ok, errorMessage];
    }

    public static async getSales(id: string): Promise<[boolean, AddEditSalesFormSchemeType | undefined, string]> {
        const res = await fetch(Routes.TRANSACTION_API.BY_ID(id), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        let errorMessage = ""
        let sales: AddEditSalesFormSchemeType | undefined = undefined

        if (res.ok) {
            sales = {
                transactionId: data.data.transactionHeaderId,
                transactionDate: new Date(data.data.transactionDate),
                transactionMethod: data.data.transactionMethod,
                transactionStatus: data.data.status,
                customerId: data.data.customerId,
                paymentId: data.data.paymentId,
                items: Object.values(data.data.transactionDetails.reduce((items: Record<string, any>, item: any) => {
                    if (!items[item.sku]) {
                        items[item.sku] = {
                            sku: item.sku,
                            productName: item.product.productName,
                            brand: item.product.brand,
                            quantity: 0,
                            price: parseFloat(item.price),
                            isNeedImei: item.imeiCode !== null,
                            imeis: [],
                            subtotal: 0,
                        };
                    }

                    items[item.sku].quantity += parseFloat(item.quantity);

                    const imeiCode = item.imeiCode;

                    if (imeiCode) {
                        items[item.sku].imeis.push({
                            value: imeiCode
                        })
                    }

                    return items;
                }, {})).map((item: any) => {
                    const subtotal = item.quantity * item.price;
                    item.quantity = BaseUtil.formatNumberV2(item.quantity);
                    item.price = BaseUtil.formatNumberV2(item.price);
                    item.subtotal = BaseUtil.formatNumberV2(subtotal);
                    return item;
                })
            }
        } else {
            errorMessage = data.message ?? "Gagal mengambil data penjualan"
        }

        return [res.ok, sales, errorMessage];
    }

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