import { db } from "@/db";
import { coffeeShops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MoveLeftIcon, StoreIcon } from "@/components/ui/icons";
import Link from "next/link";
import { MenuItem } from "@/types/retail";
import { MenuManager } from "./MenuManager"; // FIXED: Added UI component

interface ShopEditorProps {
  params: Promise<{ id: string }>;
}

export default async function ShopMenuEditorPage({ params }: ShopEditorProps) {
  const { id } = await params;

  // 1. Fetch the Shop from D-Drive Database
  const [shop] = await db.select().from(coffeeShops).where(eq(coffeeShops.id, id)).limit(1);

  if (!shop) return notFound();

  // 2. Map JSONB data to our strict MenuItem interface
  const menuItems = (shop.menuData as MenuItem[]) || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <Link href="/admin/shops" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#D4AF37] transition-colors">
         <MoveLeftIcon className="w-3 h-3" /> Back to Shop Network
      </Link>

      <header className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#2C1810] flex items-center justify-center rounded-sm shadow-2xl border border-white/5">
             <StoreIcon className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-4xl font-serif italic text-[#2C1810]">{shop.name}</h1>
            <p className="text-stone-400 text-[10px] uppercase font-black tracking-[0.3em]">{shop.location} • Menu Configuration</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[8px] font-black uppercase tracking-widest bg-stone-200 px-3 py-1 rounded-full text-stone-600">Digital QR Sync Active</span>
        </div>
      </header>

      {/* 3. The Interactive Menu Manager (Requirement #1: Dashboard flexibility) */}
      <MenuManager shopId={shop.id} initialMenu={menuItems} />

      {/* Retail Strategy Footer */}
      <div className="p-10 bg-[#2C1810] text-[#FAF9F6] rounded-sm shadow-2xl relative overflow-hidden">
         <div className="relative z-10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Retail Strategy Insight</h4>
            <p className="text-sm font-light opacity-60 max-w-2xl leading-loose italic">
              &quot;Individual shop menus allow for geographic pricing and exclusive local collaborations. Ensure Flagship locations highlight the high-altitude Nuwara Eliya roasts first.&quot;
            </p>
         </div>
      </div>
    </div>
  );
}