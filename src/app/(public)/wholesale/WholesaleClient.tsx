"use client";

import { useState, useMemo } from "react";
import { 
  GlobeIcon, TrendingUpIcon, ShieldCheckIcon, 
  AwardIcon, LayoutIcon, ListIcon, MoveRightIcon,
  FactoryIcon, RefreshCwIcon
} from "@/components/ui/icons";
import Link from "next/link";
import Image from "next/image";
import BulkMatrix from "./BulkMatrix";
import ProductCard from "@/components/shop/ProductCard";
import type { SensoryProduct } from "@/types/store";
import type { users } from "@/db/schema";

type UserRecord = typeof users.$inferSelect;

interface WholesaleClientProps {
  catalog: SensoryProduct[];
  partner: UserRecord;
  userRole: string;
}

export default function WholesaleClient({ catalog, partner, userRole }: WholesaleClientProps) {
  const [viewMode, setViewMode] = useState<"GALLERY" | "MATRIX">("GALLERY");
  const [stagedIds, setStagedIds] = useState<string[]>([]);

  // Calculate Credit Milestone Utilization
  const milestone = useMemo(() => {
    const limit = Number(partner.creditLimit || 0);
    const balance = Number(partner.creditBalance || 0);
    if (limit <= 0) return 0;
    return ((limit - balance) / limit) * 100;
  }, [partner]);

  const toggleStage = (id: string) => {
    setStagedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const stagedProducts = useMemo(() => 
    stagedIds.length > 0 ? catalog.filter(p => stagedIds.includes(p.id)) : catalog
  , [stagedIds, catalog]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40 animate-in fade-in duration-1000">
      <section className="relative h-[45vh] flex items-center bg-[#2C1810] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" alt="B2B Roastery" fill className="object-cover opacity-20 grayscale" priority />
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-white">
           <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-2xl">
                 <GlobeIcon className="w-3 h-3" /> Wholesale Portal
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                 <AwardIcon className="w-4 h-4 text-[#D4AF37]" />
                 <span className="text-[9px] font-black uppercase tracking-widest">JFTC Protocol Verified</span>
              </div>
           </div>
           <h1 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">Procurement.</h1>
        </div>
      </section>

      <div className="sticky top-20 z-30 bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
           <div className="flex gap-1 bg-stone-100 p-1 rounded-sm">
              <button onClick={() => setViewMode("GALLERY")} className={`flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase transition-all rounded-sm cursor-pointer ${viewMode === "GALLERY" ? 'bg-white text-[#2C1810] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                <LayoutIcon className="w-3 h-3" /> Sensory Discovery
              </button>
              <button onClick={() => setViewMode("MATRIX")} className={`flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase transition-all rounded-sm cursor-pointer ${viewMode === "MATRIX" ? 'bg-white text-[#2C1810] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                <ListIcon className="w-3 h-3" /> Bulk Matrix {stagedIds.length > 0 && `(${stagedIds.length})`}
              </button>
           </div>
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-stone-300">
                 <RefreshCwIcon className="w-3 h-3" />
                 <span className="text-[8px] font-black uppercase">Ledger Sync Active</span>
              </div>
              <Link href="/profile/export" className="text-[9px] font-black uppercase text-[#D4AF37] border-b border-[#D4AF37] pb-1 hover:text-[#2C1810] transition-colors">Partner Dashboard</Link>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_350px] gap-16">
        <div className="space-y-12">
           {viewMode === "GALLERY" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {catalog.map(product => (
                 <div key={product.id} className="bg-white p-4 border border-stone-100 rounded-sm shadow-sm space-y-4 flex flex-col justify-between h-full">
                    <ProductCard product={product} userRole={userRole} />
                    <button onClick={() => toggleStage(product.id)} className={`w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${stagedIds.includes(product.id) ? 'bg-[#D4AF37] border-[#D4AF37] text-[#2C1810]' : 'border-stone-200 text-stone-400 hover:border-[#2C1810]'}`}>
                      {stagedIds.includes(product.id) ? "Selected" : "Add to Matrix"}
                    </button>
                 </div>
               ))}
             </div>
           ) : (
             <div className="animate-in slide-in-from-bottom-4 duration-700">
                <BulkMatrix products={stagedProducts} />
                <button onClick={() => setStagedIds([])} className="mt-8 text-[9px] font-black uppercase text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer">
                  Reset Selection <MoveRightIcon className="w-3 h-3 rotate-180" />
                </button>
             </div>
           )}
        </div>

        <aside className="space-y-8">
           <div className="bg-white border border-stone-100 p-8 rounded-sm space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                <div className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-green-600" /><p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Financial Health</p></div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${milestone >= 90 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                   {milestone >= 90 ? 'Threshold Alert' : 'Healthy'}
                </span>
              </div>
              <div className="space-y-4">
                 <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${milestone >= 75 ? 'bg-red-500' : 'bg-[#D4AF37]'}`} style={{ width: `${milestone}%` }} />
                 </div>
                 <div className="flex justify-between text-[8px] font-black text-stone-300 uppercase tracking-widest">
                    <span>Utilization</span><span>{milestone.toFixed(0)}%</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#2C1810] p-10 text-white rounded-sm shadow-2xl space-y-8 relative overflow-hidden">
              <FactoryIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <TrendingUpIcon className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="text-xl font-serif italic text-white">Supply Chain Pulse</h3>
                 </div>
                 <p className="text-xs text-stone-400 leading-relaxed italic font-light">Verified partners gain direct access to nursery records, roastery schedules, and technical logs.</p>
                 <Link href="/trace" className="block w-full py-4 bg-[#D4AF37] text-[#2C1810] text-center text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">Authenticate Batch</Link>
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
}