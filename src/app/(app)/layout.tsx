'use client'

import { Constants } from "@/src/modules/shared/model/constants";
import { IconChartBar, IconChevronRight, IconClock, IconHome, IconLayoutDashboard, IconReceiptDollar } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const initialMenus = [
        {
            menuName: "Dashboard",
            menuIcon: IconLayoutDashboard,
            expanded: false,
            menuItems: [
                {
                    menuItemName: "Overview",
                    menuItemIcon: IconHome,
                    menuItemPath: "/settings"
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
        }
    ];

    const [menus, setMenus] = useState(initialMenus);
    const [isNavbarVisible, showNavbar] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen">
            <header className="px-5 py-3 flex items-center border-b">
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
                <span className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none" onClick={() => { router.push(Constants.LOGIN_URL) }}>logout</span>
            </header>

            <section className="flex flex-row flex-1">
                <nav className={`fixed h-full transition ease-in-out duration-200 p-6 w-2xs border-r ${!isNavbarVisible && '-translate-x-full'}`}>
                    {menus.map((menu, index) => (
                        <div key={menu.menuName}>
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

                <div className={`transition-all ease-in-out duration-200 flex justify-center flex-1 ${isNavbarVisible && 'ml-[18rem]'}`}>
                    {children}
                </div>
            </section>
        </div>
    )
}

export default AppLayout