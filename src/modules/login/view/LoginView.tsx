'use client'
import Image from "next/image";
import { useState } from "react";
import TextField from "../../components/TextField";
import { LoginController } from "../controller/LoginController";
import { LoginEventCallback, NavigateToHomePage, ShowErrorOnField } from "../model/LoginEventCallback";
import { useRouter } from "next/navigation";
import { Constants } from "@/src/lib/constants";

function LoginView() {
    const router = useRouter()
    const [errorOnUsername, setErrorOnUsername] = useState("")
    const [errorOnPassword, setErrorOnPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    function listener(eventCallback: LoginEventCallback) {
        if (eventCallback instanceof NavigateToHomePage) {
            router.push(Constants.SETTING_URL)
        } else if (eventCallback instanceof ShowErrorOnField) {
            if (eventCallback.fieldName === "username") {
                setErrorOnUsername(eventCallback.error)
            } else if (eventCallback.fieldName === "password") {
                setErrorOnPassword(eventCallback.error)
            }
        }
    }

    const [controller] = useState(() => {
        console.log("LoginController created!")
        return new LoginController(listener)
    })

    return (
        <div className="flex flex-row w-screen h-screen">
            <div className="border-l-black border-r-1 flex-1 flex-col justify-center items-center hidden lg:flex">
                <Image
                    src="/assets/omnikasir.svg"
                    alt="Logo Omnikasir"
                    width={65}
                    height={108}
                />
                <h1 className="font-bold text-2xl mt-5">
                    Omnikasir
                </h1>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-10">
                <h1 className="font-bold text-3xl">Login</h1>

                <form
                    className="mt-6 flex flex-col w-full max-w-sm"
                    onSubmit={(e) => {
                        e.preventDefault()
                        controller.login(new FormData(e.currentTarget))
                    }}>
                    <label className="mb-2" htmlFor="username">Username</label>
                    <TextField
                        name="username"
                        error={errorOnUsername}
                        showError={errorOnUsername.length > 0}
                    />

                    <label className="mt-4 mb-2" htmlFor="password">Password</label>
                    <TextField
                        name="password"
                        type="password"
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        error={errorOnPassword}
                        showError={errorOnPassword.length > 0}
                    />

                    <button
                        className="mt-6 font-bold text-xl bg-black text-white p-3 rounded-lg hover:bg-black/85"
                        type="submit"
                    >Login</button>
                    <p className="mt-3 text-center text-gray-400 text-xs">Powered by Omnikasir⚡</p>
                </form>
            </div>
        </div>
    )
}

export default LoginView