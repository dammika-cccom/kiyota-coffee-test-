import { db } from "@/db";
import { orders, lots } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm"; 
import FulfillmentPipeline from "./FulfillmentPipeline";
import { TruckIcon, TrendingUpIcon } from "@/components/ui/icons";

export interface OrderMetadata {
  lotNumber?: string;
  trackingNumber?: string;
  notes?: string;
  items?: { id: string; name: string; weight: number; quantity: number }[];
}

export interface OrderRecord {
  id: string;
  amount: string | null;
  status: string | null;
  paymentStatus: string | null;
  date: Date | null;
  customerName: string | null;
  customerAddress: string | null;
  customerPhone: string | null;
  metadata: OrderMetadata | null; 
}

export type LotRecord = typeof lots.$inferSelect;

export default async function OrdersAdminPage() {
  const [retailOrders, availableLots] = await Promise.all([
    db.select({
      id: orders.id,
      amount: orders.totalAmount,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      date: orders.createdAt,
      customerName: orders.customerName,
      customerAddress: orders.customerAddress,
      customerPhone: orders.customerPhone,
      metadata: orders.metadata
    })
    .from(orders)
    .where(eq(orders.isB2B, false))
    .orderBy(desc(orders.createdAt)),
    db.select().from(lots)
  ]);

  const revenueResult = await db.select({ 
    total: sql<number>`sum(${orders.totalAmount})` 
  }).from(orders).where(eq(orders.paymentStatus, "PAID"));
  
  const totalB2CRevenue = Number(revenueResult[0]?.total || 0);

  return (
    <div className="space-y-12 pb-40 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-10">
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Logistics HQ</h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Fulfillment Pipeline</h2>
        </div>
        
        <div className="bg-[#2C1810] p-6 rounded-sm text-white flex gap-10 shadow-2xl relative overflow-hidden">
           <TrendingUpIcon className="absolute -bottom-2 -right-2 w-20 h-20 opacity-5 text-white" />
           <div className="relative z-10 space-y-1">
              <p className="text-[8px] uppercase tracking-widest text-stone-500 font-bold">Pipeline Revenue</p>
              <p className="text-2xl font-bold text-[#D4AF37]">LKR {totalB2CRevenue.toLocaleString()}</p>
           </div>
           <div className="relative z-10 border-l border-white/10 pl-10 flex items-center gap-4">
              {/* FIXED: TruckIcon is now utilized as a visual anchor for logistics activity */}
              <TruckIcon className="w-8 h-8 text-[#D4AF37] opacity-20" />
              <div>
                <p className="text-[8px] uppercase text-stone-500 font-bold tracking-widest">Active Orders</p>
                <p className="text-2xl font-bold text-white leading-none">{retailOrders.length}</p>
              </div>
           </div>
        </div>
      </header>

      <FulfillmentPipeline 
        initialOrders={retailOrders as OrderRecord[]} 
        availableLots={availableLots as LotRecord[]} 
      />
    </div>
  );
}