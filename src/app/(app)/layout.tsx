'use client'

import { AppHeaderController } from "@/src/modules/(app)/controller/AppHeaderController";
import { AppHeaderEventCallback, NavigateToUrl } from "@/src/modules/(app)/model/AppHeaderEventCallback";
import { IconBuildingStore, IconChartBar, IconChevronRight, IconClock, IconCreditCardPay, IconHome, IconLayoutDashboard, IconPackage, IconPackages, IconReceiptDollar, IconSettings, IconStackPush, IconTags, IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    function eventCallback(e: AppHeaderEventCallback) {
        if (e instanceof NavigateToUrl) {
            router.replace(e.url)
        }
    }

    const [controller] = useState(() => new AppHeaderController(eventCallback))
    const initialMenus = [
        {
            menuName: "Dashboard",
            menuIcon: IconLayoutDashboard,
            expanded: false,
            menuItems: [
                {
                    menuItemName: "Overview",
                    menuItemIcon: IconHome,
                    menuItemPath: "/overview"
                },
                {
                    menuItemName: "Laporan",
                    menuItemIcon: IconChartBar,
                    menuItemPath: "/reports"
                }
            ]
        },
        {
            menuName: "Transaksi",
            menuIcon: IconReceiptDollar,
            expanded: false,
            menuItems: [
                {
                    menuItemName: "Penjualan",
                    menuItemIcon: IconHome,
                    menuItemPath: "/sales"
                },
                {
                    menuItemName: "Retur Penjualan",
                    menuItemIcon: IconChartBar,
                    menuItemPath: "/sales-return"
                },
                {
                    menuItemName: "Shift Kasir",
                    menuItemIcon: IconClock,
                    menuItemPath: "/cashier-shift"
                }
            ]
        },
        {
            menuName: "Inventori",
            menuIcon: IconPackages,
            expanded: false,
            menuItems: [
                {
                    menuItemName: "Produk",
                    menuItemIcon: IconPackage,
                    menuItemPath: "/products"
                },
                {
                    menuItemName: "Kategori Produk",
                    menuItemIcon: IconTags,
                    menuItemPath: "/product-categories"
                },
                {
                    menuItemName: "Stok",
                    menuItemIcon: IconStackPush,
                    menuItemPath: "/product-stock"
                }
            ]
        },
        {
            menuName: "Pengaturan",
            menuIcon: IconSettings,
            expanded: false,
            menuItems: [
                {
                    menuItemName: "Profil",
                    menuItemIcon: IconUserCircle,
                    menuItemPath: "/profile"
                },
                {
                    menuItemName: "Profil Toko",
                    menuItemIcon: IconBuildingStore,
                    menuItemPath: "/store-profile"
                },
                {
                    menuItemName: "Metode Pembayaran",
                    menuItemIcon: IconCreditCardPay,
                    menuItemPath: "/payment-method"
                }
            ]
        }
    ];

    const [menus, setMenus] = useState(initialMenus);
    const [isNavbarVisible, showNavbar] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full min-h-screen overflow-x-clip">
            <header className="px-5 py-3 flex items-center border-b z-10 sticky top-0 bg-white">
                <span
                    className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none"
                    onClick={() => showNavbar(!isNavbarVisible)}
                >
                    menu
                </span>
                <h1 className="text-lg font-bold ml-4">Omnikasir</h1>
                <div className="flex flex-col mr-3 flex-1">
                    <p className="text-right text-2xs">Admin</p>
                    <p className="text-right text-xs font-bold">John Doe</p>
                </div>
                <span
                    className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none"
                    onClick={() => controller.logout()}>
                    logout
                </span>
            </header>

            <section className="flex flex-row flex-1">
                <nav className={`fixed h-full transition ease-in-out duration-200 p-6 w-2xs border-r ${!isNavbarVisible && '-translate-x-full'}`}>
                    {menus.map((menu, index) => (
                        <div key={menu.menuName} className="select-none">
                            <div
                                className={`flex flex-row items-center py-1 px-2 rounded-lg hover:bg-black/10 ${index > 0 && "mt-2"}`}
                                onClick={() => {
                                    setMenus(prevMenus => prevMenus.map((m, i) =>
                                        i === index ? { ...m, expanded: !m.expanded } : m
                                    ));
                                }}
                            >
                                {<menu.menuIcon size={18} />}
                                <p className="text-sm pl-2 flex-1">{menu.menuName}</p>
                                <IconChevronRight size={18} className={`${menu.expanded && "rotate-90"}`} />
                            </div>

                            {menu.expanded && menu.menuItems.map((menuItem) => (
                                <Link key={menuItem.menuItemName} className={`mt-1 ml-2 flex flex-row items-center py-1 px-2 rounded-lg hover:bg-black/10 ${pathname === menuItem.menuItemPath && "bg-black/20"}`} href={menuItem.menuItemPath}>
                                    {<menuItem.menuItemIcon size={18} />}
                                    <p className="text-sm pl-2 flex-1">{menuItem.menuItemName}</p>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={`max-w-full transition-all ease-in-out duration-200 flex justify-center flex-1 ${isNavbarVisible && 'ml-[18rem]'}`}>
                    <div className="flex flex-col p-6 max-w-7xl w-full overflow-x-auto">
                        {children}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AppLayout