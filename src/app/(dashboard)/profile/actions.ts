"use server";

import { db } from "@/db";
import { 
  users, 
  orders, 
  productInquiries, 
  academyEnrollments, 
  academyBatches, 
  courses, 
  academyMessages 
} from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth-utils";

export type ProfileState = {
  error?: string;
  success?: string;
};

/**
 * 1. UPDATE IDENTITY (Institutional Version)
 * Synchronizes personal contact data and 4-line address logic.
 */
export async function updateProfile(userId: string, prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    mobile: formData.get("mobile") as string,
    whatsapp: formData.get("whatsapp") as string,
    addressLine1: formData.get("address_1") as string,
    addressLine2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postalCode: formData.get("postalCode") as string,
    updatedAt: new Date(),
  };

  try {
    await db.update(users).set(data).where(eq(users.id, userId));
    revalidatePath("/profile");
    return { success: "Institutional identity synced successfully." };
  } catch (error: unknown) {
    console.error("Profile Sync Error:", error);
    return { error: "Update failed. Database connection issue." };
  }
}

/**
 * 2. B2B PARTNER UPGRADE REQUEST
 * Transitions a BUYER to PENDING Wholesale status using the business_profile JSONB.
 */
export async function requestB2BUpgrade(userId: string, formData: FormData): Promise<ProfileState> {
  const businessData = {
    companyName: formData.get("companyName") as string,
    registrationNumber: formData.get("brNumber") as string,
    vatNumber: formData.get("vatNumber") as string,
    monthlyVolumeForecast: formData.get("forecast") as string,
    preferredPaymentTerm: formData.get("paymentTerm") as string,
  };

  try {
    await db.update(users).set({
      b2bStatus: "PENDING",
      requestingUpgrade: true,
      businessProfile: businessData,
      updatedAt: new Date()
    }).where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: "B2B credentials submitted for institutional audit." };
  } catch (error: unknown) {
    console.error("B2B Upgrade Request Failure:", error);
    return { error: "Submission failed. Please verify technical details." };
  }
}

/**
 * 3. FETCH DASHBOARD SUMMARY (Retail & Academy)
 */
export async function getMemberDashboardStats(userId: string) {
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.userId, userId));
  const [academyCount] = await db.select({ count: sql<number>`count(*)` }).from(academyEnrollments).where(eq(academyEnrollments.userId, userId));
  
  return {
    orders: Number(orderCount?.count || 0),
    courses: Number(academyCount?.count || 0)
  };
}

/**
 * 4. FETCH B2C RETAIL ORDERS
 */
export async function getMemberOrders() {
  const auth = await getAuthUser();
  if (!auth) return [];
  return await db.select().from(orders)
    .where(eq(orders.userId, auth.userId))
    .orderBy(desc(orders.createdAt));
}

/**
 * 5. FETCH WHOLESALE INQUIRIES
 */
export async function getWholesaleInquiries() {
  const auth = await getAuthUser();
  if (!auth) return [];
  
  const [user] = await db.select().from(users).where(eq(users.id, auth.userId)).limit(1);
  if (!user) return [];

  return await db.select().from(productInquiries)
    .where(
      and(
        eq(productInquiries.email, user.email), 
        eq(productInquiries.segment, "WHOLESALE")
      )
    )
    .orderBy(desc(productInquiries.createdAt));
}

/**
 * 6. ACADEMY DATA INTEGRATION
 */
export async function getStudentMasterlog() {
  const auth = await getAuthUser();
  if (!auth) return [];
  
  return await db
    .select({
      enrollmentId: academyEnrollments.id,
      status: academyEnrollments.status,
      courseTitle: courses.title,
      batchName: academyBatches.batchName,
      startDate: academyBatches.startDate,
    })
    .from(academyEnrollments)
    .innerJoin(courses, eq(academyEnrollments.courseId, courses.id))
    .innerJoin(academyBatches, eq(academyEnrollments.batchId, academyBatches.id))
    .where(eq(academyEnrollments.userId, auth.userId))
    .orderBy(desc(academyEnrollments.appliedAt));
}

export async function sendStudentMessage(userId: string, message: string) {
  if (!message) return { error: "Message content cannot be empty." };
  try {
    await db.insert(academyMessages).values({ userId, message, senderRole: "STUDENT" });
    return { success: "Message transmitted to Director." };
  } catch (error: unknown) {
    console.error("Academy Messaging Error:", error);
    return { error: "Failed to transmit message." };
  }
}