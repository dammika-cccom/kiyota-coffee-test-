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
import InvoiceDownloadButton from "@/components/shop/InvoiceDownloadButton";

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

  const myOrders = await db.select().from(orders).where(eq(orders.userId, session.userId)).orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="border-b border-stone-100 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">The Vault</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Order History</h2>
        </div>
        <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
           <ShieldCheckIcon className="w-3 h-3 text-green-600" />
           <span className="text-[9px] font-black uppercase text-stone-400">Secure Session</span>
        </div>
      </header>

      {myOrders.length > 0 ? (
        <div className="space-y-10">
          {myOrders.map((order) => {
            // @ts-expect-error - JSONB parsing
            const lotNum = order.metadata?.lotNumber;
            // @ts-expect-error - JSONB parsing
            const lineItems = (order.metadata?.items as OrderLineItem[]) || [];

            return (
              <div key={order.id} className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm group hover:border-[#D4AF37]/30 transition-all">
                <div className="p-8 bg-[#FAF9F6] border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-6 items-center">
                    <PackageIcon className="w-8 h-8 text-stone-200" />
                    <div>
                       <p className="text-[9px] font-black uppercase text-stone-400">Order Ref</p>
                       <p className="text-sm font-bold text-[#2C1810]">#{order.id.slice(0, 12).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     {order.isB2B && <InvoiceDownloadButton order={order} variant="ghost" />}
                     <div className="text-right">
                        <p className="text-lg font-bold text-[#2C1810]">LKR {Number(order.totalAmount || 0).toLocaleString()}</p>
                     </div>
                  </div>
                </div>

                <div className="p-8 grid lg:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                         <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Order Contents</p>
                      </div>
                      <div className="space-y-3">
                         {lineItems.map((item) => (
                           <div key={item.id} className="flex justify-between text-xs">
                              <p className="font-bold text-[#2C1810]">{item.name} <span className="text-[9px] text-stone-400 font-normal">({item.weight}G)</span></p>
                              <span className="font-mono font-bold text-stone-300">x{item.quantity}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#FAF9F6] p-6 rounded-sm space-y-6 relative overflow-hidden">
                      <div className="flex items-center gap-3"><AwardIcon className="w-4 h-4 text-[#D4AF37]" /><p className="text-[10px] font-black uppercase text-[#2C1810]">Traceability</p></div>
                      {lotNum ? (
                        <Link href={`/trace?lot=${lotNum}`} className="text-sm font-serif italic text-[#2C1810] hover:text-[#D4AF37] transition-all flex items-center gap-2 underline">
                           <MapPinIcon className="w-3 h-3" /> Batch: {lotNum}
                        </Link>
                      ) : (
                        <p className="text-[10px] text-stone-300 italic">Awaiting Roastery Linkage</p>
                      )}
                   </div>
                </div>

                <div className="px-8 py-4 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-300">
                   <div className="flex items-center gap-4"><TruckIcon className="w-4 h-4" /><p className="text-[9px] font-black uppercase">{order.status} • {order.paymentType}</p></div>
                   <div className="flex items-center gap-2"><CheckCircleIcon className="w-3 h-3 text-green-500" /><p className="text-[9px] font-black uppercase text-stone-400">Payment: {order.paymentStatus}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-40 text-center border-2 border-dashed border-stone-100 rounded-sm">
           <PackageIcon className="w-12 h-12 mx-auto text-stone-100 mb-4" />
           <p className="text-xs uppercase font-black text-stone-300 italic">No order history found.</p>
           <Link href="/shop" className="text-[10px] font-black uppercase text-[#D4AF37] underline mt-6 inline-block">Visit Roastery Store</Link>
        </div>
      )}
    </div>
  );
}