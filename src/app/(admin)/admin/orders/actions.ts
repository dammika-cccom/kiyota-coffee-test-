"use server";

import { db } from "@/db";
import { productInquiries, orders, lots } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * B2B LEAD MANAGEMENT (Existing)
 */
export async function updateLeadStatus(id: string, status: string) {
  try {
    await db.update(productInquiries).set({ status }).where(eq(productInquiries.id, id));
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("Lead Status Error:", err);
    return { error: "Failed to update lead." };
  }
}

export async function updateLeadPriority(id: string, priority: string) {
  try {
    await db.update(productInquiries).set({ priority }).where(eq(productInquiries.id, id));
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("Lead Priority Error:", err);
    return { error: "Failed to update priority." };
  }
}

/**
 * B2C RETAIL ORDER MANAGEMENT (New Enhancement)
 * Handles status flow: PENDING -> PAID -> SHIPPED -> DELIVERED
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    
    // Logic: In Phase 6, this will trigger the 'Order Shipped' Email/SMS
    revalidatePath("/admin/orders");
    revalidatePath("/account/orders"); // Refresh the customer's dashboard
    return { success: true };
  } catch (err) {
    console.error("Order Status Error:", err);
    return { error: "Failed to update order status." };
  }
}

/**
 * LOGISTICS: Update Tracking Number
 */
export async function updateOrderLogistics(orderId: string, trackingNumber: string) {
  try {
    // Note: Ensure your schema has the trackingNumber column in 'orders'
    await db.update(orders)
      .set({ 
        // @ts-expect-error - Metadata field handling
        trackingNumber: trackingNumber,
        status: "SHIPPED"
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: "Tracking number assigned." };
  } catch (err) {
    console.error("Logistics Error:", err);
    return { error: "Failed to update logistics." };
  }
}

/**
 * RACEABILITY GATE: LINK LOT & PROGRESS TO ROASTING
 */
export async function linkLotAndProgress(orderId: string, lotNumber: string) {
  try {
    // Verify lot exists in the registry
    const [lotExists] = await db.select().from(lots).where(eq(lots.lotNumber, lotNumber)).limit(1);
    if (!lotExists) return { error: "Physical Lot Number not found." };

    await db.update(orders)
      .set({ 
        status: "ROASTING",
        // Inject lot number into metadata
        metadata: sql`jsonb_set(COALESCE(${orders.metadata}, '{}'), '{lotNumber}', ${JSON.stringify(lotNumber)})`
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("Lot Link Error:", err);
    return { error: "System failed to link traceability data." };
  }
}