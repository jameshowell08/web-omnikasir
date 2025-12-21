import { SignJWT, jwtVerify } from "jose"
import { db } from "./db"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-at-least-32-characters-long"
)

export interface JwtPayload {
  user_id: string
  username: string
  role: "ADMIN" | "CASHIER"
}

/**
 * Generate JWT with just Role
 */
export async function generateJwt(userId: string): Promise<string> {
  const user = await db.users.findUnique({
    where: { userId },
    select: { userId: true, username: true, role: true, isActive: true },
  })

  if (!user || !user.isActive) throw new Error("User invalid or inactive")

  const payload: JwtPayload = {
    user_id: user.userId,
    username: user.username,
    role: user.role as "ADMIN" | "CASHIER",
  }

  await db.users.update({
    where: { userId },
    data: { lastLogin: new Date() },
  })

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

/**
 * Verify JWT
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}
