import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { 
  TruckIcon, 
  ShoppingBagIcon, 
  AwardIcon,
  MoveLeftIcon 
} from "@/components/ui/icons";
import Link from "next/link";

type Params = Promise<{ id: string }>;

/**
 * INSTITUTIONAL TYPE FOR LINE ITEMS
 * Parsed from the JSONB metadata field.
 */
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export default async function OrderAuditPage({ params }: { params: Params }) {
  const { id } = await params;
  
  const results = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = results[0];

  if (!order) notFound();

  // Parse items from metadata if available (Institutional standard)
  // @ts-expect-error - metadata is stored as JSONB in PostgreSQL
  const lineItems: OrderItem[] = order.metadata?.items || [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* --- NAVIGATION BAR --- */}
      <nav>
        <Link href="/admin/orders" className="flex items-center gap-2 text-[9px] font-black uppercase text-stone-400 hover:text-[#2C1810] transition-colors group">
          <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Fulfillment Pipeline
        </Link>
      </nav>

      {/* --- EXECUTIVE HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-100 pb-10 gap-6">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">Commercial Audit</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">Ref: #{order.id.slice(0, 12).toUpperCase()}</h2>
        </div>
        <div className="flex gap-4">
           <div className={`px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'bg-green-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
              Payment: {order.paymentStatus}
           </div>
           <div className="bg-[#2C1810] text-[#D4AF37] px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest">
              Status: {order.status}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- COLUMN 1 & 2: LINE ITEMS (Drill-down B) --- */}
        <section className="lg:col-span-2 space-y-8">
           <div className="bg-white border border-stone-100 shadow-sm rounded-sm overflow-hidden">
              <div className="p-6 border-b border-stone-50 bg-stone-50/50 flex items-center gap-3">
                 {/* FIXED: ShoppingBagIcon is now utilized */}
                 <ShoppingBagIcon className="w-4 h-4 text-[#D4AF37]" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Itemized Breakdown</h3>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-white border-b border-stone-100 text-[9px] font-black uppercase text-stone-400">
                    <tr>
                       <th className="p-6">Roast / Product</th>
                       <th className="p-6 text-center">Qty</th>
                       <th className="p-6 text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50">
                    {lineItems.length > 0 ? lineItems.map((item) => (
                      <tr key={item.id} className="text-sm">
                         <td className="p-6">
                            <p className="font-bold text-[#2C1810]">{item.name}</p>
                            <p className="text-[10px] text-stone-400 uppercase">{item.weight}G Net Weight</p>
                         </td>
                         <td className="p-6 text-center font-mono font-bold text-stone-500">x{item.quantity}</td>
                         <td className="p-6 text-right font-bold text-[#2C1810]">LKR {Number(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-[10px] uppercase font-black text-stone-300 italic tracking-widest">
                           Direct Transaction / No Digital Line Items
                        </td>
                      </tr>
                    )}
                 </tbody>
                 {lineItems.length > 0 && (
                   <tfoot className="bg-[#FAF9F6] border-t border-stone-200">
                      <tr className="text-xs font-black">
                         <td className="p-6 uppercase text-stone-400">Logistics Subtotal</td>
                         <td colSpan={2} className="p-6 text-right text-[#2C1810]">
                            LKR {Number(order.totalAmount).toLocaleString()}
                         </td>
                      </tr>
                   </tfoot>
                 )}
              </table>
           </div>

           {/* PAYMENT STRATEGY AUDIT */}
           <div className="bg-[#FAF9F6] border border-stone-200 p-8 rounded-sm grid grid-cols-3 gap-8">
              <div>
                 <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Strategy</p>
                 <p className="text-xs font-black text-[#2C1810] mt-1">{order.paymentType || 'Not Set'}</p>
              </div>
              <div>
                 <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Recon ID</p>
                 <p className="text-xs font-mono font-bold text-[#D4AF37] mt-1">{order.reconciliationId || 'PENDING'}</p>
              </div>
              <div>
                 <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Captured Date</p>
                 <p className="text-xs font-bold text-[#2C1810] mt-1">
                   {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                 </p>
              </div>
           </div>
        </section>

        {/* --- COLUMN 3: LOGISTICS & TRACEABILITY --- */}
        <aside className="space-y-8">
           {/* LOGISTICS CARD */}
           <div className="bg-white border border-stone-100 p-8 shadow-sm rounded-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-4">
                 <TruckIcon className="w-4 h-4 text-[#D4AF37]" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Shipping Identity</h3>
              </div>
              <div className="space-y-4">
                 <div>
                   <p className="text-[8px] font-black text-stone-400 uppercase">Recipient</p>
                   <p className="text-sm font-bold text-[#2C1810]">{order.customerName}</p>
                 </div>
                 <div>
                   <p className="text-[8px] font-black text-stone-400 uppercase">Logistics Target</p>
                   <p className="text-sm leading-relaxed text-stone-600 font-medium">{order.customerAddress}</p>
                 </div>
                 <div>
                   <p className="text-[8px] font-black text-stone-400 uppercase">Contact</p>
                   <p className="text-sm font-mono font-bold text-[#D4AF37]">{order.customerPhone}</p>
                 </div>
              </div>
           </div>

           {/* TRACEABILITY LOCK */}
           <div className="bg-[#2C1810] p-8 shadow-2xl rounded-sm space-y-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                    <AwardIcon className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Vertical Chain</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                       <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Active Lot Authenticated</p>
                       {/* FIXED: Using @ts-expect-error for JSONB key access */}
                       {/* @ts-expect-error - lotNumber is inside metadata JSONB */}
                       <p className="text-xl font-serif italic mt-1">{order.metadata?.lotNumber || "AWAITING_LINK"}</p>
                    </div>
                    <p className="text-[9px] text-stone-400 italic leading-relaxed">
                       Linked to Matale nursery seedling distribution records for premium origin verification.
                    </p>
                 </div>
              </div>
              <AwardIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-5" />
           </div>
        </aside>
      </div>
    </div>
  );
}