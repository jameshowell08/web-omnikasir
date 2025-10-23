function TextField({
    name,
    type = 'text',
    placeholder = "Ketik disini...",
    showPassword = false,
    setShowPassword = (() => {})
}: {
    name: string,
    type?: string,
    placeholder?: string,
    showPassword?: boolean,
    setShowPassword?: (value: boolean) => void
}) {
    return type == 'password' ? (
        <div className="relative">
            <input 
                className="border p-3 pr-11 rounded-lg w-full"
                type={showPassword ? "text" : "password"}
                name={name}
                placeholder={placeholder}
            />
            <span className="flex items-center absolute inset-y-0 right-0 select-none">
                <span className="material-symbols-rounded m-2 p-1 rounded-lg hover:bg-black/10" onClick={() => {setShowPassword(!showPassword)}}>
                    { !showPassword ? "visibility" : "visibility_off" }
                </span>
            </span>
        </div>
    ) : (
        <input 
            className="border p-3 rounded-lg w-full"
            type={type}
            name={name}
            placeholder={placeholder}
        />
    )
}

export default TextField;