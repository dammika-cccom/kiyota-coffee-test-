import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = 'edge';

/**
 * INSTITUTIONAL IPN LISTENER
 * Cloudflare Edge Compatible
 */
export async function POST(req: NextRequest) {
  try {
    const nodeCrypto = require('crypto');
    const formData = await req.formData();
    
    const merchantId = formData.get("merchant_id") as string;
    const orderId = formData.get("order_id") as string;
    const payhereAmount = formData.get("payhere_amount") as string;
    const payhereCurrency = formData.get("payhere_currency") as string;
    const statusCode = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantSecret) {
      return new NextResponse("Configuration Error", { status: 500 });
    }

    const hashedSecret = nodeCrypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const localHash = nodeCrypto
      .createHash("md5")
      .update(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret)
      .digest("hex")
      .toUpperCase();

    if (localHash !== md5sig) {
      console.error(`Security Breach: Invalid Signature for Order ${orderId}`);
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    if (statusCode === "2") {
      await db.update(orders)
        .set({ paymentStatus: "PAID", status: "PAID" })
        .where(eq(orders.id, orderId));
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error: unknown) {
    console.error("Institutional IPN Route Failure:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}