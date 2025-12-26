'use client'

import { AppHeaderController } from "@/src/modules/(app)/controller/AppHeaderController";
import { AppHeaderEventCallback, NavigateToUrl } from "@/src/modules/(app)/model/AppHeaderEventCallback";
import Menu from "@/src/modules/(app)/model/Menu";
import { Constants } from "@/src/modules/shared/model/Constants";
import Routes from "@/src/modules/shared/model/Routes";
import { getUser, User } from "@/src/modules/shared/util/user";
import { IconBuildingStore, IconCashRegister, IconChevronRight, IconCreditCardPay, IconHome, IconLayoutDashboard, IconPackage, IconPackages, IconReceipt, IconSettings, IconStackPush, IconTags, IconUser, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const [menus, setMenus] = useState(AppHeaderController.menus);
    const [isNavbarVisible, showNavbar] = useState(true);
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    return (
        <div className="flex flex-col h-full min-h-screen overflow-x-clip">
            <header className="px-5 py-3 flex items-center border-b z-10 sticky top-0 bg-white">
                <span
                    className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none"
                    onClick={() => showNavbar(!isNavbarVisible)}
                >
                    menu
                </span>
                <h1 className="text-lg font-bold ml-4">OmniKasir</h1>
                <div className="flex flex-col mr-3 flex-1">
                    <p className="text-right text-2xs">{user?.role}</p>
                    <p className="text-right text-xs font-bold">{user?.username}</p>
                </div>
                <span
                    className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none"
                    onClick={() => controller.logout()}>
                    logout
                </span>
            </header>

            <section className="flex flex-row flex-1">
                <nav className={`fixed h-full transition ease-in-out duration-200 p-6 w-2xs border-r ${!isNavbarVisible && '-translate-x-full'}`}>
                    {menus.filter(menu => menu.allowedForRole(user?.role)).map((menu, index) => (
                        <div key={menu.menuName} className="select-none">
                            <div
                                className={`flex flex-row items-center py-1 px-2 rounded-lg hover:bg-black/10 ${index > 0 && "mt-2"}`}
                                onClick={() => {
                                    setMenus(prevMenus => prevMenus.map((menu, idx) => {
                                        if (idx === index) {
                                            return new Menu(
                                                menu.menuName,
                                                menu.menuIcon,
                                                !menu.expanded,
                                                menu.menuItems
                                            )
                                        }
                                        return menu
                                    }));
                                }}
                            >
                                {<menu.menuIcon size={18} />}
                                <p className="text-sm pl-2 flex-1">{menu.menuName}</p>
                                <IconChevronRight size={18} className={`${menu.expanded && "rotate-90"}`} />
                            </div>

                            {menu.expanded && menu.menuItems.filter(menuItem => menuItem.allowedForRole(user?.role)).map((menuItem) => (
                                <Link key={menuItem.menuItemName} className={`mt-1 ml-2 flex flex-row items-center py-1 px-2 rounded-lg hover:bg-black/10 ${pathname === menuItem.menuItemPath && "bg-black/20"}`} href={menuItem.menuItemPath}>
                                    {<menuItem.menuItemIcon size={18} />}
                                    <p className="text-sm pl-2 flex-1">{menuItem.menuItemName}</p>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={`max-w-full transition-all ease-in-out duration-200 flex justify-center flex-1 min-w-0 ${isNavbarVisible && 'ml-[18rem]'}`}>
                    <div className="flex flex-col p-6 max-w-7xl w-full overflow-x-auto">
                        {children}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AppLayout