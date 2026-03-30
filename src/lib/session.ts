import { type JWTPayload } from "jose";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { cookies } from "next/headers";

/**
 * INSTITUTIONAL SECURITY CONFIG
 * Bypasses Node.js streams to ensure 100% Cloudflare Edge compatibility.
 */
const secretKey = process.env.SESSION_SECRET || "kiyota_secret_key_industrial_standard_32_chars";
const key = new TextEncoder().encode(secretKey);

/**
 * SESSION DATA INTERFACE
 * Includes index signature to satisfy jose's JWTPayload requirements.
 */
interface SessionData extends JWTPayload {
  userId: string;
  role: string;
  [key: string]: unknown; // FIXED: Added index signature to resolve type mismatch
}

export async function encrypt(payload: SessionData): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    // FIXED: Explicit type casting to SessionData
    return payload as SessionData;
  } catch (error) {
    console.error("JWT Edge Decryption Failure:", error);
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { 
    expires: expiresAt, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/", 
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}