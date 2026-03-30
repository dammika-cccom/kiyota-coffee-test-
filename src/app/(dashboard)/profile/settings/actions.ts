"use server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function changeUserPassword(userId: string, formData: FormData) {
  const newPass = formData.get("newPassword") as string;
  const confirmPass = formData.get("confirmPassword") as string;

  if (newPass !== confirmPass) return { error: "Passwords do not match." };

  try {
    await db.update(users)
      .set({ password: newPass, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return { success: "Security credentials updated." };
  } catch (err) {
    return { error: "Update failed." };
  }
}