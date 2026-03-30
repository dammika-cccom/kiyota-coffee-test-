"use server";

import { db } from "@/db";
import { lots, products, farms } from "@/db/schema";
import { eq } from "drizzle-orm";
export const runtime = 'edge';
/**
 * INSTITUTIONAL TYPE INFERENCE
 * Ensures the trace result matches our schema exactly.
 */
export type TraceResult = {
  lot: typeof lots.$inferSelect;
  productName: string | null;
  region: string | null;
  elevation: string | null;
  nurseryPlants: number | null;
};

/**
 * TRACE LOT ACTION
 * Performs a 3-way join to provide a "Seed-to-Cup" audit.
 */
export async function traceLot(lotNumber: string): Promise<TraceResult | null> {
  if (!lotNumber || lotNumber.length < 3) return null;

  try {
    const result = await db
      .select({
        lot: lots,
        productName: products.name,
        region: farms.region,
        elevation: farms.elevation,
        nurseryPlants: farms.nurseryPlants,
      })
      .from(lots)
      .leftJoin(products, eq(lots.productId, products.id))
      .leftJoin(farms, eq(lots.farmId, farms.id))
      .where(eq(lots.lotNumber, lotNumber.trim().toUpperCase()))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    // Institutional Audit: Logging error to satisfy ESLint while maintaining security
    console.error("Traceability Logic Breach:", error);
    return null;
  }
}