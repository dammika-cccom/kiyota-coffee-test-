"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type ProductCategory = "SPECIALTY_ARABICA" | "GREEN_BEANS" | "CEYLON_SPICES" | "EQUIPMENT" | "SAMPLE";
type PricingLogic = "MANUAL" | "AUTO_CONVERT";
type DisplayMode = "LKR_ONLY" | "USD_ONLY" | "BOTH";

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

export async function upsertProduct(
  prevState: ProductFormState | null, 
  formData: FormData
): Promise<ProductFormState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  
  // SEO-Friendly Slug
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  
  const data = {
    name,
    description: formData.get("description") as string,
    weightGrams: parseInt(formData.get("weightGrams") as string) || 0,
    
    // B2C Pricing
    priceLkr: formData.get("priceLkr") as string || null,
    priceUsd: formData.get("priceUsd") as string || null,
    pricingLogic: (formData.get("pricingLogic") as PricingLogic) || "AUTO_CONVERT",
    displayMode: (formData.get("displayMode") as DisplayMode) || "BOTH",

    // B2B Pricing
    wholesalePriceLkr: formData.get("wholesalePriceLkr") as string || null,
    wholesalePriceUsd: formData.get("wholesalePriceUsd") as string || null,
    
    // Flags for B2B/B2C Logic
    isInquiryOnly: formData.get("isInquiryOnly") === "on",
    isWholesaleOnly: formData.get("isWholesaleOnly") === "on",
    isRetailEnabled: formData.get("isRetailEnabled") === "on",

    category: (formData.get("category") as ProductCategory) || "SPECIALTY_ARABICA",
    stockQuantity: parseInt(formData.get("stockQuantity") as string) || 0,
    
    scaScore: formData.get("scaScore") as string,
    originRegion: formData.get("originRegion") as string,
    processingMethod: formData.get("processingMethod") as string,
    roastLevel: parseInt(formData.get("roastLevel") as string) || 3,
    
    imageUrls: JSON.parse(formData.get("imageUrls") as string || "[]") as string[],
    slug,
    updatedAt: new Date(),
  };

  try {
    // Check if UUID exists (Update) or if it's a new entry (Insert)
    if (id && id.length > 10) {
      await db.update(products).set(data).where(eq(products.id, id));
    } else {
      await db.insert(products).values(data);
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop"); 
  } catch (error: unknown) {
    console.error("Institutional DB Error:", error);
    return { error: "Name must be unique or database connection failed." };
  }

  redirect("/admin/products");
}