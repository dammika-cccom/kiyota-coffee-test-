"use client";

import { useActionState, useEffect, useRef } from "react";
import { createRegion, ActionResponse } from "./actions";
import { PlusIcon } from "@/components/ui/icons";

export default function AddRegionForm() {
  // FIXED: Initialized with an object {} instead of null to clear ts(18047)
  const [state, formAction, isPending] = useActionState(createRegion, {} as ActionResponse);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="space-y-2">
      <div className="h-4">
        {state?.success && (
          <p className="text-[10px] text-green-600 font-bold uppercase animate-in fade-in">
            {state.success}
          </p>
        )}
        {state?.error && (
          <p className="text-[10px] text-red-600 font-bold uppercase animate-in shake">
            {state.error}
          </p>
        )}
      </div>

      <form 
        ref={formRef}
        action={formAction} 
        className="flex gap-4 items-end bg-white p-4 shadow-sm border border-stone-100 rounded-sm"
      >
        <div className="space-y-1">
          <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
            New Facilitation Region
          </label>
          <input 
            name="region" 
            required 
            placeholder="e.g. Badulla" 
            disabled={isPending}
            className="border-b border-stone-200 py-1 text-xs outline-none focus:border-[#D4AF37] bg-transparent w-40 disabled:opacity-30" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-[#2C1810] text-white p-2 px-4 hover:bg-[#D4AF37] transition-all cursor-pointer disabled:bg-stone-300"
        >
          {isPending ? "..." : <PlusIcon className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}