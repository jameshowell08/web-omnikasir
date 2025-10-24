'use client'

import { Constants } from "@/src/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter();

    const [isNavbarVisible, showNavbar] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState('settings');

    return(
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
                <span className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none" onClick={() => {router.push(Constants.LOGIN_URL)}}>logout</span>
            </header>

            <section className="flex flex-row flex-1">
                <nav className={`fixed h-full transition ease-in-out duration-200 p-6 w-2xs border-r ${!isNavbarVisible && '-translate-x-full'}`}>
                    <h5 className="text-sm">Menu</h5>
                    <span className={`flex items-center mt-3 px-3 py-2 rounded-lg select-none ${selectedMenu == 'settings' ? 'bg-black hover:bg-black/80' : "hover:bg-black/10"}`} onClick={() => {setSelectedMenu(selectedMenu == 'settings' ? '' : 'settings')}}>
                        <span className={`material-symbols-rounded rounded-lg select-none pr-2 ${selectedMenu == 'settings' && 'filled text-white'}`}>settings</span>
                        <span className={`text-sm ${selectedMenu == 'settings' && 'font-bold text-white'}`}>Pengaturan</span>
                    </span>
                </nav>

                <div className={`transition-all ease-in-out duration-200 flex justify-center flex-1 ${isNavbarVisible && 'ml-[18rem]'}`}>
                    {children}
                </div>
            </section>
        </div>
    )
}

export default AppLayout