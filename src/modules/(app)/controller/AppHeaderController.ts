
import { IconBuildingStore, IconCashRegister, IconCreditCardPay, IconHome, IconLayoutDashboard, IconPackage, IconPackages, IconReceipt, IconSettings, IconStackPush, IconTags, IconUsers } from "@tabler/icons-react";
import { Constants } from "../../shared/model/Constants";
import { AppHeaderEventCallback, NavigateToUrl } from "../model/AppHeaderEventCallback";
import Routes from "../../shared/model/Routes";
import MenuItem from "../model/MenuItem";
import Menu from "../model/Menu";

export class AppHeaderController {

    public static menus = [
        new Menu(
            "Dashboard",
            IconLayoutDashboard,
            true,
            [
                new MenuItem(
                    "Overview",
                    IconHome,
                    "/overview",
                    ["ADMIN", "CASHIER"]
                )
            ]
        ),
        new Menu(
            "Transaksi",
            IconReceipt,
            true,
            [
                new MenuItem(
                    "Penjualan",
                    IconCashRegister,
                    Routes.SALES.DEFAULT,
                    ["ADMIN", "CASHIER"]
                ),
                new MenuItem(
                    "Pelanggan",
                    IconUsers,
                    Routes.CUSTOMER.DEFAULT,
                    ["ADMIN", "CASHIER"]
                )
            ]
        ),
        new Menu(
            "Inventori",
            IconPackages,
            true,
            [
                new MenuItem(
                    "Produk",
                    IconPackage,
                    Constants.PRODUCTS_URL,
                    ["ADMIN", "CASHIER"]
                ),
                new MenuItem(
                    "Kategori Produk",
                    IconTags,
                    Constants.CATEGORIES_URL,
                    ["ADMIN"]
                ),
                new MenuItem(
                    "Pembelian",
                    IconStackPush,
                    Routes.PURCHASE.GET,
                    ["ADMIN"]
                )
            ]
        ),
        new Menu(
            "Pengaturan",
            IconSettings,
            true,
            [
                new MenuItem(
                    "Profil Toko",
                    IconBuildingStore,
                    "/store-profile",
                    ["ADMIN"]
                ),
                new MenuItem(
                    "Metode Pembayaran",
                    IconCreditCardPay,
                    Routes.PAYMENT_METHOD.GET,
                    ["ADMIN"]
                )
            ]
        )
    ]

    constructor(
        private eventCallback: (e: AppHeaderEventCallback) => void
    ) { }

    public async logout() {
        const res = await fetch(Constants.LOGOUT_API_URL, { method: "POST" })

        if (res.ok) {
            this.eventCallback(new NavigateToUrl(Constants.LOGIN_URL))
        }
    }

}