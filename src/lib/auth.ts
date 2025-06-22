import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export interface JwtPayload {
  user_id: string
  username: string
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error: any) {
    console.log(error.message)
    return null
  }
}
