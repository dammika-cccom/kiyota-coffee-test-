import { db } from "@/db";
import { products, lots, shippingRates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductEditor, { ProductData } from "../ProductEditor";
import { AwardIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

// INSTITUTIONAL TYPE INFERENCE
type LotRecord = typeof lots.$inferSelect;
type RateRecord = typeof shippingRates.$inferSelect;
type Params = Promise<{ id: string }>;

export default async function ProductEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const isNew = id === "new";

  const [productResult, allLots, allRates] = await Promise.all([
    !isNew ? db.select().from(products).where(eq(products.id, id)).limit(1) : [null],
    db.select().from(lots),
    db.select().from(shippingRates)
  ]);

  if (!isNew && !productResult[0]) notFound();

  const raw = productResult[0];
  const initialData: ProductData | undefined = raw ? {
    ...raw,
    imageUrls: raw.imageUrls as string[] | null,
    category: raw.category as ProductData["category"],
    pricingLogic: raw.pricingLogic as ProductData["pricingLogic"],
    displayMode: raw.displayMode as ProductData["displayMode"]
  } : undefined;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-100 pb-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AwardIcon className="w-3 h-3 text-[#D4AF37]" />
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Catalog Studio</h5>
          </div>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">{isNew ? "Initialize Asset" : `Edit: ${initialData?.name}`}</h2>
        </div>
      </header>

      {/* FIXED: Passed strictly typed records instead of 'any' */}
      <ProductEditor 
        initialData={initialData} 
        availableLots={allLots as LotRecord[]} 
        shippingRates={allRates as RateRecord[]} 
      />
    </div>
  );
}