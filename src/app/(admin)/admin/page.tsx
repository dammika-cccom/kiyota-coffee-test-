import { db } from "@/db";
import { users, orders, products, farms } from "@/db/schema";
import { count, sql, eq, lt } from "drizzle-orm";
import { 
  AwardIcon, TrendingUpIcon, UsersIcon, 
  GlobeIcon, FactoryIcon, TruckIcon, ShieldCheckIcon 
} from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminMasterDashboard() {
  // 1. INSTITUTIONAL DATA AGGREGATION
  const [
    userStats, 
    orderStats, 
    stockAlerts, 
    pendingB2B, 
    nurseryResult, 
    totalRevenue
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(products).where(lt(products.stockQuantity, 15)),
    db.select({ value: count() }).from(users).where(eq(users.b2bStatus, "PENDING")),
    db.select({ value: sql<number>`sum(${farms.nurseryPlants})` }).from(farms),
    db.select({ total: sql<string>`sum(${orders.totalAmount})` }).from(orders)
  ]);

  const stats = [
    { name: "Gross Revenue", value: `LKR ${Number(totalRevenue[0]?.total || 0).toLocaleString()}`, icon: TrendingUpIcon, color: "text-green-600" },
    { name: "Total Members", value: userStats[0].value, icon: UsersIcon, color: "text-blue-600" },
    { name: "B2B Requests", value: pendingB2B[0].value, icon: GlobeIcon, color: "text-[#D4AF37]" },
    { name: "Nursery Seedlings", value: Number(nurseryResult[0]?.value || 0).toLocaleString(), icon: FactoryIcon, color: "text-stone-500" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-100 pb-8">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">Governance HQ</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Institutional Command</h2>
        </div>
        <div className="bg-[#2C1810] text-white px-5 py-2.5 rounded-sm flex items-center gap-3 shadow-xl">
           <ShieldCheckIcon className="w-4 h-4 text-green-500" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">System Status: Operational</span>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm flex flex-col justify-between h-44 group hover:border-[#D4AF37]/50 transition-all">
            <div className="flex justify-between items-start">
               <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">{stat.name}</p>
               <stat.icon className={`w-6 h-6 ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </div>
            <p className="text-3xl font-bold tracking-tighter text-[#2C1810]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* PARTNERSHIP WING */}
        <div className="lg:col-span-2 bg-[#2C1810] p-10 rounded-sm shadow-2xl space-y-8 text-white relative overflow-hidden">
           <GlobeIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12" />
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <AwardIcon className="w-5 h-5 text-[#D4AF37]" />
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Wholesale Governance</h3>
              </div>
              <p className="text-lg font-serif italic opacity-80 leading-relaxed max-w-xl">
                There are {pendingB2B[0].value} partnership applications awaiting institutional audit and credit threshold assignment.
              </p>
              <Link href="/admin/users" className="inline-block bg-[#D4AF37] text-[#2C1810] px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                 Open Partnership Desk
              </Link>
           </div>
        </div>

        {/* PIPELINE WING */}
        <div className="bg-white p-10 border border-stone-100 shadow-sm rounded-sm flex flex-col justify-between">
           <div className="space-y-4">
              <TruckIcon className="w-8 h-8 text-stone-200" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Logistics Pulse</h3>
              <p className="text-sm text-stone-500">
                Active Orders: {orderStats[0].value}. Inventory risks detected in {stockAlerts[0].value} profiles.
              </p>
           </div>
           <Link href="/admin/orders" className="text-[9px] font-black uppercase text-[#D4AF37] border-b border-[#D4AF37] w-fit pt-8">
              Audit Logistics Flow
           </Link>
        </div>
      </div>
    </div>
  );
}