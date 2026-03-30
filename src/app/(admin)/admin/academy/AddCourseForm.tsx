"use client";

import { useActionState } from "react";
import { addCourse, AcademyState } from "./actions";
import { PlusIcon, ClockIcon } from "@/components/ui/icons";

export function AddCourseForm() {
  const [state, formAction, isPending] = useActionState(addCourse, {
    error: "",
    success: ""
  } as AcademyState);

  return (
    <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm">
      <div className="flex items-center gap-3 mb-8">
        <ClockIcon className="w-4 h-4 text-[#D4AF37]" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Schedule New Session</h3>
      </div>

      {state?.success && (
        <p className="text-[10px] text-green-600 font-bold uppercase mb-4 animate-in slide-in-from-left-2">{state.success}</p>
      )}

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        <div className="md:col-span-2 space-y-1">
          <label className="text-[8px] uppercase font-black text-stone-400">Course Title</label>
          <input name="title" required disabled={isPending} placeholder="e.g. V60 Mastery" className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase font-black text-stone-400">Level</label>
          <select name="level" className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent">
            <option value="Beginner">Beginner</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase font-black text-stone-400">Start Date</label>
          <input name="startDate" type="date" required disabled={isPending} className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-[#2C1810] text-white p-3 hover:bg-[#D4AF37] transition-all cursor-pointer flex items-center justify-center disabled:bg-stone-300"
        >
          {isPending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <PlusIcon className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}