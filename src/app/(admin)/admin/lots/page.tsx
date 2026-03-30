import { db } from "@/db";
import { lots, products, farms } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AwardIcon, MapPinIcon, FactoryIcon } from "@/components/ui/icons";

export default async function VerticalChainAuditPage() {
  const allLots = await db.select({
    id: lots.id,
    lotNumber: lots.lotNumber,
    scaScore: lots.scaScore,
    roastDate: lots.roastDate,
    tastingNotes: lots.tastingNotes,
    productName: products.name,
    region: farms.region
  })
  .from(lots)
  .leftJoin(products, eq(lots.productId, products.id))
  .leftJoin(farms, eq(lots.farmId, farms.id))
  .orderBy(desc(lots.harvestDate));

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-10">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">Supply Chain Audit</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Traceability Log</h2>
        </div>
        <div className="bg-[#2C1810] p-4 flex items-center gap-6 rounded-sm shadow-xl">
           <div className="flex items-center gap-3">
              <FactoryIcon className="w-5 h-5 text-[#D4AF37]" />
              <div>
                 <p className="text-[8px] font-black text-stone-500 uppercase">Active Lots</p>
                 <p className="text-lg font-bold text-white leading-none">{allLots.length}</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allLots.map((lot) => (
          <div key={lot.id} className="bg-white border border-stone-100 p-8 shadow-sm rounded-sm space-y-6 hover:border-[#D4AF37] transition-all group">
             <div className="flex justify-between items-start">
                <div className="bg-stone-50 px-3 py-1 border border-stone-100 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <p className="text-[10px] font-black text-[#2C1810]">{lot.lotNumber}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-stone-400 uppercase">SCA Score</p>
                   <p className="text-lg font-black text-[#D4AF37]">{lot.scaScore || '85+'}</p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xl font-serif italic text-[#2C1810] line-clamp-1">{lot.productName}</h4>
                <div className="flex items-center gap-2 text-stone-400">
                   <MapPinIcon className="w-3 h-3" />
                   <p className="text-[10px] font-bold uppercase tracking-tighter">{lot.region}</p>
                </div>
             </div>

             <div className="pt-4 border-t border-stone-50 space-y-2">
                <p className="text-[10px] text-stone-400 leading-relaxed italic line-clamp-2">
                   &quot;{lot.tastingNotes || 'Quality-assured sensory profile pending audit.'}&quot;
                </p>
                <div className="flex justify-between items-end pt-4">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-stone-400 uppercase">Roast Date</p>
                      <p className="text-[10px] font-bold text-[#2C1810]">
                        {lot.roastDate ? new Date(lot.roastDate).toLocaleDateString() : 'Awaiting Processing'}
                      </p>
                   </div>
                   <AwardIcon className="w-6 h-6 text-[#D4AF37] opacity-10 group-hover:opacity-100 transition-opacity" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}