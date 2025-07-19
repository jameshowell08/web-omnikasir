'use client'
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

function navigateTo(url: String) {
    /* Implement navigation logic here */
}

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-row h-screen w-screen">
            <aside className="w-xs bg-[#D9D9D9] flex flex-col">
                <div className="flex flex-col items-center bg-[#C5C5C5] h-fit w-full p-8">
                    <div className="w-52 aspect-square bg-[#8C8C8C] rounded-full flex items-center justify-center mb-5">
                        <img src="/assets/omnikasir.svg" alt="Profile Picture" className="absolute" />
                    </div>
                    <h1 className="font-bold">[ Username ]</h1>
                    <h3 className="">[ Role ]</h3>
                </div>
                <nav className="flex flex-col">
                    <NavTabComponent name = "Transaksi" url = "" />
                    <NavTabComponent name = "Produk" url = "" />
                    <NavTabComponent name = "Inventaris" url = "" />
                    <NavTabComponent name = "Pelanggan" url = "" />
                    <NavTabComponent name = "Laporan" url = "" />
                    <NavTabComponent name = "Notifikasi" url = "" />
                    <NavTabComponent name = "Pengaturan" url = "" />
                </nav>
                <div className="mt-20 flex justify-center">
                    <button className="select-none cursor-pointer rounded-full px-8 py-4 bg-red-600 font-bold text-white" type="button" onClick={() => {console.log("hi")}}>
                        Logout
                    </button>
                </div>
            </aside>
            {children}
        </div>
    );
}

interface NavTabProps {
    name: String;
    url: String;
}

function NavTabComponent(props: NavTabProps) {
    return (
        <span className="px-8 pt-4 cursor-pointer select-none" onClick={() => navigateTo(props.url)}>
            {props.name}
        </span>
    );

}