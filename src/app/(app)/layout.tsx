'use client'

import "../globals.css";
import { Constants } from "@/src/lib/constants";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface NavTabProps {
    name: string;
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
    const router = useRouter();

    const logout = async () => {
        const res = await fetch(Constants.LOGOUT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const data = await res.json()

        if (res.ok) {
            toast.success("Logout berhasil!")
            router.push(Constants.LOGIN_URL)
        } else {
            toast.error(data.message)
        }
    }

    return (
        <div className="flex flex-row h-full w-screen">
            <aside className="w-xs h-screen sticky bg-[#D9D9D9] flex flex-col">
                <div className="flex flex-col items-center bg-[#C5C5C5] h-fit w-full p-8">
                    <div className="w-52 aspect-square bg-[#8C8C8C] rounded-full flex items-center justify-center mb-5">
                        <Image src="/assets/omnikasir.svg" alt="Profile Picture" className="absolute" />
                    </div>
                    <h1 className="font-bold">[ Username ]</h1>
                    <h3 className="">[ Role ]</h3>
                </div>
                <nav className="flex flex-col flex-1 mt-4 space-y-2">
                    {
                        navTabs.map((tab) => (
                            <NavTabComponent key={tab.name.valueOf()} name={tab.name} url={tab.url} />
                        ))
                    }
                </nav>
                <div className="flex justify-center m-4">
                    <button className="select-none cursor-pointer rounded-2xl w-full px-8 py-4 bg-red-600 font-bold text-white" type="button" onClick={() => { logout() }}>
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
    const tabSelected = props.url === pathName;

    return (
        <Link href={props.url} className={`
            px-8 py-2 cursor-pointer select-none
            ${tabSelected ? "font-bold bg-black text-white rounded-r-full" : "text-black font-normal bg-transparent"}
        `}>
            {props.name}
        </Link>
    );
}