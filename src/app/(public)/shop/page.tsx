import { Metadata } from "next";
import { db } from "@/db";
import { products, farms } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/session";
import StorefrontManager from "./StorefrontManager";
import { SensoryProduct } from "@/types/store";
import Link from "next/link";
import { GlobeIcon, MoveRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Retail Roastery | Kiyota Coffee",
  description: "B2C Premium specialty roasts delivered from Matale.",
};

export default async function OnlineShopPage() {
  const session = await getSession();
  const userRole = session?.role || "GUEST";

  const [rawProducts, statsResult] = await Promise.all([
    db.select().from(products).where(
      and(
        eq(products.isRetailEnabled, true),
        eq(products.status, "ACTIVE")
      )
    ),
    db.select({
      totalPlants: sql<number>`sum(${farms.nurseryPlants})`
    }).from(farms)
  ]);
  
  const allProducts: SensoryProduct[] = rawProducts.map(p => ({
    ...p,
    imageUrls: (p.imageUrls as string[] | null) ?? [], 
    category: p.category as SensoryProduct["category"],
    pricingLogic: p.pricingLogic as SensoryProduct["pricingLogic"],
    displayMode: p.displayMode as SensoryProduct["displayMode"],
    status: p.status as SensoryProduct["status"],
    stockQuantity: p.stockQuantity ?? 0
  }));

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40">
      {/* RETAIL HERO */}
      <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h5 className="text-[10px] uppercase tracking-[0.6em] font-black text-[#D4AF37]">The Matale Collection</h5>
        <h1 className="text-6xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter">Retail Shop.</h1>
      </section>

      {/* B2B BRIDGE: LEAD GEN FOR B2C USERS */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
         <div className="bg-[#2C1810] p-10 rounded-sm text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-6">
               <GlobeIcon className="w-12 h-12 text-[#D4AF37] opacity-20" />
               <div>
                  <h3 className="text-xl font-serif italic">Wholesale Partnerships</h3>
                  <p className="text-xs text-stone-400 uppercase font-black tracking-widest mt-1">Institutional Pricing & Bulk Logistics</p>
               </div>
            </div>
            <Link href="/wholesale" className="px-8 py-4 bg-[#D4AF37] text-[#2C1810] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3">
               Request Wholesale Access <MoveRightIcon className="w-4 h-4" />
            </Link>
         </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-6">
        <StorefrontManager 
          initialProducts={allProducts} 
          nurseryCount={Number(statsResult[0]?.totalPlants || 405000)}
          userRole={userRole} 
        />
      </main>
    </div>
  );
}