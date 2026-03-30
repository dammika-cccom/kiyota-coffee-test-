import { db } from "@/db";
import { users, orders, academyEnrollments, academyBatches } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ShoppingBagIcon, GlobeIcon, BookOpenIcon, UserIcon } from "@/components/ui/icons";
import Link from "next/link";

export default async function UserDashboardRedirect() {
  const userId = "session-id-here"; // Logic: Get from auth cookie/session
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) return <div>Unauthorized</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">Welcome, {user.firstName}</h2>
          <p className="text-stone-400 text-sm mt-1 uppercase tracking-widest font-bold">
            {user.role?.replace('_', ' ')} Portal
          </p>
        </div>
        <Link href="/profile/settings" className="text-[10px] font-black uppercase tracking-widest bg-stone-100 px-4 py-2 rounded-sm hover:bg-[#D4AF37] hover:text-white transition-all">
          Security Settings
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SEGMENT 1: B2C CUSTOMER VIEW */}
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6">
          <div className="flex items-center gap-3">
             <ShoppingBagIcon className="w-5 h-5 text-[#D4AF37]" />
             <h3 className="text-xs font-black uppercase tracking-widest">My Purchases</h3>
          </div>
          <p className="text-sm text-stone-500 font-light italic">Track your retail roasts and delivery status.</p>
          <Link href="/profile/orders" className="block text-[10px] font-black uppercase text-[#2C1810] border-b border-[#2C1810] w-fit pb-1">View Order History</Link>
        </div>

        {/* SEGMENT 2: B2B PARTNER VIEW (Gated by Role) */}
        {user.role === 'WHOLESALE_USER' && (
          <div className="bg-[#FAF9F6] p-8 border border-[#D4AF37]/20 rounded-sm space-y-6">
            <div className="flex items-center gap-3">
               <GlobeIcon className="w-5 h-5 text-[#D4AF37]" />
               <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Export Desk</h3>
            </div>
            <p className="text-sm text-stone-500 font-light italic">Access pro-forma invoices and technical lot data.</p>
            <Link href="/profile/export" className="block text-[10px] font-black uppercase text-[#D4AF37] border-b border-[#D4AF37] w-fit pb-1">B2B Documentation</Link>
          </div>
        )}

        {/* SEGMENT 3: STUDENT VIEW (Gated by Enrollment) */}
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6">
          <div className="flex items-center gap-3">
             <BookOpenIcon className="w-5 h-5 text-[#D4AF37]" />
             <h3 className="text-xs font-black uppercase tracking-widest">Academy Log</h3>
          </div>
          <p className="text-sm text-stone-500 font-light italic">View class schedules and mastery certifications.</p>
          <Link href="/profile/academy" className="block text-[10px] font-black uppercase text-[#2C1810] border-b border-[#2C1810] w-fit pb-1">Academy Schedule</Link>
        </div>

      </div>
    </div>
  );
}