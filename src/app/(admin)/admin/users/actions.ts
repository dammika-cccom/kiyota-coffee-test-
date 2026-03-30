"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateRandomHex, generateUUID } from "@/lib/crypto-utils";

export type UserRole = 
  | "SUPER_ADMIN" | "RETAIL_ADMIN" | "WHOLESALE_ADMIN" 
  | "COFFEESHOP_ADMIN" | "FARM_ADMIN" | "ACADEMY_ADMIN" 
  | "BUYER" | "WHOLESALE_USER" | "STUDENT";

export type ActionResponse = { success?: string; error?: string } | null;

export async function authorizeB2BPartner(userId: string, limit: string, terms: number) {
  try {
    await db.update(users).set({
      role: "WHOLESALE_USER",
      b2bStatus: "ACTIVE",
      creditLimit: limit,
      creditBalance: limit,
      isApproved: true,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
    console.log(`Log: Terms Net-${terms}`);
    revalidatePath("/admin/users");
    return { success: "B2B Partnership Authorized." };
  } catch (error) {
    return { error: "Failed to authorize partner." };
  }
}

export async function adminAddUser(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const email = (formData.get("email") as string).toLowerCase().trim();
  const firstName = formData.get("firstName") as string;
  const role = formData.get("role") as UserRole;

  try {
    const tempPassword = generateRandomHex(4);
    const verificationToken = generateUUID();

    await db.insert(users).values({
      firstName,
      lastName: "Member",
      email,
      password: tempPassword,
      role,
      isApproved: true,
      verificationToken,
      isEmailVerified: false,
    });
    revalidatePath("/admin/users");
    return { success: `User Created. Temp Pass: ${tempPassword}` };
  } catch (err) {
    return { error: "Conflict or database error." };
  }
}

export async function toggleUserSuspension(userId: string, currentStatus: boolean) {
  try {
    await db.update(users).set({ isSuspended: !currentStatus, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Status synced." };
  } catch (err) {
    return { error: "Failed." };
  }
}

export async function resetUserPassword(userId: string) {
  try {
    const tempPassword = generateRandomHex(4);
    await db.update(users).set({ password: tempPassword, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: `Credentials Reset: ${tempPassword}` };
  } catch (err) {
    return { error: "Reset failed." };
  }
}

export async function releaseEmail(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Purged." };
  } catch (err) {
    return { error: "Purge failed." };
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    await db.update(users).set({ role: newRole, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Role updated." };
  } catch (err) {
    return { error: "Update failed." };
  }
}