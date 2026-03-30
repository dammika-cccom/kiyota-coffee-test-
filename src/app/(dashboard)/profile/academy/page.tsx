import { getStudentMasterlog } from "../actions";
import { BookOpenIcon, ClockIcon, AwardIcon, CheckCircleIcon } from "@/components/ui/icons";
import Link from "next/link";

export default async function AcademyStudentPage() {
  // 1. Fetch real student data from D-Drive Database
  // Returns: { enrollmentId, status, courseTitle, batchName, startDate }
  const masterlog = await getStudentMasterlog();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b border-stone-100 pb-6">
        <div className="space-y-1">
            <h2 className="text-3xl font-serif italic text-[#2C1810]">My Academy Journey</h2>
            <p className="text-stone-400 text-sm italic">Track your technical mastery and certifications.</p>
        </div>
        <BookOpenIcon className="w-8 h-8 text-[#D4AF37] opacity-20" />
      </header>

      {/* ENROLLMENT LIST */}
      <div className="grid gap-6">
        {masterlog.map((log) => (
          <div 
            key={log.enrollmentId} 
            className="bg-white p-8 border border-stone-100 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[#D4AF37] transition-all"
          >
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-[#FAF9F6] transition-colors">
                 <ClockIcon className="w-6 h-6 text-[#2C1810] opacity-20 group-hover:opacity-100 transition-all" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Enrolled Curriculum</p>
                {/* DYNAMIC DATA: Using real course titles from the database join */}
                <h4 className="text-xl font-bold text-[#2C1810]">{log.courseTitle}</h4>
                <p className="text-xs text-stone-500 uppercase tracking-tighter mt-1">{log.batchName}</p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
               {/* STATUS BADGE */}
               <div className="flex items-center gap-2">
                  {log.status === 'GRADUATED' && <CheckCircleIcon className="w-3.5 h-3.5 text-green-600" />}
                  <span className={`text-[9px] font-black uppercase px-4 py-1 rounded-full border ${
                    log.status === 'GRADUATED' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-stone-50 text-stone-400 border-stone-100'
                  }`}>
                    {log.status?.replace('_', ' ') || "PENDING"}
                  </span>
               </div>

               {/* DATE OR CERTIFICATE ACTION */}
               {log.status === 'GRADUATED' ? (
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-[#D4AF37] border-b border-[#D4AF37] pb-0.5 hover:text-[#2C1810] hover:border-[#2C1810] transition-all cursor-pointer">
                    <AwardIcon className="w-4 h-4" /> Download Certificate
                 </button>
               ) : (
                 <p className="text-[10px] font-mono text-stone-300">
                    Commences: {log.startDate ? new Date(log.startDate).toLocaleDateString() : 'TBD'}
                 </p>
               )}
            </div>
          </div>
        ))}

        {/* EMPTY STATE: Resolves UI gap for new users */}
        {masterlog.length === 0 && (
          <div className="py-24 text-center bg-white border border-dashed border-stone-200 rounded-sm opacity-50">
             <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-stone-200" />
             <p className="text-xs uppercase font-black tracking-widest text-stone-400">No active academy records found</p>
             <Link href="/academy" className="text-[10px] font-black uppercase text-[#D4AF37] underline mt-4 inline-block">
                View Available Courses
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}