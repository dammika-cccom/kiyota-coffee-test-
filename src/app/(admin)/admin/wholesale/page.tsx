import { db } from "@/db";
import { productInquiries } from "@/db/schema";
import { count, sql, desc, eq } from "drizzle-orm";
import { 
   TrendingUpIcon, UsersIcon, 
   TruckIcon, CoffeeIcon 
} from "@/components/ui/icons";
import ProFormaCreator from "./ProFormaCreator";

interface WholesaleLead {
  id: string;
  companyName: string | null;
  contactName: string;
  email: string;
  location: string;
  message: string;
  volumeRequirement: string | null;
  priority: string | null;
  status: string | null;
  createdAt: Date | null;
}

export default async function WholesaleAdminDesk() {
  const leads = await db
    .select()
    .from(productInquiries)
    .where(eq(productInquiries.segment, "WHOLESALE"))
    .orderBy(desc(productInquiries.createdAt)) as WholesaleLead[];

  const [leadStats] = await db.select({
    total: count(),
    urgent: sql<number>`count(*) filter (where ${productInquiries.priority} = 'HIGH')`,
  }).from(productInquiries).where(eq(productInquiries.segment, "WHOLESALE"));

  const kpis = [
    { label: "Total Partners", val: leadStats.total, icon: UsersIcon, color: "text-blue-600" },
    { label: "Active Shipments", val: "Industrial", icon: TruckIcon, color: "text-amber-600" },
    { label: "Market Demand", val: "High", icon: TrendingUpIcon, color: "text-green-600" }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      <header className="flex justify-between items-end border-b border-stone-100 pb-8">
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Corporate segment</h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Export Quotation Desk</h2>
        </div>
      </header>

      {/* KPI GRID - Utilizing all icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-8 border border-stone-100 shadow-sm flex justify-between items-center group">
            <div>
               <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest">{kpi.label}</p>
               <p className="text-2xl font-bold text-[#2C1810]">{kpi.val}</p>
            </div>
            <kpi.icon className={`w-8 h-8 ${kpi.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      <section className="space-y-8">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-8 grid lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">
                  {lead.location}
                </span>
                <h4 className="text-2xl font-serif italic text-[#2C1810]">{lead.contactName}</h4>
                <p className="text-xs text-stone-400">{lead.companyName}</p>
              </div>
              <div className="bg-stone-50 p-6 rounded-sm border-l-2 border-stone-200">
                <CoffeeIcon className="w-4 h-4 text-stone-300 mb-2" />
                <p className="text-xs italic text-stone-600 leading-relaxed">&quot;{lead.message}&quot;</p>
              </div>
              <ProFormaCreator lead={lead} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}