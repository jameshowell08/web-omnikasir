import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "./modules/shared/util/auth"
import { Constants } from "./modules/shared/model/Constants"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const publicPaths = [
    Constants.LOGIN_URL,
    "/api/auth",
    "/api/webhooks/ecommerce",
  ]

  const isPublicPath = publicPaths.some((path) => {
    if (path === "/") return pathname === path
    return pathname.startsWith(path)
  })

  const token = req.cookies.get("token")?.value
  const user = token ? await verifyJwt(token) : null

  if (pathname.startsWith("/api")) {
    if (isPublicPath) return NextResponse.next()

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = NextResponse.next()
    response.headers.set("x-user-id", (user.user_id as string) || "")
    return response
  }

  if (!user) {
    if (!isPublicPath && pathname !== "/") {
      return NextResponse.redirect(new URL(Constants.LOGIN_URL, req.url))
    }
    return NextResponse.next()
  }

  if (pathname === Constants.LOGIN_URL || pathname === "/") {
    return NextResponse.redirect(new URL(Constants.OVERVIEW_URL, req.url))
  }

  if (user.role === "CASHIER") {
    const allowedCashierPages = [
      Constants.OVERVIEW_URL,
      Constants.PRODUCTS_URL,
      "/sales",
      "/sales/add",
    ]

    const normalize = (p: string) =>
      p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p
    const normalizedPathname = normalize(pathname)

    const isAllowed = allowedCashierPages.some((path) => {
      const np = normalize(path)
      return normalizedPathname === np
    })

    if (!isAllowed) {
      return NextResponse.redirect(new URL(Constants.OVERVIEW_URL, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
}
