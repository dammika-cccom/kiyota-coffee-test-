"use server";

import { db } from "@/db";
import { courses, academyInquiries, academyBatches, academyEnrollments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// STRICT TYPES
export type AcademyState = { error?: string; success?: string; };

/**
 * 1. PUBLIC: Submit Enrollment Inquiry
 */
export async function submitInquiry(prevState: AcademyState | null, formData: FormData): Promise<AcademyState> {
  try {
    await db.insert(academyInquiries).values({
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      experienceLevel: formData.get("experienceLevel") as string,
      message: formData.get("message") as string,
    });
    return { success: "Inquiry transmitted to Academy Director." };
  } catch (err) {
    console.error("Inquiry Error:", err);
    return { error: "Transmission failed. Check database connectivity." };
  }
}

/**
 * 2. ADMIN: Schedule a New Batch
 * Uses 'courses' to verify template existence
 */
export async function createBatch(prevState: AcademyState | null, formData: FormData): Promise<AcademyState> {
  const courseId = formData.get("courseId") as string;
  try {
    const [courseExists] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (!courseExists) return { error: "Course template not found." };

    await db.insert(academyBatches).values({
      courseId,
      batchName: formData.get("batchName") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("startDate") as string), // Default same day
      maxCapacity: 4,
    });

    revalidatePath("/admin/academy");
    return { success: "Session scheduled successfully." };
  } catch (err) {
    console.error("Batch Error:", err);
    return { error: "Scheduling failed. Check date format." };
  }
}

/**
 * 3. ADMIN: Approve Enrollment
 */
export async function updateEnrollment(enrollmentId: string, status: string, batchId: string) {
  try {
    await db.update(academyEnrollments).set({ status }).where(eq(academyEnrollments.id, enrollmentId));
    
    if (status === "APPROVED") {
      await db.update(academyBatches)
        .set({ currentEnrollment: sql`${academyBatches.currentEnrollment} + 1` })
        .where(eq(academyBatches.id, batchId));
    }
    
    revalidatePath("/admin/academy");
  } catch (err) {
    console.error("Sync Error:", err);
  }
}