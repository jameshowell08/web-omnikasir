import { JWTPayload, SignJWT, jwtVerify } from "jose"

const encoder = new TextEncoder()
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function signJwt(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // expires in 1 hour
    .sign(encoder.encode(JWT_SECRET))

  return jwt
}

export async function verifyJwt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(JWT_SECRET)
    )
    return payload
  } catch (err) {
    console.error("JWT verification failed:", err)
    return null
  }
}
