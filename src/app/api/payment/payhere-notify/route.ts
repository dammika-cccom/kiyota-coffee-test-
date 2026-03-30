import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { md5 } from "@/lib/crypto-utils";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const merchantId = formData.get("merchant_id") as string;
    const orderId = formData.get("order_id") as string;
    const payhereAmount = formData.get("payhere_amount") as string;
    const payhereCurrency = formData.get("payhere_currency") as string;
    const statusCode = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) return new NextResponse("Config Error", { status: 500 });

    const hashedSecret = md5(merchantSecret).toUpperCase();
    const localHash = md5(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret).toUpperCase();

    if (localHash !== md5sig) return new NextResponse("Unauthorized", { status: 401 });

    if (statusCode === "2") {
      await db.update(orders).set({ paymentStatus: "PAID", status: "PAID" }).where(eq(orders.id, orderId));
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: unknown) {
    console.error("IPN Route Failure:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}