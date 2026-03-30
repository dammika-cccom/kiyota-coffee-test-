"use server";

import { db } from "@/db";
import { academyInquiries } from "@/db/schema";
import { revalidatePath } from "next/cache";

export type EnrollmentState = {
  error?: string;
  success?: boolean;
  errors?: {
    fullName?: string;
    email?: string;
    mobile?: string;
    experienceLevel?: string;
  };
};

export async function submitEnrollment(prevState: EnrollmentState, formData: FormData): Promise<EnrollmentState> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const courseId = formData.get("courseId") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  const message = formData.get("message") as string;

  const fieldErrors: EnrollmentState["errors"] = {};

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const slMobileRegex = /^(?:0|94|\+94)?7(?:0|1|2|4|5|6|7|8)\d{7}$/;

  if (!fullName || fullName.length < 2) fieldErrors.fullName = "Name too short.";
  if (!emailRegex.test(email)) fieldErrors.email = "Invalid email.";
  if (!slMobileRegex.test(mobile)) fieldErrors.mobile = "Invalid SL mobile.";

  if (Object.keys(fieldErrors).length > 0) return { errors: fieldErrors, success: false };

  try {
    await db.insert(academyInquiries).values({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      courseId: courseId || null,
      experienceLevel: experienceLevel,
      message: message || "",
      status: "NEW",
    });

    revalidatePath("/admin/academy");
    return { success: true, errors: {} };
  } catch (error: unknown) {
    // CRITICAL DEBUG: This will show the EXACT reason in your VS Code Terminal
    console.error("Postgres Error Details:", error);
    
    if (error instanceof Error) {
        return { error: `Database Error: ${error.message}`, success: false };
    }
    return { error: "An unknown database error occurred.", success: false };
  }
}