import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { md5 } from "@/lib/crypto-utils";

/**
 * INSTITUTIONAL IPN LISTENER
 * Runtime: Cloudflare Edge (OpenNext optimized)
 */
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const merchantId = (formData.get("merchant_id") as string) || "";
    const orderId = (formData.get("order_id") as string) || "";
    const payhereAmount = (formData.get("payhere_amount") as string) || "";
    const payhereCurrency = (formData.get("payhere_currency") as string) || "";
    const statusCode = (formData.get("status_code") as string) || "";
    const md5sig = (formData.get("md5sig") as string) || "";

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantSecret) {
      console.error("Infrastructure Error: PAYHERE_MERCHANT_SECRET is missing.");
      return new NextResponse("Configuration Error", { status: 500 });
    }

    // 1. SIGNATURE VERIFICATION (USING EDGE-SAFE MD5)
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const localHash = md5(
      merchantId + 
      orderId + 
      payhereAmount + 
      payhereCurrency + 
      statusCode + 
      hashedSecret
    ).toUpperCase();

    // 2. SECURITY PROTOCOL VALIDATION
    if (localHash !== md5sig) {
      console.error(`Security Breach Attempt: Invalid MD5 for Order ${orderId}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. DATABASE SYNCHRONIZATION
    if (statusCode === "2") {
      await db.update(orders)
        .set({ 
          paymentStatus: "PAID", 
          status: "PAID" 
        })
        .where(eq(orders.id, orderId));
      
      console.log(`Logistics Sync: Order ${orderId} verified.`);
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Critical IPN Route Failure:", errorMessage);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}