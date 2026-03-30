import { db } from "@/db";
import { academyEnrollments, users, academyBatches, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UsersIcon, AwardIcon, CheckCircleIcon } from "@/components/ui/icons";
import { updateEnrollment } from "../../actions"; // Use existing logic

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [batch] = await db.select().from(academyBatches).where(eq(academyBatches.id, id)).limit(1);
  if (!batch) notFound();

  const students = await db
    .select({
      enrollmentId: academyEnrollments.id,
      name: users.firstName,
      status: academyEnrollments.status,
    })
    .from(academyEnrollments)
    .innerJoin(users, eq(academyEnrollments.userId, users.id))
    .where(eq(academyEnrollments.batchId, id));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center border-b border-stone-100 pb-8">
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Batch Roster</h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">{batch.batchName}</h2>
        </div>
        <UsersIcon className="w-10 h-10 text-stone-100" />
      </header>

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-[10px] uppercase font-black text-stone-400">
            <tr>
              <th className="p-6">Student Identity</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {students.map(s => (
              <tr key={s.enrollmentId} className="hover:bg-stone-50 transition-colors">
                <td className="p-6">
                  <p className="text-sm font-bold text-[#2C1810]">{s.name}</p>
                </td>
                <td className="p-6">
                   <div className="flex items-center gap-2">
                      {s.status === 'GRADUATED' && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                      <span className="text-[9px] font-black uppercase text-stone-500">{s.status?.replace('_', ' ')}</span>
                   </div>
                </td>
                <td className="p-6 text-right">
                   {s.status === 'APPROVED' ? (
                     <button className="text-[10px] font-black uppercase text-[#D4AF37] flex items-center gap-2 hover:text-[#2C1810] ml-auto">
                        <AwardIcon className="w-4 h-4" /> Issue Certificate
                     </button>
                   ) : (
                     <span className="text-[10px] text-stone-300 italic">Processing</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}