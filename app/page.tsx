'use client';
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const loginBtnClick = () => {
    if (username === "") {
      setUsernameError("Username tidak boleh kosong")
    } else {
      setUsernameError("")
    }

    if (password === "") {
      setPasswordError("Password tidak boleh kosong")
    } else {
      setPasswordError("")
    }

    // TODO: Call login authentication logic in server side (handled by controller)
  }

  const onShowPassword = () => {
    setShowPassword(!showPassword)
  }
 
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col border-2 p-8 rounded-xl min-w-sm">
        <img src="/omnikasir.svg" alt="Logo Omnikasir" className="flex flex-row justify-center items-center max-h-16 max-w-full" />

        <hr className="my-8 border-1"/>

        <h1 className="text-center font-bold text-2xl mb-2">Login</h1>

        <label htmlFor="username" className="mt-2 font-bold">Username</label>
        <input type="text" name="username" id="username" className="border-2 p-2 rounded-lg my-1" placeholder="Username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        {usernameError !== "" && <p className="text-red-600">{usernameError}</p>}

        <label htmlFor="password" className="mt-3 font-bold">Password</label>
        <input type={showPassword ? "text" : "password"} name="password" id="password" className="border-2 p-2 rounded-lg my-1" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {passwordError !== "" && <p className="text-red-600">{passwordError}</p>}

        <span className="flex flex-row items-center mt-3">
          <input type="checkbox" name="showPassword" id="showPassword" checked={showPassword} onChange={onShowPassword} className="accent-black cursor-pointer" />
          <label htmlFor="showPassword" className="ml-2">Show Password</label>
        </span>

        <button className="mt-5 bg-black text-white p-2 rounded-xl max-w cursor-pointer" onClick={loginBtnClick}>Login</button>
      </div>
    </div>
  );
}
