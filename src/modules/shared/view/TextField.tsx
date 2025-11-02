import { Icon, IconProps } from "@tabler/icons-react";
import clsx from "clsx";
import React, { ChangeEventHandler, ForwardRefExoticComponent, RefAttributes } from "react";

function TextField({
    name,
    className = "",
    prefixIcon = null,
    error = "",
    type = 'text',
    placeholder = "Ketik disini...",
    showPassword = false,
    showError = false,
    setShowPassword = (() => {}),
    onChange = (() => {})
}: {
    name: string,
    className?: string,
    prefixIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> | null,
    error?: string,
    type?: string,
    placeholder?: string,
    showPassword?: boolean,
    showError?: boolean,
    setShowPassword?: (value: boolean) => void,
    onChange?: ChangeEventHandler<HTMLInputElement>
}) {
    return type == 'password' ? (
        <div className={`flex flex-col ${className}`}>
            <div className="relative">
                <input 
                    className={`border p-3 pr-11 rounded-lg w-full ${showError && "text-red-500 border-red-500 focus:border-red-500 focus:outline-red-500"}`}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                />
                <span className="flex items-center absolute inset-y-0 right-0 select-none">
                    <span className={`material-symbols-rounded m-2 p-1 rounded-lg hover:bg-black/10 ${showError && "text-red-500"}`} onClick={() => {setShowPassword(!showPassword)}}>
                        { showPassword ? "visibility_off" : "visibility" }
                    </span>
                </span>
            </div>
            {showError && <span className="mx-1 mt-1 text-sm text-red-500">{error}</span>} 
        </div>
    ) : (
        <div className={`flex flex-col ${className}`}>
            <div className="relative">
                <input 
                    className={clsx(
                        "border p-3 rounded-lg w-full",
                        showError && "text-red-500 border-red-500 focus:border-red-500 focus:outline-red-500",
                        prefixIcon != null && "pl-11"
                    )}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                />
                <span className="absolute flex flex-row left-0 inset-y-0 m-3 w-fit">
                    {prefixIcon != null && React.createElement(prefixIcon)}
                </span>
            </div>
            {showError && <span className="mx-1 mt-1 text-sm text-red-500">{error}</span>} 
        </div>
    )
}

export default TextField;