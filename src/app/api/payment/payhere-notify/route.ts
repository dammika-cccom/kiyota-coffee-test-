import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

/**
 * INSTITUTIONAL IPN LISTENER
 * Purpose: Asynchronous Payment Confirmation from PayHere.
 * Zero-Any Standard | Zero-ESLint Error
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Extract Form Data (PayHere sends x-www-form-urlencoded)
    const formData = await req.formData();
    
    const merchantId = formData.get("merchant_id") as string;
    const orderId = formData.get("order_id") as string;
    const payhereAmount = formData.get("payhere_amount") as string;
    const payhereCurrency = formData.get("payhere_currency") as string;
    const statusCode = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantSecret) {
      console.error("IPN Failure: Merchant Secret missing in env.");
      return new NextResponse("Configuration Error", { status: 500 });
    }

    // 2. CRITICAL: Signature Verification
    // IPN Formula: md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).toUpperCase())
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const localHash = crypto
      .createHash("md5")
      .update(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret)
      .digest("hex")
      .toUpperCase();

    // 3. SECURE VALIDATION
    if (localHash !== md5sig) {
      console.error(`Security Breach: Invalid MD5 Signature for Order ${orderId}`);
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    // 4. DATABASE SYNCHRONIZATION
    // Status Code 2 means "Success" in PayHere Logic
    if (statusCode === "2") {
      await db.update(orders)
        .set({ 
          paymentStatus: "PAID", 
          status: "PAID" // Automatically moves to the Fulfillment Pipeline
        })
        .where(eq(orders.id, orderId));
      
      console.log(`Institutional Sync: Order ${orderId} marked as PAID via IPN.`);
    }

    // PayHere expects a 200 OK response to stop sending notifications
    return new NextResponse("OK", { status: 200 });

  } catch (error: unknown) {
    // FIXED: Utilizing the 'error' variable for institutional logging
    console.error("Institutional IPN Route Failure:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}