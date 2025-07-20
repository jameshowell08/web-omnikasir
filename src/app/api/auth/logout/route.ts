import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Logout success" })
    res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })

    return res
}