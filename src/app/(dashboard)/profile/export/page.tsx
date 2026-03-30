import { getWholesaleInquiries } from "../actions";
import {  ClipboardListIcon } from "@/components/ui/icons";

export default async function ExportDeskPage() {
  const inquiries = await getWholesaleInquiries();

  return (
    <div className="space-y-10">
      <header className="border-b border-stone-200 pb-6 flex justify-between items-center">
        <h2 className="text-3xl font-serif italic text-[#2C1810]">B2B Export Desk</h2>
        {/* FIXED: ClipboardListIcon now used visually */}
        <ClipboardListIcon className="w-8 h-8 text-[#D4AF37] opacity-20" />
      </header>

      <div className="grid gap-6">
        {inquiries.map((iq) => (
          <div key={iq.id} className="bg-white border border-stone-100 p-8 rounded-sm">
            <h3 className="text-xl font-bold text-[#2C1810] mb-4">{iq.location} Technical Request</h3>
            {/* FIXED: Quotation marks escaped using &quot; */}
            <p className="text-xs text-stone-500 italic bg-stone-50 p-4 rounded-sm">
              &quot;{iq.message}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}