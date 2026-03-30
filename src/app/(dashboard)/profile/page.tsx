import { db } from "@/db";
import { users, products } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth-utils";
import { ShoppingBagIcon, BookOpenIcon, CoffeeIcon, AwardIcon, GlobeIcon, ClockIcon } from "@/components/ui/icons";
import Link from "next/link";
import B2BUpgradeForm from "./B2BUpgradeForm";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const auth = await getAuthUser();
  if (!auth) return null;

  const [user] = await db.select().from(users).where(eq(users.id, auth.userId)).limit(1);
  const [productStats] = await db.select({ value: count() }).from(products);

  if (!user) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Greetings, {user.firstName}</h2>
          <p className="text-stone-400 text-sm mt-1 uppercase tracking-widest font-black">
            {user.role?.replace('_', ' ')} Portfolio
          </p>
        </div>
        <AwardIcon className="w-10 h-10 text-[#D4AF37] opacity-10" />
      </header>

      {/* --- INSTITUTIONAL WINGS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6 group hover:border-[#D4AF37]/30 transition-all">
          <ShoppingBagIcon className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-xs font-black uppercase tracking-widest">Order History</h3>
          <p className="text-sm text-stone-500 font-light italic leading-relaxed">Audit and track your retail specialty deliveries.</p>
          <Link href="/profile/orders" className="block text-[10px] font-black uppercase text-[#2C1810] border-b border-[#2C1810] w-fit pb-1">View Archives</Link>
        </div>

        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6 group hover:border-[#D4AF37]/30 transition-all">
          <CoffeeIcon className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-xs font-black uppercase tracking-widest">The Roastery</h3>
          <p className="text-sm text-stone-500 font-light italic leading-relaxed">Explore our {productStats.value} seasonal single-origin profiles.</p>
          <Link href="/shop" className="block text-[10px] font-black uppercase text-[#2C1810] border-b border-[#2C1810] w-fit pb-1">Enter Shop</Link>
        </div>

        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6 group hover:border-[#D4AF37]/30 transition-all">
          <BookOpenIcon className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-xs font-black uppercase tracking-widest">Academy Log</h3>
          <p className="text-sm text-stone-500 font-light italic leading-relaxed">Manage your technical barista and cupping certifications.</p>
          <Link href="/profile/academy" className="block text-[10px] font-black uppercase text-[#2C1810] border-b border-[#2C1810] w-fit pb-1">View Academy</Link>
        </div>
      </div>

      {/* --- B2B KYC PORTAL --- */}
      <section className="pt-12 border-t border-stone-100">
        {user.b2bStatus === "NONE" && (
           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <GlobeIcon className="w-12 h-12 text-[#2C1810] opacity-20" />
                 <h2 className="text-4xl font-serif italic text-[#2C1810]">Scale Globally.</h2>
                 <p className="text-stone-500 leading-loose text-lg font-light italic">
                    Unlock institutional pricing, credit facilities, and neutral white-label packaging by becoming a verified Kiyota Wholesale Partner.
                 </p>
                 <ul className="space-y-4">
                    {["Tiered Corporate Pricing", "Institutional Credit Limits", "Direct Trade Traceability"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]">{item}</span>
                      </li>
                    ))}
                 </ul>
              </div>
              <B2BUpgradeForm userId={user.id} />
           </div>
        )}

        {user.b2bStatus === "PENDING" && (
          <div className="bg-[#FAF9F6] border border-stone-200 p-10 flex items-center justify-between gap-10">
             <div className="flex items-center gap-6">
                <ClockIcon className="w-12 h-12 text-[#D4AF37] animate-pulse" />
                <div>
                   <h3 className="text-2xl font-serif italic text-[#2C1810]">Audit In Progress</h3>
                   <p className="text-xs text-stone-400 uppercase font-black tracking-widest mt-1">Your B2B Credentials are currently under institutional review.</p>
                </div>
             </div>
             <Link href="/contact" className="text-[10px] font-black uppercase border border-[#2C1810] px-6 py-3 hover:bg-[#2C1810] hover:text-white transition-all">Support Desk</Link>
          </div>
        )}
      </section>
    </div>
  );
}