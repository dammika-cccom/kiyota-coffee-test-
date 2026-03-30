import { type JWTPayload } from "jose";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "kiyota_default_security_32_chars_long";
const key = new TextEncoder().encode(secretKey);

interface SessionData extends JWTPayload {
  userId: string;
  role: string;
  [key: string]: unknown;
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
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    return payload as SessionData;
  } catch (error) {
    console.error("JWT Session Decryption Error", error);
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