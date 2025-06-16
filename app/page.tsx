'use client';
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="m-3 text-xl font-bold">Login Page</h1>
      <form className="flex flex-col">
        <input name="username" type="text" placeholder="Username" className="m-1 px-2 py-1 bg-gray-800 rounded-sm"/>
        <input name="password" type="password" placeholder="Password" className="m-1 px-2 py-1 bg-gray-800 rounded-sm" />
        <button onClick={() => {console.log("Hello")}} className="hover:cursor-pointer my-3 mx-1 px-2 py-1 bg-gray-800 rounded-sm">Login</button>
      </form>
    </div>
  );
}
