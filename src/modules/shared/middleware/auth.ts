import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt, JwtPayload } from "../util/auth"

/**
 * Base authentication check
 */
export async function authenticate(
  req: NextRequest
): Promise<{ user: JwtPayload } | { error: NextResponse }> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      ),
    }
  }

  const user = await verifyJwt(token)
  if (!user) {
    return {
      error: NextResponse.json({ error: "Session expired" }, { status: 401 }),
    }
  }

  return { user }
}

/**
 * Use this for Inventory, Users, and Reports
 */
export async function requireAdmin(req: NextRequest) {
  const result = await authenticate(req)
  if ("error" in result) return result

  if (result.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      ),
    }
  }

  return result
}

/**
 * Use this for Transactions (Both Cashier and Admin)
 */
export async function requireAnyRole(req: NextRequest) {
  return await authenticate(req)
}
