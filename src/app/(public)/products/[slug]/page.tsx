import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AwardIcon, GlobeIcon, CoffeeIcon, MapPinIcon, MoveLeftIcon } from "@/components/ui/icons";
import SensoryMeter from "@/components/ui/SensoryMeter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch Product from D-Drive Database
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (!product) return notFound();

  // Parse Flavor Profile (JSONB)
  const flavors = (product.flavorProfile as string[]) || [];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. NAVIGATION & BREADCRUMB */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#2C1810] transition-colors group">
          <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Roastery
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 pb-40">
        
        {/* 2. VISUAL SECTION (Left) */}
        <section className="space-y-8">
          <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden rounded-sm group">
            <Image 
              src={(product.imageUrls as string[])?.[0] || "https://images.unsplash.com/photo-1559056191-75902420fef5?auto=format&fit=crop&q=80&w=1200"}
              alt={product.name}
              fill
              priority
              className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000"
            />
            {product.scaScore && (
              <div className="absolute top-8 left-8 bg-[#2C1810] text-[#D4AF37] px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3">
                <AwardIcon className="w-4 h-4" /> Specialty Grade {product.scaScore}
              </div>
            )}
          </div>
          
          {/* Flavor Notes Mosaic */}
          <div className="flex flex-wrap gap-3">
            {flavors.map((note) => (
              <span key={note} className="px-5 py-2 border border-stone-100 text-[11px] font-bold uppercase tracking-widest text-stone-500 rounded-full bg-[#FAF9F6]">
                {note}
              </span>
            ))}
          </div>
        </section>

        {/* 3. CONTENT SECTION (Right) */}
        <section className="space-y-12">
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-[#D4AF37]">
               <MapPinIcon className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">{product.originRegion} Highlands</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic text-[#2C1810] leading-none tracking-tighter">
              {product.name}
            </h1>
            <p className="text-stone-500 font-light leading-relaxed text-lg italic">
              &quot;{product.description}&quot;
            </p>
          </header>

          {/* SENSORY DOSSIER (The Market Leader Feature) */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 border-y border-stone-100 py-10">
             <SensoryMeter label="Roast Intensity" value={product.roastLevel || 3} />
             <SensoryMeter label="Acidity" value={3} /> {/* Dynamic values can be added to schema later */}
             <SensoryMeter label="Body" value={4} />
             <SensoryMeter label="Sweetness" value={4} />
          </div>

          {/* TECHNICAL SPECS (For Professional Buyers) */}
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-stone-300">Processing Method</p>
                <p className="text-sm font-bold text-[#2C1810]">{product.processingMethod}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-stone-300">Altitude</p>
                <p className="text-sm font-bold text-[#2C1810]">{product.altitude}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-stone-300">Varietal</p>
                <p className="text-sm font-bold text-[#2C1810]">Typica & Heirloom</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-stone-300">Package Weight</p>
                <p className="text-sm font-bold text-[#2C1810]">{product.weightGrams}G</p>
             </div>
          </div>

          {/* CALL TO ACTION */}
          <div className="pt-10 space-y-6">
            {product.isInquiryOnly ? (
              <Link 
                href="/wholesale"
                className="w-full py-6 bg-[#2C1810] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl"
              >
                <GlobeIcon className="w-5 h-5" /> Request Export Quotation
              </Link>
            ) : (
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] font-black uppercase text-stone-400">Retail Price</p>
                    <p className="text-4xl font-serif italic text-[#D4AF37]">LKR {product.priceLkr}</p>
                 </div>
                 <button className="w-full py-6 bg-[#2C1810] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-500 shadow-2xl cursor-pointer">
                    Add to Shopping Bag
                 </button>
              </div>
            )}
            
            <p className="text-center text-[10px] text-stone-400 uppercase font-bold tracking-widest">
              Free Delivery within Colombo for orders over 5,000 LKR
            </p>
          </div>
        </section>
      </main>

      {/* 4. BREWING MASTERY MINI-SECTION */}
      <section className="bg-[#FAF9F6] py-24">
         <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <CoffeeIcon className="w-12 h-12 text-[#D4AF37] mx-auto opacity-40" />
            <h2 className="text-3xl font-serif italic text-[#2C1810]">The Perfect Extraction</h2>
            <p className="text-stone-500 text-sm leading-loose max-w-lg mx-auto font-light">
              For this {product.processingMethod} process coffee, we recommend a Japanese V60 pour-over with a 1:15 ratio at 92°C to unlock the delicate {flavors[0]} notes.
            </p>
            <Link href="/brew-guide" className="inline-block text-[10px] font-black uppercase tracking-widest border-b border-[#D4AF37] pb-1">View Full Brew Guide</Link>
         </div>
      </section>
    </div>
  );
}