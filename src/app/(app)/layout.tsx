'use client'

import { useState } from "react";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isNavbarVisible, showNavbar] = useState(true);

    return(
        <div className="flex flex-col h-screen">
            <header className="p-5 flex items-center border-b">
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
                <span className="material-symbols-rounded p-2 hover:bg-black/10 rounded-lg select-none">logout</span>
            </header>

            <section className="flex flex-row flex-1">
                <nav className={`fixed h-full transition ease-in-out duration-200 p-6 w-2xs border-r text-sm ${!isNavbarVisible && '-translate-x-full'}`}>
                    Menu
                </nav>

                <div className={`transition-all ease-in-out duration-200 flex-1 ${isNavbarVisible && 'ml-[18rem]'}`}>
                    {children}
                </div>
            </section>
        </div>
    )
}

export default AppLayout