import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "./modules/shared/util/auth"
import { Constants } from "./modules/shared/model/Constants"

export async function middleware(req: NextRequest) {
  const publicPaths = [Constants.LOGIN_URL, "/api/auth"]
  const { pathname } = req.nextUrl

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  const token = req.cookies.get("token")?.value
  let user = null

  if (token) {
    try {
      user = await verifyJwt(token)
    } catch (error) {
      console.error("Middleware JWT verification error:", error)
      user = null
    }
  }

  // Handle API routes separately
  if (pathname.startsWith("/api")) {
    // Allow public API paths
    if (isPublicPath) {
      return NextResponse.next()
    }

    // Require auth for protected API routes
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Set user header for authenticated API requests
    const response = NextResponse.next()
    response.headers.set("x-user-id", (user.user_id as string) || "")
    return response
  }

  // Handle page routes
  // If user is logged in and trying to access login page or root, redirect to overview
  if (user && (pathname === Constants.LOGIN_URL || pathname === "/")) {
    return NextResponse.redirect(new URL(Constants.OVERVIEW_URL, req.url))
  }

  // If user is NOT logged in and trying to access protected pages, redirect to login
  if (!user && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL(Constants.LOGIN_URL, req.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
}
