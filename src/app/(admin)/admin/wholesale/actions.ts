"use server";

import { db } from "@/db";
import { productInquiries, products } from "@/db/schema";
// FIXED: Added 'sql' import, removed unused 'lots'
import { eq, sql } from "drizzle-orm"; 
import { revalidatePath } from "next/cache";

// FIXED: Defined strict interface instead of 'any'
export type QuoteResponse = {
  success?: string;
  error?: string;
  calculated?: {
    subtotal: number;
    freight: number;
    insurance: number;
    total: number;
  };
} | null;

/**
 * Update Bulk Pricing for B2B
 */
export async function updateWholesalePricing(productId: string, lkrPrice: string, usdPrice: string) {
  try {
    await db.update(products).set({
      wholesalePriceLkr: lkrPrice,
      wholesalePriceUsd: usdPrice,
      updatedAt: new Date()
    }).where(eq(products.id, productId));
    revalidatePath("/admin/wholesale");
  } catch (err) {
    console.error("Wholesale Price Update Error:", err);
  }
}

/**
 * Register B2B Quote in Database
 */
export async function registerB2BQuote(leadId: string, formData: FormData): Promise<QuoteResponse> {
  const fob = parseFloat(formData.get("fobPrice") as string) || 0;
  const freight = parseFloat(formData.get("freight") as string) || 0;
  const insurance = parseFloat(formData.get("insurance") as string) || 0;
  const qty = parseFloat(formData.get("quantity") as string) || 0;

  try {
    const totalLanded = (fob * qty) + freight + insurance;

    // FIXED: 'sql' is now imported and used correctly
    await db.update(productInquiries)
      .set({ 
        status: "QUOTED",
        message: sql`${productInquiries.message} || '\n[System: Quote Generated: $' || ${totalLanded.toString()} || ']'`
      })
      .where(eq(productInquiries.id, leadId));

    revalidatePath("/admin/wholesale");
    return { 
      success: "Quotation registered successfully.",
      calculated: { subtotal: (fob * qty), freight, insurance, total: totalLanded }
    };
  } catch (err) {
    console.error("Quotation Sync Error:", err);
    return { error: "Failed to sync quote with database." };
  }
}