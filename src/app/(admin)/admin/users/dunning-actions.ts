"use server";

import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * INSTITUTIONAL CREDIT AUDIT
 * Purpose: Automated Credit Protection & Milestone tracking.
 * Zero-Any | Zero-ESLint
 */
export async function auditPartnerCredit(userId: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || user.role !== "WHOLESALE_USER") return null;

    const limit = Number(user.creditLimit || 0);
    const balance = Number(user.creditBalance || 0);
    if (limit <= 0) return null;

    const usagePercent = ((limit - balance) / limit) * 100;
    
    // 1. Calculate Velocity Milestone
    let milestone = 0;
    if (usagePercent >= 100) milestone = 100;
    else if (usagePercent >= 75) milestone = 75;
    else if (usagePercent >= 50) milestone = 50;
    else if (usagePercent >= 25) milestone = 25;

    // 2. Check Overdue Invoices
    const terms = user.creditTermsDays || 30;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - terms);

    const overdue = await db.select().from(orders).where(
      and(
        eq(orders.userId, userId),
        eq(orders.paymentType, "ON_CREDIT"),
        eq(orders.paymentStatus, "UNPAID"),
        lt(orders.createdAt, threshold)
      )
    );

    const isRestricted = overdue.length > 0 || usagePercent >= 100;

    await db.update(users).set({
      isCreditRestricted: isRestricted,
      lastCreditMilestone: milestone,
      updatedAt: new Date()
    }).where(eq(users.id, userId));

    revalidatePath("/wholesale");
    return { milestone, isRestricted };
  } catch (error: unknown) {
    console.error("Institutional Audit Failure:", error);
    return null;
  }
}