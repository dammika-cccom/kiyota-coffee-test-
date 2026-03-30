"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, logout } from "@/lib/session";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
  success?: boolean;
  role?: string;
} | null;

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);

    if (!user || user.password !== password) {
      return { error: "Invalid institutional credentials." };
    }

    // Create the session with a fallback to "BUYER" if role is missing
    const userRole = user.role || "BUYER";
    await createSession(user.id, userRole);

    return { 
      success: true, 
      role: userRole 
    };

  } catch (error) {
    console.error("Auth Error:", error); // FIXED: err variable used
    return { error: "Authentication system is currently busy." };
  }
}

/**
 * FIXED: Added missing export for SignOutButton
 */
export async function handleLogout() {
  await logout();
  redirect("/login");
}