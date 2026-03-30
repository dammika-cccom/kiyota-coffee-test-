import { db } from "@/db";
import { coffeeShops } from "@/db/schema";
import { StoreIcon, EditIcon, MapPinIcon, ClockIcon } from "@/components/ui/icons";
import Link from "next/link";
import { AddShopForm } from "./AddShopForm"; // FIXED: Moved form to client component

export default async function AdminShopsPage() {
  const allShops = await db.select().from(coffeeShops);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Retail Operations</h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Shop Network</h2>
        </div>
        
        {/* Requirement: Form handled via Client Component to prevent Type Error */}
        <AddShopForm />
      </header>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allShops.map((shop) => (
          <div key={shop.id} className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm flex flex-col justify-between group hover:border-[#D4AF37]/30 transition-all">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center">
                   <StoreIcon className="w-6 h-6 text-[#2C1810] opacity-20" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest bg-stone-100 px-2 py-1 rounded-full text-stone-400">Active</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic text-[#2C1810]">{shop.name}</h3>
                <div className="flex items-center gap-2 text-stone-400">
                  <MapPinIcon className="w-3 h-3" />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">{shop.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-50 flex items-center gap-3 text-stone-400">
                <ClockIcon className="w-3 h-3" />
                <p className="text-[10px] font-medium italic">{shop.openingHours || "Hours Not Set"}</p>
              </div>
            </div>

            <div className="pt-8">
              <Link 
                href={`/admin/shops/${shop.id}`}
                className="w-full py-3 bg-[#2C1810] text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-all"
              >
                <EditIcon className="w-3 h-3" /> Manage Digital Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}