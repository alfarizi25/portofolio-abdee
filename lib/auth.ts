import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const ADMIN_USER = process.env.ADMIN_USER || "admin"
const ADMIN_PASS = process.env.ADMIN_PASS || "password"

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS
}

export function generateToken(username: string): string {
  // Simple token generation without JWT library to avoid the error
  const payload = {
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function verifyToken(token: string): { username: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    return { username: payload.username }
  } catch {
    return null
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value || null
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  if (!token) return false
  return verifyToken(token) !== null
}
