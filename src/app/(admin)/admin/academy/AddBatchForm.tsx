"use client";

import { useActionState } from "react";
import { createBatch, AcademyState } from "./actions";
import { PlusIcon, ClockIcon } from "@/components/ui/icons";

interface CourseOption {
  id: string;
  title: string;
}

export function AddBatchForm({ coursesList }: { coursesList: CourseOption[] }) {
  const [state, formAction, isPending] = useActionState(createBatch, { error: "", success: "" } as AcademyState);

  return (
    <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6">
      <div className="flex items-center gap-3">
        <ClockIcon className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">New Session Scheduling</h3>
      </div>

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">Course Template</label>
          <select name="courseId" required className="kiyota-input w-full bg-transparent">
            <option value="">Select Curriculum...</option>
            {coursesList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">Batch Identifier</label>
          <input name="batchName" required placeholder="e.g. May Morning" className="kiyota-input w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">Commencement Date</label>
          <input name="startDate" type="date" required className="kiyota-input w-full" />
        </div>
        <button disabled={isPending} className="bg-[#2C1810] text-white py-3 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-all disabled:opacity-30">
          {isPending ? "Syncing..." : <><PlusIcon className="w-4 h-4" /> Confirm Schedule</>}
        </button>
      </form>
      
      <div className="h-4">
        {state?.success && <p className="text-green-600 text-[10px] font-bold uppercase">{state.success}</p>}
        {state?.error && <p className="text-red-500 text-[10px] font-bold uppercase">{state.error}</p>}
      </div>
    </div>
  );
}