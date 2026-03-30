import { db } from "@/db";
import { products } from "@/db/schema";
import StorefrontManager from "./StorefrontManager";
import { SensoryProduct } from "@/types/store";

export default async function ShopPage() {
  // 1. Fetch products from D-Drive Database
  // 2. Cast to strict Sensory type to satisfy Zero-Any standard
  const allProducts = (await db.select().from(products)) as SensoryProduct[];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40">
      {/* CINEMATIC SHOP HEADER */}
      <section className="pt-40 pb-24 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h5 className="text-[10px] uppercase tracking-[0.8em] font-black text-[#D4AF37] animate-in slide-in-from-bottom duration-700">
          The Master Collection
        </h5>
        <h1 className="text-6xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter leading-[0.9]">
          Precision <br /> Roastery.
        </h1>
        <div className="h-[1px] w-24 bg-[#D4AF37] mx-auto my-8 opacity-40" />
        <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto italic">
          From micro-lot Arabica cupped at 88+ SCA to bulk export-grade green beans for international roasteries. 
          The intersection of Japanese technology and Sri Lankan soul.
        </p>
      </section>

      {/* INTERACTIVE MANAGER GRID */}
      <div className="max-w-7xl mx-auto px-6">
        <StorefrontManager products={allProducts} />
      </div>
    </div>
  );
}