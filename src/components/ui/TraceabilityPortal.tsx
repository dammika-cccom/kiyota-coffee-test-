"use client";

import { useState } from "react";
import { traceLot } from "@/app/actions/trace";
import { SearchIcon, XIcon, AwardIcon, FactoryIcon, MapPinIcon } from "@/components/ui/icons";

// --- FIXED: Strict Interface instead of 'any' ---
interface TraceResult {
  lot: {
    lotNumber: string;
    moistureLevel: string | null;
    density: string | null;
    roastDate: Date | null;
    tastingNotes: string | null;
    inspector: string | null;
    scaScore: string | null;
    opticalSorterStatus: string | null;
  };
  productName: string | null;
  region: string | null;
  elevation: string | null;
}

export default function TraceabilityPortal() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TraceResult | null>(null); // FIXED: Removed 'any'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const data = await traceLot(query);
    if (data) {
      setResult(data as TraceResult);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-[#D4AF37] transition-all" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text" 
          placeholder="Enter Lot # (e.g., MT-2026-04)" 
          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-6 pl-14 pr-36 text-white text-xs outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/10 transition-all placeholder:text-stone-500"
        />
        <button 
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#D4AF37] text-[#2C1810] px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Trace Origin"}
        </button>
      </form>

      {error && <p className="text-[#D4AF37] text-[10px] font-bold uppercase mt-4 text-center animate-pulse">Lot Number not recognized by roastery.</p>}

      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2C1810]/95 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-[#1A1A1A] p-8 flex justify-between items-center text-white">
               <div>
                  <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Technical Spec Sheet</p>
                  <h3 className="text-2xl font-serif italic mt-1">Batch {result.lot.lotNumber}</h3>
               </div>
               <button onClick={() => setResult(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><XIcon className="w-6 h-6" /></button>
            </div>

            <div className="p-10 grid md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="flex gap-4">
                     <MapPinIcon className="w-5 h-5 text-[#D4AF37]" />
                     <div>
                        <p className="text-[9px] font-black uppercase text-stone-400">Origin Region</p>
                        <p className="text-sm font-bold text-[#2C1810]">{result.region} ({result.elevation})</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <AwardIcon className="w-5 h-5 text-[#D4AF37]" />
                     <div>
                        <p className="text-[9px] font-black uppercase text-stone-400">SCA Quality Score</p>
                        <p className="text-sm font-bold text-[#2C1810]">{result.lot.scaScore} / 100</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <FactoryIcon className="w-5 h-5 text-[#D4AF37]" />
                     <div>
                        <p className="text-[9px] font-black uppercase text-stone-400">Optical Sorter Quality</p>
                        <p className="text-sm font-bold text-green-600 uppercase">{result.lot.opticalSorterStatus}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6 bg-stone-50 p-6 rounded-sm">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                     <span className="text-[9px] font-black text-stone-400 uppercase">Moisture</span>
                     <span className="text-xs font-mono font-bold">{result.lot.moistureLevel}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                     <span className="text-[9px] font-black text-stone-400 uppercase">Density</span>
                     <span className="text-xs font-mono font-bold">{result.lot.density}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                     <span className="text-[9px] font-black text-stone-400 uppercase">Roast Date</span>
                     <span className="text-xs font-mono font-bold">{result.lot.roastDate ? new Date(result.lot.roastDate).toLocaleDateString() : 'Pending'}</span>
                  </div>
                  <div className="pt-4">
                     <p className="text-[9px] font-black text-stone-400 uppercase">Sensory Note</p>
                     {/* FIXED: Escaped entities below */}
                     <p className="text-xs italic text-stone-600 mt-1 leading-relaxed">&quot;{result.lot.tastingNotes}&quot;</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 border-t border-stone-100 flex justify-between items-center bg-stone-50/50">
               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest italic">Certified by {result.lot.inspector}</p>
               <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-[#2C1810] uppercase">JFTC Approved</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}