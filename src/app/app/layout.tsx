'use client'
import { Inter } from "next/font/google";
import "../globals.css";
import { Constants } from "@/src/lib/constants";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

interface NavTabProps {
    name: String;
    url: Url;
}

const navTabs: NavTabProps[] = [
    {
        name: "Transaksi",
        url: Constants.TRANSACTION_URL
    },
    {
        name: "Pengaturan",
        url: Constants.SETTING_URL
    }
]

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-row h-full w-screen">
            <aside className="w-xs h-screen sticky bg-[#D9D9D9] flex flex-col">
                <div className="flex flex-col items-center bg-[#C5C5C5] h-fit w-full p-8">
                    <div className="w-52 aspect-square bg-[#8C8C8C] rounded-full flex items-center justify-center mb-5">
                        <img src="/assets/omnikasir.svg" alt="Profile Picture" className="absolute" />
                    </div>
                    <h1 className="font-bold">[ Username ]</h1>
                    <h3 className="">[ Role ]</h3>
                </div>
                <nav className="flex flex-col flex-1">
                    {
                        navTabs.map((tab) => (
                            <NavTabComponent key={tab.name.valueOf()} name={tab.name} url={tab.url} />
                        ))
                    }
                </nav>
                <div className="flex justify-center m-4">
                    <button className="select-none cursor-pointer rounded-2xl w-full px-8 py-4 bg-red-600 font-bold text-white" type="button" onClick={() => { console.log("hi") }}>
                        Logout
                    </button>
                </div>
            </aside>
            {children}
        </div>
    );
}

function NavTabComponent(props: NavTabProps) {
    const pathName = usePathname();
    let tabSelected = props.url === pathName;

    return (
        <Link href={props.url} className={`
            px-8 py-2 cursor-pointer select-none
            ${tabSelected ? "font-bold bg-black text-white" : "text-black font-normal bg-transparent"}
        `}>
            {props.name}
        </Link>
    );

}