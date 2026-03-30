"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { revalidatePath } from "next/cache";

export type OrderResponse = {
  success?: string;
  orderId?: string;
  error?: string;
} | null;

export async function processOrder(prevState: OrderResponse, formData: FormData): Promise<OrderResponse> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const amount = formData.get("amount") as string;
  const shipping = formData.get("shipping") as string;
  const payMethod = formData.get("payMethod") as string;

  try {
    const [newOrder] = await db.insert(orders).values({
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      totalAmount: amount,
      shippingCost: shipping,
      paymentType: payMethod,
      paymentStatus: "UNPAID",
      status: "PENDING"
    }).returning();

    revalidatePath("/admin/orders");
    return { 
      success: "Order registered in roastery system.", 
      orderId: newOrder.id 
    };
  } catch (err) {
    console.error("Payment Logic Error:", err);
    return { error: "Logistics Sync Failed. Please retry." };
  }
}