import { db } from "@/db";
import { farms } from "@/db/schema";
import { eq } from "drizzle-orm"; // FIXED: Added eq import
import Image from "next/image";
import { CoffeeIcon, TrendingUpIcon } from "@/components/ui/icons"; // FIXED: Removed MapPinIcon

export default async function SourcePage() {
  // FIXED: Correct Drizzle where syntax
  const farmNetwork = await db.select().from(farms).where(eq(farms.isPubliclyVisible, true));

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto border-b border-stone-100">
        <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-4">Vertical Supply Chain</h5>
        <h1 className="text-5xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter leading-none">
          The Source.
        </h1>
        <p className="text-stone-500 text-lg mt-8 max-w-2xl leading-relaxed italic font-light">
          From our nursery beds in Matale to over 4,500 smallholder families across the central highlands. 
          We don&apos;t just buy coffee; we facilitate growth.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {farmNetwork.map((farm, idx) => (
          <div key={farm.id} className={`flex flex-col lg:flex-row items-center gap-20 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 relative aspect-[4/5] w-full bg-stone-100 rounded-sm overflow-hidden shadow-2xl">
               <Image 
                 src={farm.featuredImageUrl || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e"} 
                 alt={farm.region} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               />
               <div className="absolute bottom-10 left-10 text-white z-10">
                  <p className="text-3xl font-serif italic">{farm.region}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Elev. {farm.elevation}</p>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent" />
            </div>

            <div className="flex-1 space-y-10">
               <div className="space-y-4">
                  <h3 className="text-3xl font-serif italic text-[#2C1810]">Traceability Profile</h3>
                  <p className="text-stone-500 leading-loose text-justify font-light">{farm.description}</p>
               </div>

               <div className="grid grid-cols-2 gap-8 border-t border-stone-100 pt-10">
                  <div>
                    <p className="text-4xl font-bold text-[#2C1810] tracking-tighter">{farm.farmerCount}</p>
                    <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest mt-2 flex items-center gap-2">
                       <TrendingUpIcon className="w-3 h-3 text-[#D4AF37]" /> Partner Families
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-[#2C1810] tracking-tighter">{(Number(farm.nurseryPlants || 0) / 1000).toFixed(0)}k</p>
                    <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest mt-2 flex items-center gap-2">
                       <CoffeeIcon className="w-3 h-3 text-[#D4AF37]" /> Nursery Seedlings
                    </p>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}