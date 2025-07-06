import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "./lib/auth"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const user = token ? await verifyJwt(token) : null

  const publicPaths = ["/", "/login"]

  if (!publicPaths.includes(req.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", req.url))
  } else if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"], // Protect dashboard
}
