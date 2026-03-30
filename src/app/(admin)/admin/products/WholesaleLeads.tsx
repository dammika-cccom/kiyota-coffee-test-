import { db } from "@/db";
import { productInquiries } from "@/db/schema"; // FIXED: New table
import { eq, desc, and } from "drizzle-orm";
import { GlobeIcon } from "@/components/ui/icons";

export default async function WholesaleLeads() {
  const leads = await db
    .select()
    .from(productInquiries)
    .where(
        and(
            eq(productInquiries.segment, "WHOLESALE"),
            eq(productInquiries.origin, "INTERNATIONAL")
        )
    )
    .orderBy(desc(productInquiries.createdAt));

  return (
    <section className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810] flex items-center gap-3">
         <GlobeIcon className="w-4 h-4 text-[#D4AF37]" /> Global Export Leads
      </h3>
      <div className="bg-white border border-stone-100 rounded-sm divide-y divide-stone-50 shadow-sm">
        {leads.map((lead) => (
          <div key={lead.id} className="p-6 space-y-2">
            <div className="flex justify-between items-start">
               <p className="text-sm font-bold text-[#2C1810]">{lead.contactName} - {lead.companyName}</p>
               <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase tracking-tighter">
                  {lead.location}
               </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">{lead.email}</p>
            <p className="text-xs text-stone-500 italic pt-2">&quot;{lead.message}&quot;</p>
          </div>
        ))}
      </div>
    </section>
  );
}