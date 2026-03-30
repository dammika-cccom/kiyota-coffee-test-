import { db } from "@/db";
import { farms } from "@/db/schema";
import { CoffeeIcon, TrendingUpIcon, MapPinIcon } from "@/components/ui/icons"; 
import { desc, sql } from "drizzle-orm";
import FarmStatsCard from "./FarmStatsCard";
import AddRegionForm from "./AddRegionForm";
import NurseryLedgerUI from "./NurseryLedgerUI"; // Master UI
import { getLedgerHistory } from "./actions"; // Logic fetch

export default async function FarmerAdminPage() {
  // 1. Fetch data for the various segments
  const allFarms = await db.select().from(farms).orderBy(desc(farms.farmerCount));
  const ledgerHistory = await getLedgerHistory();

  // 2. AGGREGATE TOTALS for the Impact Ribbon logic
  const totals = await db.select({
    totalFarmers: sql<number>`sum(${farms.farmerCount})`,
    totalPlants: sql<number>`sum(${farms.nurseryPlants})`
  }).from(farms);

  const plantTotal = Number(totals[0]?.totalPlants || 0);
  const targetPlants = 400000;
  const progressPercent = Math.min((plantTotal / targetPlants) * 100, 100);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-stone-200 pb-8">
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Supply Chain Admin</h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Origin Network</h2>
        </div>
        <AddRegionForm />
      </header>

      {/* MASTER LEDGER: Handles Input and Audit Trail */}
      <NurseryLedgerUI 
        farmsList={allFarms} 
        history={ledgerHistory} 
      />

      {/* PROGRESS TRACKER: Real-time visual for the 400k goal */}
      <div className="bg-[#2C1810] p-10 rounded-sm shadow-xl text-white space-y-6">
         <div className="flex justify-between items-end">
            <div>
               <p className="text-[10px] uppercase font-black text-[#D4AF37] tracking-widest">Nursery Goal Progress</p>
               <p className="text-4xl font-bold mt-2">{plantTotal.toLocaleString()} / {targetPlants.toLocaleString()}</p>
            </div>
            <TrendingUpIcon className="w-10 h-10 opacity-20" />
         </div>
         <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
               className="h-full bg-[#D4AF37] transition-all duration-1000" 
               style={{ width: `${progressPercent}%` }}
            />
         </div>
         <p className="text-[10px] uppercase font-bold text-stone-500">
            Facilitating {Number(totals[0]?.totalFarmers || 0).toLocaleString()} family farms across {allFarms.length} districts
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm flex justify-between items-center">
          <div>
            <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest">Active Processing Hubs</p>
            <p className="text-3xl font-bold text-[#2C1810]">{allFarms.length}</p>
          </div>
          <MapPinIcon className="w-8 h-8 text-[#D4AF37] opacity-20" />
        </div>
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm flex justify-between items-center">
          <div>
            <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest">Average Altitude</p>
            <p className="text-3xl font-bold text-[#2C1810]">1,450m</p>
          </div>
          <CoffeeIcon className="w-8 h-8 text-[#D4AF37] opacity-20" />
        </div>
      </div>

      {/* REGION LOGS */}
      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810] flex items-center gap-3">
           <TrendingUpIcon className="w-4 h-4 text-[#D4AF37]" /> Region Facilitation Log
        </h3>
        <div className="grid lg:grid-cols-2 gap-8 pb-20">
          {allFarms.map((farm) => (
            <FarmStatsCard key={farm.id} farm={farm} />
          ))}
        </div>
      </section>
    </div>
  );
}