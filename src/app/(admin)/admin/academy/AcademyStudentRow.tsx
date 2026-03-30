"use client";
import { updateStudentStatus } from "./actions";
import { CheckCircleIcon } from "@/components/ui/icons";

// FIXED: Strict Interface instead of 'any'
interface Student {
  id: string;
  fullName: string;
  email: string;
  experienceLevel: string;
  status: string | null;
}

export default function AcademyStudentRow({ student }: { student: Student }) {
  return (
    <div className="p-6 flex justify-between items-center group hover:bg-stone-50/50 transition-all border-b border-stone-50 last:border-none">
      <div className="space-y-1">
        <p className="text-sm font-bold text-[#2C1810]">{student.fullName}</p>
        <p className="text-[10px] text-stone-400 uppercase font-black tracking-tighter">
          {student.email} • {student.experienceLevel}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          defaultValue={student.status || "NEW"} 
          onChange={(e) => updateStudentStatus(student.id, e.target.value)}
          className="text-[10px] font-black uppercase border-none bg-stone-100 px-3 py-1 rounded-full cursor-pointer outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none hover:bg-stone-200 transition-colors"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="ENROLLED">Enrolled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {student.status === 'ENROLLED' && (
          <CheckCircleIcon className="w-4 h-4 text-green-500 animate-in fade-in zoom-in" />
        )}
      </div>
    </div>
  );
}