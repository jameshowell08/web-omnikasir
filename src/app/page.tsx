'use client';
import Image from "next/image"

function LoginPage() {
    return (
        <div className="flex flex-row w-screen h-screen">
            <div className="border-l-black border-r-1 flex-1 flex-col justify-center items-center hidden lg:flex">
                <Image
                    src="/assets/omnikasir.svg"
                    alt="Logo OmniKasir"
                    width={65}
                    height={108}
                />
                <h1 className="font-bold text-2xl mt-2">
                    OmniKasir
                </h1>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="font-bold text-3xl">Login</h1>

                <form className="mt-6 flex flex-col" onSubmit={(e) => {e.preventDefault()}}>
                    <label className="mb-2" htmlFor="username">Username</label>
                    <input 
                        className="border p-3 rounded-lg w-sm"
                        type="text" 
                        name="username" 
                        placeholder="Ketik disini..." 
                    />

                    <label className="mt-4 mb-2" htmlFor="password">Password</label>
                    <input 
                        className="border p-3 rounded-lg w-sm"
                        type="password" 
                        name="password" 
                        placeholder="Ketik disini..." 
                    />

                    <button className="mt-6 font-bold text-xl bg-black text-white p-3 rounded-lg hover:bg-black/85">Login</button>
                    <p className="mt-3 text-center text-gray-400 text-xs">Powered by OmniKasir⚡</p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage