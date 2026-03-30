import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm"; // FIXED: 'eq' is now used
import { PackageIcon } from "@/components/ui/icons";


export const dynamic = "force-dynamic";

export default async function UserOrdersPage() {
  // Logic: Fetch the first user for local testing (In prod, use session ID)
  const allUsers = await db.select().from(users).limit(1);
  const userId = allUsers[0]?.id;

  const myOrders = userId 
    ? await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)) 
    : [];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <header>
        <h2 className="text-4xl font-serif italic text-[#2C1810]">Order History</h2>
        <p className="text-stone-400 text-sm mt-2">Manage your specialty coffee roast subscriptions and purchases.</p>
      </header>

      <div className="space-y-4">
        {myOrders.map((order) => (
          <div key={order.id} className="bg-white p-8 border border-stone-100 rounded-sm flex justify-between items-center shadow-sm group hover:border-[#D4AF37] transition-all">
            <div className="flex items-center gap-6">
              <PackageIcon className="w-6 h-6 text-stone-200 group-hover:text-[#D4AF37]" />
              <div>
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Order Reference: #{order.id.slice(0,8)}</p>
                <p className="text-sm font-bold text-[#2C1810]">{order.createdAt?.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-lg font-bold text-[#2C1810]">LKR {order.totalAmount}</p>
               <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-50 border border-stone-100">{order.status}</span>
            </div>
          </div>
        ))}
        {myOrders.length === 0 && (
           <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-sm opacity-50">
              <p className="text-xs uppercase font-black tracking-widest">No order records found</p>
           </div>
        )}
      </div>
    </div>
  );
}