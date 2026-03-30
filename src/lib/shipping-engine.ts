import { db } from "@/db";
import { shippingRates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function calculateB2CShipping(totalWeightGrams: number, country: string) {
  // 1. Add a 10% buffer for packaging materials (Box, Tape, Bubble wrap)
  const grossWeight = totalWeightGrams * 1.1;
  const weightInKg = Math.ceil(grossWeight / 1000);

  // 2. Fetch rates from DB
  const [rate] = await db.select().from(shippingRates).where(eq(shippingRates.region, country === "Sri Lanka" ? "SRI_LANKA" : "INTERNATIONAL")).limit(1);

  const basePrice = parseFloat(rate?.firstKgRate || "500");
  const additionalPrice = parseFloat(rate?.additionalKgRate || "150");

  // 3. Logic: First KG + (Remaining KGs * Additional Rate)
  const totalShipping = basePrice + (Math.max(0, weightInKg - 1) * additionalPrice);

  return {
    shippingCost: totalShipping,
    grossWeightGrams: grossWeight,
    kgCharged: weightInKg,
    currency: country === "Sri Lanka" ? "LKR" : "USD"
  };
}