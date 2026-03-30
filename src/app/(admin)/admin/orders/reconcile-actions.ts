"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * INSTITUTIONAL RECONCILIATION ENGINE
 * Parses Sampath Bank CSV format and auto-updates Order status.
 */
export async function reconcileSampathCSV(csvData: string) {
  try {
    const rows = csvData.split("\n").slice(1); // Skip Header
    const matchedOrderIds: string[] = [];

    for (const row of rows) {
      const columns = row.split(",");
      if (columns.length < 5) continue;

      // Sampath format: [2] is Reference, [4] is Deposit Amount
      const reference = columns[2]?.trim();
      const depositAmount = parseFloat(columns[4] || "0");

      if (depositAmount > 0 && reference) {
        const [order] = await db.select()
          .from(orders)
          .where(eq(orders.reconciliationId, reference))
          .limit(1);

        if (order && order.paymentStatus !== "PAID") {
          matchedOrderIds.push(order.id);
        }
      }
    }

    if (matchedOrderIds.length > 0) {
      await db.update(orders)
        .set({ paymentStatus: "PAID", status: "PAID" })
        .where(inArray(orders.id, matchedOrderIds));
    }

    revalidatePath("/admin/orders");
    return { success: true, count: matchedOrderIds.length };
  } catch (error: unknown) {
    // FIXED: Log the error for internal auditing, resolving the unused-var issue
    console.error("Institutional Recon Error:", error);
    return { success: false, error: "CSV Parsing failed or database timeout." };
  }
}

/**
 * REPETITIVE TESTING UTILITY
 */
export async function seedTestingOrders() {
  try {
    const dummyOrders = Array.from({ length: 5 }).map((_, i) => ({
      customerName: `QA Tester ${Math.floor(Math.random() * 1000)}`,
      customerAddress: "Test Street, Colombo 03",
      customerPhone: "0770000000",
      totalAmount: (2500 + (i * 500)).toString(),
      status: "PAID",
      paymentStatus: "UNPAID",
      reconciliationId: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      isB2B: false,
    }));

    await db.insert(orders).values(dummyOrders);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: unknown) {
    console.error("Seed Error:", error);
    return { success: false };
  }
}