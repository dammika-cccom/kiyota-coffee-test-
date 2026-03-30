"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";

// --- STRICT TYPES (Requirement: No 'any' types allowed) ---
export type FormState = {
  error?: string;
  success?: boolean;
};

/**
 * Register User Action
 * Handles self-registration for BUYER role.
 */
export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const city = formData.get("city") as string;

  try {
    // 1. Database Entry
    await db.insert(users).values({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password, // Password hashing (bcrypt) should be implemented here in Phase 6
      mobile,
      addressLine1,
      addressLine2,
      city,
      role: "BUYER",
      isApproved: true,
    });

  } catch (error: unknown) {
    // 2. STRICT ERROR GUARDING (Replacing 'any')
    // Check if the error is a standard Error object and contains database conflict info
    if (error instanceof Error) {
      if (error.message.includes("unique constraint") || error.message.includes("already exists")) {
        return { error: "This email is already registered. Please navigate to login." };
      }
      console.error("Database error during registration:", error.message);
    }
    
    return { error: "A system error occurred. Please verify your details and try again." };
  }

  // 3. Success Path
  redirect("/login?message=Welcome to Kiyota. Your account is ready.");
}