function TextField({
    name,
    error = "",
    type = 'text',
    placeholder = "Ketik disini...",
    showPassword = false,
    showError = false,
    setShowPassword = (() => {})
}: {
    name: string,
    error?: string,
    type?: string,
    placeholder?: string,
    showPassword?: boolean,
    showError?: boolean,
    setShowPassword?: (value: boolean) => void
}) {
    return type == 'password' ? (
        <div className="flex flex-col">
            <div className="relative">
                <input 
                    className={`border p-3 pr-11 rounded-lg w-full ${showError && "border-red-500 focus:border-red-500 focus:outline-red-500"}`}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    placeholder={placeholder}
                />
                <span className="flex items-center absolute inset-y-0 right-0 select-none">
                    <span className="material-symbols-rounded m-2 p-1 rounded-lg hover:bg-black/10" onClick={() => {setShowPassword(!showPassword)}}>
                        { showPassword ? "visibility_off" : "visibility" }
                    </span>
                </span>
            </div>
            {showError && <span className="mx-1 mt-1 text-sm text-red-500">{error}</span>} 
        </div>
    ) : (
        <div className="flex flex-col">
            <input 
                className={`border p-3 rounded-lg w-full ${showError && "border-red-500 focus:border-red-500 focus:outline-red-500"}`}
                type={type}
                name={name}
                placeholder={placeholder}
            />
            {showError && <span className="mx-1 mt-1 text-sm text-red-500">{error}</span>} 
        </div>
    )
}

export default TextField;