'use client';
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isUsernameError = usernameError !== ""
  const isPasswordError = passwordError !== ""
  const disableBtn = isUsernameError || isPasswordError || username === "" || password === ""

  const validateUsername = (username: string, shouldSetError: boolean = false) => {
    let hasError
    if (username === "") {
      if (shouldSetError) setUsernameError("Username tidak boleh kosong")
      hasError = true
    } else {
      if (shouldSetError) setUsernameError("")
      hasError = false
    }

    return !hasError
  }

  const validatePassword = (password: string, shouldSetError: boolean = false) => {
    let hasError

    if (password === "") {
      if (shouldSetError) setPasswordError("Password tidak boleh kosong")
      hasError = true
    } else {
      if (shouldSetError) setPasswordError("")
      hasError = false
    }

    return !hasError
  }

  const validateForm = () => {
    let hasError = !validateUsername(username)
    hasError = !validatePassword(password) || hasError

    return !hasError
  }

  const loginBtnClick = () => {
    if (!validateForm()) return

    if (false) { /* TODO: Add server-side authentication logic */
      // TODO: Store auth token into cookie
    } else {
      toast.error("Username atau password salah")
    }
  }

  const onUsernameChange = (username: string) => {
    setUsername(username)
    validateUsername(username, true)
  }

  const onPasswordChange = (password: string) => {
    setPassword(password)
    validatePassword(password, true)
  }

  const onShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col border-2 p-8 rounded-xl min-w-sm">
        <img src="/omnikasir.svg" alt="Logo Omnikasir" className="flex flex-row justify-center items-center max-h-16 max-w-full" />

        <hr className="my-8 border-1" />

        <h1 className="text-center font-bold text-2xl mb-2">Login</h1>

        <label htmlFor="username" className="mt-2 font-bold">Username</label>
        <input type="text" name="username" id="username" className={`border-2 p-2 rounded-lg my-1 focus:outline-none ${isUsernameError ? "border-red-600" : ""}`} placeholder="Username" autoComplete="username" value={username} onChange={(e) => { onUsernameChange(e.target.value) }} />
        {isUsernameError && <p className="text-red-600">{usernameError}</p>}

        <label htmlFor="password" className="mt-3 font-bold">Password</label>
        <input type={showPassword ? "text" : "password"} name="password" id="password" className={`border-2 p-2 rounded-lg my-1 focus:outline-none ${isPasswordError ? "border-red-600" : ""}`} placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => { onPasswordChange(e.target.value) }} />
        {isPasswordError && <p className="text-red-600">{passwordError}</p>}

        <span className="flex flex-row items-center mt-3">
          <input type="checkbox" name="showPassword" id="showPassword" checked={showPassword} onChange={onShowPassword} className="accent-black cursor-pointer" />
          <label htmlFor="showPassword" className="ml-2">Show Password</label>
        </span>

        <button className="mt-5 bg-black text-white p-2 rounded-xl max-w cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" onClick={loginBtnClick} disabled={disableBtn}>Login</button>
      </div>
    </div>
  );
}
