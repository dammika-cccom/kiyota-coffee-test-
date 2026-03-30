import { traceLot, type TraceResult } from "@/app/actions/trace";
import Image from "next/image";
import { 
  SearchIcon, AwardIcon, MapPinIcon, 
  TrendingUpIcon, CoffeeIcon, ShieldCheckIcon 
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ lot?: string }>;

export default async function TraceabilityPortalPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const query = await searchParams;
  const result: TraceResult | null = query.lot ? await traceLot(query.lot) : null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40 animate-in fade-in duration-1000">
      <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto space-y-10">
        <header className="space-y-4">
           <h5 className="text-[10px] uppercase tracking-[0.6em] font-black text-[#D4AF37]">Vertical Transparency</h5>
           <h1 className="text-5xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter">Trace Your Lot.</h1>
           <p className="text-stone-400 text-xs uppercase font-bold tracking-widest max-w-sm mx-auto italic">Authenticate your Kiyota Roast origin data.</p>
        </header>

        <form action="/trace" method="GET" className="relative max-w-lg mx-auto group">
           <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
           <input 
             name="lot"
             placeholder="ENTER BATCH ID (QA-V1)" 
             defaultValue={query.lot || ""}
             className="w-full bg-white border border-stone-200 rounded-full pl-16 pr-8 py-6 text-sm font-black uppercase outline-none shadow-2xl"
           />
        </form>
      </section>

      <main className="max-w-6xl mx-auto px-6">
        {result ? (
          <div className="grid lg:grid-cols-5 gap-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-2 bg-[#2C1810] p-10 rounded-sm text-white space-y-10 shadow-2xl relative overflow-hidden">
               <CoffeeIcon className="absolute -right-10 -bottom-10 w-48 h-48 opacity-5 -rotate-12" />
               <div className="space-y-2 relative z-10">
                  <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">Batch Protocol</p>
                  <h2 className="text-4xl font-serif italic">{result.lot.lotNumber}</h2>
               </div>
               <div className="grid grid-cols-1 gap-6 pt-8 border-t border-white/5 relative z-10">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                     <span className="text-[10px] font-bold text-stone-500 uppercase">SCA Score</span>
                     <span className="text-xl font-black text-[#D4AF37]">{result.lot.scaScore || "88.0"}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                     <span className="text-[10px] font-bold text-stone-500 uppercase">Moisture</span>
                     <span className="text-xl font-black">{result.lot.moistureLevel || "11.2%"}</span>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-3 space-y-10">
               <div className="bg-white border border-stone-100 p-10 rounded-sm shadow-sm flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-[#FAF9F6] shadow-xl">
                     <Image src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad" alt="Farm" fill className="object-cover" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <MapPinIcon className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Harvest Origin</span>
                     </div>
                     <h3 className="text-4xl font-serif italic text-[#2C1810]">{result.region || "Matale Central"}</h3>
                     <p className="text-sm text-stone-500 leading-relaxed italic">&quot;{result.lot.tastingNotes || 'Quality-assured heritage profile.'}&quot;</p>
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm space-y-4">
                     <TrendingUpIcon className="w-6 h-6 text-[#D4AF37] opacity-20" />
                     <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Nursery Capacity</p>
                     <p className="text-3xl font-serif italic text-[#2C1810]">{(Number(result.nurseryPlants || 0)/1000).toFixed(0)}k Seedlings</p>
                  </div>
                  <div className="bg-[#FAF9F6] border border-[#D4AF37]/20 p-8 rounded-sm space-y-4 relative overflow-hidden">
                     <ShieldCheckIcon className="w-12 h-12 text-[#D4AF37] absolute -right-2 -bottom-2 opacity-10" />
                     <AwardIcon className="w-6 h-6 text-[#D4AF37]" />
                     <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">Authentication</p>
                     <p className="text-sm font-bold text-[#2C1810]">Japanese JFTC Compliant</p>
                  </div>
               </div>
            </div>
          </div>
        ) : query.lot ? (
          <div className="py-20 text-center animate-in fade-in duration-500">
             <h3 className="text-xl font-serif italic text-red-600">Batch Not Found</h3>
             <p className="text-xs text-stone-400 mt-2 uppercase font-bold">Please verify the ID on your bag.</p>
          </div>
        ) : (
           <div className="py-20 text-center opacity-20 grayscale">
              <Image src="/images/logo.png" alt="Kiyota" width={120} height={40} className="mx-auto mb-4" />
              <p className="text-[10px] uppercase font-black tracking-widest">Institutional Registry Locked</p>
           </div>
        )}
      </main>
    </div>
  );
}