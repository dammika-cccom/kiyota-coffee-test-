"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfile(userId: string, prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const mobile = formData.get("mobile") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const city = formData.get("city") as string;

  try {
    await db.update(users)
      .set({
        firstName,
        lastName,
        mobile,
        addressLine1,
        addressLine2,
        city,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: "Profile updated successfully." };
  } catch (error: unknown) {
    console.error("Profile Update Error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}