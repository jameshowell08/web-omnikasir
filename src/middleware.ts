import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "./lib/auth"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const user = token ? verifyJwt(token) : null

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard
}
