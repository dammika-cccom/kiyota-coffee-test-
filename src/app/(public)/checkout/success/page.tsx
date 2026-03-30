import { Metadata } from "next";
import Link from "next/link";
import { CheckCircleIcon, ShoppingBagIcon } from "@/components/ui/icons";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import InvoiceDownloadButton from "@/components/shop/InvoiceDownloadButton";

export const metadata: Metadata = { title: "Order Confirmed | Kiyota Coffee" };

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ method?: string, id?: string }> 
}) {
  // FIXED: Awaiting async searchParams in Next.js 15
  const { method, id } = await searchParams;
  
  const [order] = id ? await db.select().from(orders).where(eq(orders.id, id)).limit(1) : [null];

  return (
    <div className="max-w-xl mx-auto px-6 py-40 text-center space-y-8 animate-in fade-in duration-1000">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-xl">
         <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>
      
      <div className="space-y-4">
        <h5 className="text-[10px] uppercase tracking-[0.6em] font-black text-[#D4AF37]">Fulfillment Synchronized</h5>
        <h1 className="text-5xl font-serif italic text-[#2C1810]">Thank You.</h1>
        {method === "BANK_TRANSFER" && (
            <p className="text-sm text-stone-500 italic bg-stone-50 p-4 border rounded-sm">Please upload transfer receipt in the Member Vault.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 pt-8">
        {order && order.isB2B && (
          <InvoiceDownloadButton order={order} />
        )}
        
        <Link href="/profile/orders" className="bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] flex items-center justify-center gap-3 shadow-lg transition-all">
           <ShoppingBagIcon className="w-4 h-4" /> View Order History
        </Link>
      </div>
    </div>
  );
}