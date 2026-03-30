import { db } from "@/db";
import { users, orders, products, farms } from "@/db/schema";
import { count, sql, eq, lt, desc } from "drizzle-orm";
import MemberCrmClient from "./MemberCrmClient";
import { 
  ShieldCheckIcon, UsersIcon, GlobeIcon, 
  TrendingUpIcon, FactoryIcon 
} from "@/components/ui/icons";
import AddUserForm from "./AddUserForm";

/**
 * INSTITUTIONAL TYPE EXPORT
 * Inferred directly from Postgres Schema to ensure Zero-Any compliance.
 */
export type UserRecord = typeof users.$inferSelect;

export default async function MemberCrmPage() {
  // 1. DATA AGGREGATION: Parallel Execution for Roastery Performance
  const [allUsers, nurseryResult, pendingB2B, stockAlerts] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select({ value: sql<number>`sum(${farms.nurseryPlants})` }).from(farms),
    db.select({ value: count() }).from(users).where(eq(users.b2bStatus, "PENDING")),
    db.select({ value: count() }).from(products).where(lt(products.stockQuantity, 15))
  ]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-10">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">Governance HQ</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Member Directory</h2>
        </div>
        
        <div className="flex items-center gap-8">
           {/* KPI: Global Network */}
           <div className="text-right">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center justify-end gap-2">
                 <UsersIcon className="w-3 h-3 text-[#D4AF37]" /> Global Network
              </p>
              <p className="text-2xl font-bold text-[#2C1810] mt-1">{allUsers.length}</p>
           </div>

           {/* KPI: B2B Queue */}
           <div className="text-right border-l border-stone-100 pl-8">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center justify-end gap-2">
                 <GlobeIcon className="w-3 h-3 text-blue-500" /> B2B Requests
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{pendingB2B[0].value}</p>
           </div>

           {/* KPI: System Trust */}
           <div className="text-right border-l border-stone-100 pl-8 hidden lg:block">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center justify-end gap-2">
                 <ShieldCheckIcon className="w-3 h-3 text-green-500" /> Trust Pulse
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">100%</p>
           </div>

           <div className="pl-4">
              <AddUserForm />
           </div>
        </div>
      </header>

      {/* FOOTER WIDGET: Traceability & Risk Context */}
      <div className="grid grid-cols-2 gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-sm border border-stone-100">
            <FactoryIcon className="w-5 h-5 text-stone-400" />
            <p className="text-[9px] font-black uppercase text-stone-500">Nursery Capacity: {Number(nurseryResult[0]?.value || 0).toLocaleString()} Seedlings</p>
         </div>
         <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-sm border border-stone-100">
            <TrendingUpIcon className="w-5 h-5 text-stone-400" />
            <p className="text-[9px] font-black uppercase text-stone-500">Inventory Risks Detected: {stockAlerts[0].value} SKUs</p>
         </div>
      </div>

      <MemberCrmClient initialUsers={allUsers} />
    </div>
  );
}