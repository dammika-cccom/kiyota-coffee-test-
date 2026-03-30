"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ProductFormState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  // FIXED: Cast to specific string type instead of 'any'
  const category = formData.get("category") as "SPECIALTY_ARABICA" | "GREEN_BEANS" | "CEYLON_SPICES" | "EQUIPMENT";
  const weightGrams = parseInt(formData.get("weightGrams") as string);
  
  const price = formData.get("price") as string || null;
  const priceUsd = formData.get("priceUsd") as string || null;
  const wholesalePriceLkr = formData.get("wholesalePriceLkr") as string || null;
  const wholesalePriceUsd = formData.get("wholesalePriceUsd") as string || null;

  const altitude = formData.get("altitude") as string;
  const scaScore = formData.get("scaScore") as string;
  const originRegion = formData.get("originRegion") as string;
  const processingMethod = formData.get("processingMethod") as string;
  const roastLevel = parseInt(formData.get("roastLevel") as string) || 3;

  const isInquiryOnly = formData.get("isInquiryOnly") === "on";
  const isWholesaleOnly = formData.get("isWholesaleOnly") === "on";

  const imageUrlsJson = formData.get("imageUrls") as string;
  const imageUrls = imageUrlsJson ? JSON.parse(imageUrlsJson) as string[] : [];

  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  try {
    await db.insert(products).values({
      name,
      description,
      category,
      weightGrams,
      price,
      priceUsd,
      wholesalePriceLkr,
      wholesalePriceUsd,
      altitude,
      scaScore,
      originRegion,
      processingMethod,
      roastLevel,
      isInquiryOnly,
      isWholesaleOnly,
      imageUrls,
      slug,
    });

    revalidatePath("/admin/products");
  } catch (error: unknown) {
    // FIXED: Proper type guarding instead of 'any'
    if (error instanceof Error) {
      console.error("DB Error:", error.message);
      if (error.message.includes("unique constraint")) {
        return { error: "A product with this name already exists." };
      }
    }
    return { error: "Failed to save product. Check all required fields." };
  }

  redirect("/admin/products");
}