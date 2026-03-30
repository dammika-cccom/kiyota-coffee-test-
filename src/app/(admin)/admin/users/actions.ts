"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UserRole = 
  | "SUPER_ADMIN" | "RETAIL_ADMIN" | "WHOLESALE_ADMIN" 
  | "COFFEESHOP_ADMIN" | "FARM_ADMIN" | "ACADEMY_ADMIN" 
  | "BUYER" | "WHOLESALE_USER" | "STUDENT";

export type ActionResponse = { success?: string; error?: string } | null;

/**
 * INSTITUTIONAL RANDOM GENERATOR
 * Uses global Web Crypto API (supported on Cloudflare Edge)
 */
const generateRandomHex = (bytes: number): string => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 1. B2B PARTNER APPROVAL
 */
export async function authorizeB2BPartner(userId: string, limit: string, terms: number) {
  try {
    await db.update(users).set({
      role: "WHOLESALE_USER",
      b2bStatus: "ACTIVE",
      creditLimit: limit,
      creditBalance: limit,
      isApproved: true,
      requestingUpgrade: false,
      updatedAt: new Date()
    }).where(eq(users.id, userId));

    console.log(`Institutional Authorization: Net-${terms} granted.`);
    revalidatePath("/admin/users");
    return { success: "B2B Partnership Authorized successfully." };
  } catch (error: unknown) {
    return { error: "Failed to authorize partnership credentials." };
  }
}

/**
 * 2. INSTITUTIONAL ONBOARDING
 */
export async function adminAddUser(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const role = formData.get("role") as UserRole;

  try {
    const tempPassword = generateRandomHex(3); 
    const verificationToken = crypto.randomUUID(); // Global Web Crypto

    await db.insert(users).values({
      firstName,
      lastName: "Member",
      email: email.toLowerCase().trim(),
      password: tempPassword, 
      role: role,
      isApproved: true,
      verificationToken: verificationToken, 
      isEmailVerified: false,
    });
    revalidatePath("/admin/users");
    return { success: `User Created. Temp Pass: ${tempPassword}` };
  } catch (err: unknown) {
    return { error: "Identity conflict or database timeout." };
  }
}

/**
 * 3. SECURITY SUSPENSION
 */
export async function toggleUserSuspension(userId: string, currentStatus: boolean) {
  try {
    await db.update(users).set({ isSuspended: !currentStatus, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Account status synchronized." };
  } catch (error: unknown) {
    return { error: "Status update failed." };
  }
}

/**
 * 4. ROLE UPDATES
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    await db.update(users).set({ role: newRole, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Role hierarchy updated." };
  } catch (error) {
    return { error: "Role update failed." };
  }
}

/**
 * 5. DATA PURGE
 */
export async function releaseEmail(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Member identity purged." };
  } catch (error: unknown) {
    return { error: "Failed to release email identity." };
  }
}

/**
 * 6. CREDENTIAL RESET
 */
export async function resetUserPassword(userId: string) {
  try {
    const tempPassword = generateRandomHex(4); 
    await db.update(users).set({ password: tempPassword, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: `Credentials Reset. Temp Pass: ${tempPassword}` };
  } catch (error: unknown) {
    return { error: "Failed to reset password." };
  }
}