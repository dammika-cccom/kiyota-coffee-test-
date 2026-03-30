import { db } from "@/db";
import { courses, academyEnrollments, academyBatches } from "@/db/schema";
import { count, eq, sql, asc } from "drizzle-orm";
import { BookOpenIcon, ClockIcon, TrendingUpIcon } from "@/components/ui/icons";
import Link from "next/link";
import { AddBatchForm } from "./AddBatchForm";

export default async function AcademyAdminPage() {
  const allCourses = await db.select().from(courses);
  const activeBatches = await db.select().from(academyBatches).orderBy(asc(academyBatches.startDate));
  
  const [pending] = await db.select({ val: count() })
    .from(academyEnrollments).where(eq(academyEnrollments.status, "PENDING_APPROVAL"));

  // Utilizing 'sql' for capacity analysis
  const stats = await db.select({ 
    enrolled: sql<number>`sum(${academyBatches.currentEnrollment})`,
    total: sql<number>`sum(${academyBatches.maxCapacity})` 
  }).from(academyBatches);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="border-b border-stone-200 pb-8 flex justify-between items-end">
          <div className="space-y-2">
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Institutional Wing</h5>
            <h2 className="text-4xl font-serif italic text-[#2C1810]">Academy Command</h2>
          </div>
          <div className="bg-stone-50 px-4 py-2 border border-stone-100 rounded-sm flex items-center gap-3">
             <TrendingUpIcon className="w-4 h-4 text-green-600" />
             <span className="text-[9px] font-black uppercase text-[#2C1810]">Demand: High</span>
          </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#2C1810] p-8 rounded-sm text-white shadow-xl flex justify-between items-center relative overflow-hidden">
          <TrendingUpIcon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 text-white" />
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">Enrolment Waitlist</p>
            <p className="text-3xl font-bold mt-1">{pending.val} Global Leads</p>
          </div>
        </div>
        <div className="bg-white p-8 border border-stone-100 rounded-sm flex items-center justify-between">
           <div>
              <p className="text-[9px] font-black uppercase text-stone-400">Classroom Occupancy</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stats[0]?.enrolled || 0} / {stats[0]?.total || 0}</p>
           </div>
           <BookOpenIcon className="w-10 h-10 text-stone-100" />
        </div>
      </div>

      <AddBatchForm coursesList={allCourses} />

      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Batch Timelines</h3>
        <div className="bg-white border border-stone-100 rounded-sm divide-y divide-stone-50">
          {activeBatches.map(b => (
            <div key={b.id} className="p-5 flex justify-between items-center group hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 text-[#D4AF37]" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-[#2C1810]">{b.batchName}</p>
                    <p className="text-[9px] uppercase font-black text-stone-400">{new Date(b.startDate).toLocaleDateString()}</p>
                 </div>
              </div>
              <Link href={`/admin/academy/batches/${b.id}`} className="text-[10px] font-black uppercase text-[#D4AF37] border-b border-transparent hover:border-[#D4AF37] transition-all">View Roster →</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}