import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSession } from "@/lib/session";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  PackageIcon, AwardIcon, TruckIcon, 
  MapPinIcon, CheckCircleIcon, CoffeeIcon, 
  ShieldCheckIcon 
} from "@/components/ui/icons";

interface OrderLineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export default async function MemberOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="border-b border-stone-100 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">The Vault</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Order History</h2>
        </div>
        <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-full border border-stone-100 shadow-sm">
           <ShieldCheckIcon className="w-3 h-3 text-green-600" />
           <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Verified Member Session</span>
        </div>
      </header>

      {myOrders.length > 0 ? (
        <div className="space-y-10">
          {myOrders.map((order) => {
            // @ts-expect-error - JSONB metadata handling
            const lotNum = order.metadata?.lotNumber;
            // @ts-expect-error - JSONB metadata handling
            const lineItems = (order.metadata?.items as OrderLineItem[]) || [];

            return (
              <div key={order.id} className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm group hover:border-[#D4AF37]/30 transition-all">
                <div className="p-8 bg-[#FAF9F6] border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-stone-100 shadow-sm">
                       <PackageIcon className="w-6 h-6 text-[#2C1810] opacity-20" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase text-stone-400">Order ID</p>
                       <p className="text-sm font-bold text-[#2C1810]">#{order.id.slice(0, 12).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black uppercase text-stone-400">Paid Amount</p>
                     <h4 className="text-xl font-bold text-[#2C1810]">LKR {Number(order.totalAmount || 0).toLocaleString()}</h4>
                  </div>
                  <span className={`px-5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-white text-stone-400 border-stone-100'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-8 grid lg:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                         <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Bags in Shipment</p>
                      </div>
                      <div className="space-y-3">
                         {lineItems.map((item) => (
                           <div key={item.id} className="flex justify-between items-center text-xs">
                              <p className="font-bold text-[#2C1810]">{item.name} <span className="text-[10px] text-stone-400 font-normal">({item.weight}G)</span></p>
                              <span className="font-mono font-bold text-stone-300">x{item.quantity}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#FAF9F6] p-6 rounded-sm space-y-6 relative overflow-hidden">
                      <div className="flex items-center gap-3">
                         <AwardIcon className="w-4 h-4 text-[#D4AF37]" />
                         <p className="text-[10px] font-black uppercase text-[#2C1810] tracking-widest">Traceability Pulse</p>
                      </div>
                      {lotNum ? (
                        <div className="space-y-2">
                           <p className="text-[9px] font-bold text-stone-400 uppercase">Authenticated Batch Link</p>
                           <Link href={`/trace?lot=${lotNum}`} className="text-sm font-serif italic text-[#2C1810] hover:text-[#D4AF37] transition-all flex items-center gap-2 underline underline-offset-4">
                              <MapPinIcon className="w-3 h-3" /> {lotNum}
                           </Link>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-stone-300 italic py-4">
                           <div className="w-2 h-2 rounded-full bg-stone-200 animate-pulse" />
                           <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Physical Batching</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="px-8 py-4 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex items-center gap-4 text-stone-300">
                      <TruckIcon className="w-4 h-4" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em]">{order.paymentType} LOGISTICS LOOP ACTIVE</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      <p className="text-[9px] font-black uppercase text-stone-400">Payment Verified: {order.paymentStatus}</p>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-40 text-center border-2 border-dashed border-stone-100 rounded-sm">
           <PackageIcon className="w-12 h-12 mx-auto text-stone-100 mb-4" />
           <p className="text-[10px] uppercase font-black tracking-widest text-stone-300 italic">Your roastery history is empty.</p>
           <Link href="/shop" className="text-[10px] font-black uppercase text-[#D4AF37] underline mt-6 inline-block hover:text-[#2C1810]">Visit the Roastery Store</Link>
        </div>
      )}
    </div>
  );
}