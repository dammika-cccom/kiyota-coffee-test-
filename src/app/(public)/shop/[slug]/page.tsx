import { Metadata } from "next";
import { db } from "@/db";
import { products, farms } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductPurchaseSection from "./ProductPurchaseSection";
import { 
  MapPinIcon, MoveLeftIcon, AwardIcon, GlobeIcon, 
  CoffeeIcon, TrendingUpIcon, ShieldCheckIcon 
} from "@/components/ui/icons";
import { getSession } from "@/lib/session";

/**
 * INSTITUTIONAL DATA TYPES
 */
export type ProductRecord = typeof products.$inferSelect;
type FarmRecord = typeof farms.$inferSelect;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProducts = await db.select({ slug: products.slug }).from(products).where(eq(products.isRetailEnabled, true));
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) return { title: "Roast Not Found" };
  return { 
    title: `${product.name} | Kiyota Roastery`, 
    description: product.description || `Traceable Ceylon Arabica from ${product.originRegion}.` 
  };
}

export const revalidate = 1800;

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSession();
  const isWholesalePartner = session?.role === "WHOLESALE_USER" || session?.role === "SUPER_ADMIN";

  const [productData] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!productData) notFound();

  // Parallel Fetch: Origin Intelligence & Cross-Selling
  const [farmData, recommendedData] = await Promise.all([
    db.select().from(farms).where(eq(farms.region, productData.originRegion || "")).limit(1),
    db.select().from(products)
      .where(and(
        eq(products.category, productData.category), 
        ne(products.id, productData.id),
        eq(products.isRetailEnabled, true)
      ))
      .limit(3)
  ]);

  const originFarm = farmData[0] as FarmRecord | undefined;
  const recommended = recommendedData as ProductRecord[];
  const imageUrls = (productData.imageUrls as string[] | null) ?? [];
  const displayImage = imageUrls[0] || "https://images.unsplash.com/photo-1559056191-75902420fef5";

  return (
    <div className="bg-white min-h-screen pb-40 animate-in fade-in duration-1000">
      <nav className="max-w-7xl mx-auto px-6 pt-32 pb-8 flex justify-between items-center border-b border-stone-50">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#2C1810] transition-colors group">
          <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Roastery Store
        </Link>
        <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em] italic">
           Institutional Traceability Protocol: A-Class
        </span>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 pt-16">
        {/* LEFT: VISUALS & TECHNICAL DATA */}
        <div className="space-y-8">
          <div className="aspect-square bg-[#FAF9F6] relative rounded-sm overflow-hidden group shadow-2xl border border-stone-100">
            <Image src={displayImage} alt={productData.name} fill priority className="object-cover mix-blend-multiply opacity-95 group-hover:scale-105 transition-all duration-[3000ms]" sizes="(max-width: 768px) 100vw, 50vw" />
            {productData.scaScore && (
              <div className="absolute top-8 left-8 bg-[#2C1810] text-[#D4AF37] px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3">
                 <AwardIcon className="w-4 h-4" /> Cupping Score: {productData.scaScore}
              </div>
            )}
          </div>
          
          {/* B2B TECHNICAL DOSSIER - LOCKED TO PARTNERS */}
          {isWholesalePartner && (
            <div className="bg-stone-900 p-10 text-white rounded-sm space-y-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
               <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <ShieldCheckIcon className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Laboratory Specification Sheet</h4>
               </div>
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                     <p className="text-[8px] uppercase text-stone-500 font-bold">Moisture Level</p>
                     <p className="text-xl font-mono text-stone-200">{productData.moistureContent || '11.2%'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] uppercase text-stone-500 font-bold">Bean Density</p>
                     <p className="text-xl font-mono text-stone-200">{productData.specifications || '710g/L'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] uppercase text-stone-500 font-bold">Sort Protocol</p>
                     <p className="text-sm font-black text-stone-200 uppercase">Japanese Optical V3</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] uppercase text-stone-500 font-bold">Elevation</p>
                     <p className="text-sm font-bold text-stone-200 uppercase">{productData.altitude || '1500m'}</p>
                  </div>
               </div>
            </div>
          )}

          {originFarm && (
            <div className="bg-[#FAF9F6] p-10 border-l-4 border-[#D4AF37] space-y-6 shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <TrendingUpIcon className="w-4 h-4 text-[#D4AF37]" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Origin Analytics</h4>
                  </div>
                  <div className="flex gap-12">
                     <div>
                       <p className="text-2xl font-serif italic text-[#2C1810]">{originFarm.region}</p>
                       <p className="text-[9px] text-stone-400 font-bold uppercase mt-1 tracking-widest">Master Nursery Hub</p>
                     </div>
                     <div className="border-l border-stone-200 pl-12">
                       <p className="text-2xl font-serif italic text-[#2C1810]">{(Number(originFarm.nurseryPlants || 0) / 1000).toFixed(0)}k</p>
                       <p className="text-[9px] text-stone-400 font-bold uppercase mt-1 tracking-widest">Seedlings</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* RIGHT: COMMERCIAL CONTENT */}
        <div className="flex flex-col justify-center space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-3 text-[#D4AF37]">
               <MapPinIcon className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">{productData.originRegion || 'Highland'} Estates</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic text-[#2C1810] leading-none tracking-tighter">{productData.name}</h1>
            <p className="text-stone-500 text-xl font-light leading-relaxed italic max-w-lg">&quot;{productData.description}&quot;</p>
          </header>

          <ProductPurchaseSection product={productData as ProductRecord} userRole={session?.role || "GUEST"} />

          <div className="pt-12 grid grid-cols-3 gap-8 border-t border-stone-50 opacity-60">
            <div className="flex flex-col items-center text-center gap-2"><GlobeIcon className="w-5 h-5 text-[#2C1810]" /><span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Global Export</span></div>
            <div className="flex flex-col items-center text-center gap-2"><CoffeeIcon className="w-5 h-5 text-[#2C1810]" /><span className="text-[8px] font-black uppercase tracking-widest text-stone-400">JFTC Protocol</span></div>
            <div className="flex flex-col items-center text-center gap-2"><TrendingUpIcon className="w-5 h-5 text-[#2C1810]" /><span className="text-[8px] font-black uppercase text-stone-400">Direct Trade</span></div>
          </div>
        </div>
      </main>

      {/* RECOMMENDED SERIES */}
      {recommended.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-40">
          <div className="flex justify-between items-end border-b border-stone-100 pb-8 mb-16">
              <h2 className="text-4xl font-serif italic text-[#2C1810]">The Curated Series</h2>
              <Link href="/shop" className="text-[10px] font-black uppercase text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 hover:text-[#2C1810] transition-all">Browse All Roasts</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {recommended.map(item => (
              <Link href={`/shop/${item.slug}`} key={item.id} className="group space-y-8">
                <div className="aspect-[4/5] w-full bg-[#FAF9F6] relative overflow-hidden rounded-sm group-hover:shadow-2xl transition-all duration-700">
                  <Image src={(item.imageUrls as string[])?.[0] || displayImage} alt={item.name} fill sizes="33vw" className="object-cover mix-blend-multiply transition-all duration-1000 group-hover:scale-110" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-2xl font-serif italic text-[#2C1810] group-hover:text-[#D4AF37] transition-colors">{item.name}</h4>
                  <p className="text-[#D4AF37] font-black text-xs uppercase tracking-widest">LKR {Number(item.priceLkr || 0).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}