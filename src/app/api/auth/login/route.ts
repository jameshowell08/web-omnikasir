import { NextResponse } from "next/server"
import { db } from "@/src/modules/shared/util/db"
import { generateJwt } from "@/src/modules/shared/util/auth"
import { compare } from "bcryptjs" // Or your preferred hashing lib

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 1. Find user
    const user = await db.users.findUnique({ where: { username } })
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // 2. Check password
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // 3. Generate JWT
    const token = await generateJwt(user.userId)

    // 4. Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        username: user.username,
        role: user.role, // <--- Throwing the role to the frontend here
      },
    })

    // 5. Set the cookie (Secure & HTTP-Only)
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents JS from reading the token (XSS protection)
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
