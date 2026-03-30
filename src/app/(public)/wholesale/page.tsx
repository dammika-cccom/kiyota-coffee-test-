import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products, users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { SensoryProduct } from "@/types/store";
import WholesaleClient from "./WholesaleClient";

export default async function WholesaleShopPage() {
  const session = await getSession();
  
  // 1. INSTITUTIONAL SECURITY GATE
  if (!session || (session.role !== "WHOLESALE_USER" && session.role !== "SUPER_ADMIN")) {
    redirect("/login?returnTo=/wholesale");
  }

  // 2. PARALLEL DATA AGGREGATION
  const [partnerResult, rawProducts] = await Promise.all([
    db.select().from(users).where(eq(users.id, session.userId)).limit(1),
    db.select().from(products).where(
      and(
        eq(products.status, "ACTIVE"),
        or(eq(products.visibility, "B2B_ONLY"), eq(products.visibility, "BOTH"))
      )
    )
  ]);

  const partner = partnerResult[0];
  if (!partner) redirect("/login");

  // 3. STRICT TYPE MAPPING (Zero-Any)
  const catalog: SensoryProduct[] = rawProducts.map(p => ({
    ...p,
    imageUrls: (p.imageUrls as string[] | null) ?? [],
    category: p.category as SensoryProduct["category"],
    pricingLogic: p.pricingLogic as SensoryProduct["pricingLogic"],
    displayMode: p.displayMode as SensoryProduct["displayMode"],
    status: p.status as SensoryProduct["status"],
    stockQuantity: p.stockQuantity ?? 0,
    moq: p.moq ?? 1
  }));

  return (
    <WholesaleClient 
      catalog={catalog} 
      partner={partner} 
      userRole={session.role} 
    />
  );
}