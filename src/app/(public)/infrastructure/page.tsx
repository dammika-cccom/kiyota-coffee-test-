import { db } from "@/db";
import { infrastructure } from "@/db/schema";
import Image from "next/image";
import { FactoryIcon, AwardIcon, MapPinIcon, TrendingUpIcon } from "@/components/ui/icons";

export default async function InfrastructurePage() {
  const facilities = await db.select().from(infrastructure);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. INDUSTRIAL HERO */}
      <section className="relative h-[60vh] flex items-center bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 grayscale">
          <Image 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" 
            fill className="object-cover" alt="Processing Plant" priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
           <div className="max-w-3xl space-y-6">
              <h5 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em]">Industrial Strength</h5>
              <h1 className="text-white text-5xl md:text-8xl font-serif italic leading-none tracking-tighter">
                Processing <br/> Power.
              </h1>
              <p className="text-stone-400 text-lg font-light leading-relaxed">
                A vertically integrated supply chain featuring state-of-the-art Japanese roasting technology and high-capacity milling hubs.
              </p>
           </div>
        </div>
      </section>

      {/* 2. CAPACITY METRICS */}
      <div className="bg-[#2C1810] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
           {[
             { label: "Milling Capacity", val: "1,200 MT", sub: "Annual Raw Material" },
             { label: "Roasting Precision", val: "800 MT", sub: "Finished Product" },
             { label: "Storage Capacity", val: "2,500 MT", sub: "Climate Controlled" }
           ].map((stat, i) => (
             <div key={i} className="space-y-2 border-l border-white/10 pl-8">
                <span className="text-[#D4AF37] font-mono text-3xl font-bold">{stat.val}</span>
                <p className="text-white text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-stone-500 text-[10px] font-medium italic">{stat.sub}</p>
             </div>
           ))}
        </div>
      </div>

      {/* 3. FACILITY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-24">
        {facilities.map((hub, idx) => (
          <div key={hub.id} className={`flex flex-col lg:flex-row gap-20 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 relative aspect-video w-full bg-stone-100 rounded-sm overflow-hidden shadow-2xl">
               <Image src={hub.imageUrl || ""} alt={hub.facilityName} fill className="object-cover" />
               <div className="absolute top-6 left-6 bg-[#2C1810] text-[#D4AF37] px-4 py-1 text-[9px] font-black uppercase tracking-widest">
                  {hub.type}
               </div>
            </div>

            <div className="flex-1 space-y-8">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-stone-400">
                    <MapPinIcon className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{hub.location}</span>
                  </div>
                  <h3 className="text-4xl font-serif italic text-[#2C1810]">{hub.facilityName}</h3>
               </div>

               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-stone-50 rounded-full"><FactoryIcon className="w-5 h-5 text-[#D4AF37]" /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">Machinery & Tech</p>
                        <p className="text-sm text-[#2C1810] font-medium">{hub.machinerySpecs}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-stone-50 rounded-full"><AwardIcon className="w-5 h-5 text-[#D4AF37]" /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">Compliance</p>
                        <div className="flex gap-2 mt-1">
                           {(hub.certifications as string[])?.map(cert => (
                             <span key={cert} className="text-[9px] font-bold bg-stone-100 px-2 py-0.5 rounded-sm">{cert}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <button className="bg-[#2C1810] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all">
                  Request Technical Audit
               </button>
            </div>
          </div>
        ))}
      </section>

      {/* 4. QUALITY CONTROL STORY */}
      <section className="bg-[#FAF9F6] py-32 px-6">
         <div className="max-w-4xl mx-auto text-center space-y-10">
            <TrendingUpIcon className="w-12 h-12 text-[#D4AF37] mx-auto opacity-30" />
            <h2 className="text-4xl md:text-6xl font-serif italic text-[#2C1810]">Japanese Precision <br/> at every stage.</h2>
            <p className="text-stone-500 text-lg font-light leading-relaxed italic">
               Our supply chain is managed by a veteran from the Japan Fair Trade Committee (JFTC). 
               Every 60kg export bag is moisture-tested, optical-sorted, and vacuum-sealed to maintain cupping scores during transit.
            </p>
         </div>
      </section>
    </div>
  );
}