"use server";

import { db } from "@/db";
import { productInquiries } from "@/db/schema";
import { revalidatePath } from "next/cache";

export type WholesaleState = {
  error?: string;
  success?: boolean;
  errors?: { contactName?: string; email?: string; phone?: string; };
};

export async function submitWholesaleInquiry(prevState: WholesaleState, formData: FormData): Promise<WholesaleState> {
  const contactName = formData.get("contactName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const country = formData.get("country") as string;
  const volume = formData.get("volume") as string;
  const companyName = formData.get("companyName") as string;
  const message = formData.get("message") as string;

  // 1. Segment Logic
  const origin = country === "Sri Lanka" ? "LOCAL" : "INTERNATIONAL";
  const priority = volume === "BULK" ? "HIGH" : "MEDIUM";

  // 2. Simple Validation
  if (!contactName || contactName.length < 2) return { errors: { contactName: "Name required" } };
  if (!email.includes("@")) return { errors: { email: "Invalid email" } };

  try {
    await db.insert(productInquiries).values({
      segment: "WHOLESALE",
      origin: origin,
      companyName,
      contactName,
      email: email.toLowerCase().trim(),
      phone,
      location: country,
      message,
      volumeRequirement: volume,
      priority,
      status: "NEW_LEAD"
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: unknown) {
    // FIXED: Using 'err' for logging
    console.error("Wholesale submission failed:", err);
    return { error: "Submission Error. Please check your data and try again." };
  }
}