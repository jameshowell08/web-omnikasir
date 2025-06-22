import { NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import bcrypt from "bcryptjs"
import { signJwt, verifyJwt } from "../../../../lib/auth"
const SYMBOLS = /^[!@#$%^&*()]/

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = await db.users.findUnique({ where: { username } })

  if (username.length < 5) {
    return NextResponse.json(
      { message: "Username minimal 5 karakter" },
      { status: 400 }
    )
  }
  if (SYMBOLS.test(username.charAt(0))) {
    return NextResponse.json(
      { message: "Username tidak boleh diawali dengan simbol" },
      { status: 400 }
    )
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password minimal 8 karakter" },
      { status: 400 }
    )
  }
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json(
      { message: "Username atau Password salah" },
      { status: 401 }
    )
  }

  const token = signJwt({ user_id: user.user_id, username: user.username })

  const res = NextResponse.json({ message: "Login success" })
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })

  return res
}
