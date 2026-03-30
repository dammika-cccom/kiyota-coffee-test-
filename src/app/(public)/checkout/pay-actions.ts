"use server";

import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generatePayHereHash } from "@/lib/payhere-security";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { auditPartnerCredit } from "@/app/(admin)/admin/users/dunning-actions";

export type PaymentMethod = "PAYHERE" | "BANK_TRANSFER" | "COD" | "ON_CREDIT";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  country: string;
  amount: number;
  paymentType: PaymentMethod;
  items: OrderItem[];
  shippingCost: number;
}

export async function processInstitutionalPayment(data: OrderPayload) {
  const session = await getSession();
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "";
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";

  try {
    const isB2B = session?.role === "WHOLESALE_USER";
    const userId = session?.userId || null;

    if (userId) {
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      // 1. SELECTIVE CREDIT RESTRICTION
      // Blocks ON_CREDIT but allows other methods for B2B users
      if (data.paymentType === "ON_CREDIT") {
        if (!isB2B) return { error: "Access restricted to Wholesale Partners." };
        
        if (user.isCreditRestricted) {
          return { error: "Institutional Credit Facility is currently restricted. Please use Bank Transfer or PayHere to proceed." };
        }

        if (Number(user.creditBalance || 0) < data.amount) {
          return { error: "Insufficient Credit Balance. Please settle outstanding invoices." };
        }

        // Deduct from Credit Balance
        await db.update(users)
          .set({ 
            creditBalance: (Number(user.creditBalance) - data.amount).toString(),
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      }
    }

    // 2. PERSIST ORDER
    // Metadata includes specific bank account markers for fulfillment audit
    const [newOrder] = await db.insert(orders).values({
      userId: userId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      totalAmount: data.amount.toString(),
      shippingCost: data.shippingCost.toString(),
      status: "PENDING",
      paymentStatus: data.paymentType === "ON_CREDIT" ? "PAID" : "UNPAID",
      paymentType: data.paymentType,
      isB2B: isB2B,
      metadata: { 
        items: data.items, 
        country: data.country,
        bankTarget: isB2B ? "CORPORATE_EXPORT_9012" : "RETAIL_DOMESTIC_4555"
      }
    }).returning();

    // 3. TRIGGER POST-TRANSACTION CREDIT AUDIT
    // This updates the 25/50/75/100% milestones in the user's profile
    if (userId) await auditPartnerCredit(userId);

    // 4. PAYHERE HANDSHAKE
    if (data.paymentType === "PAYHERE") {
      const hash = generatePayHereHash(merchantId, newOrder.id, data.amount, "LKR", merchantSecret);
      return {
        success: true,
        method: "PAYHERE" as const,
        orderId: newOrder.id,
        merchantId,
        hash,
        amount: data.amount.toFixed(2),
        gatewayUrl: process.env.PAYHERE_MODE === "live" ? "https://www.payhere.lk/pay/checkout" : "https://sandbox.payhere.lk/pay/checkout"
      };
    }

    revalidatePath("/profile/orders");
    revalidatePath("/admin/orders");
    return { success: true, method: data.paymentType, orderId: newOrder.id };

  } catch (error: unknown) {
    console.error("Institutional Sync Failure:", error);
    return { error: "System failed to commit transaction." };
  }
}