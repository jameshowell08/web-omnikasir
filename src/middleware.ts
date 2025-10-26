import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "./modules/shared/util/auth"
import { Constants } from "./modules/shared/model/constants"

export async function middleware(req: NextRequest) {
  // const token = req.cookies.get("token")?.value
  // const user = token ? await verifyJwt(token) : null
  // const { pathname } = req.nextUrl

  // const isPublicPath = pathname === Constants.LOGIN_URL

  // // If the path is protected and the user is not authenticated, redirect to login.
  // if (!isPublicPath && !user) {
  //   return NextResponse.redirect(new URL(Constants.LOGIN_URL, req.url));
  // }

  // // If the path is public (or the root) and the user is authenticated, redirect to the dashboard.
  // if ((isPublicPath || pathname === "/") && user) {
  //   return NextResponse.redirect(new URL(Constants.TRANSACTION_URL, req.url));
  // }

  return NextResponse.next()
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - assets (file in public/assets)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
