"use server";

import { db } from "@/db";
import { productInquiries } from "@/db/schema";
import { revalidatePath } from "next/cache";

export type ContactState = {
  success?: string;
  error?: string;
} | null;

export async function submitContactInquiry(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const segment = formData.get("segment") as string; // RETAIL, WHOLESALE, CAREER
  const message = formData.get("message") as string;

  try {
    await db.insert(productInquiries).values({
      contactName: name,
      email: email.toLowerCase().trim(),
      phone: phone,
      segment: segment, // Categorizes the lead
      origin: "LOCAL", 
      location: "Sri Lanka",
      message: message,
      status: "NEW_LEAD",
    });

    revalidatePath("/admin/orders"); // Lead appears in Admin
    return { success: "Message transmitted to the Roastery team." };
  } catch (err) {
    console.error("Contact Hub Error:", err);
    return { error: "Transmission failed. Please try WhatsApp." };
  }
}