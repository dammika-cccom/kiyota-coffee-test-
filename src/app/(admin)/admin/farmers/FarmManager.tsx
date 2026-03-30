"use client";

import { useActionState } from "react";
import { updateFarmData } from "./actions"; // FIXED: Removed ActionResponse import

interface Farm {
  id: string;
  region: string;
  farmerCount: number | null;
  nurseryPlants: number | null;
  isPubliclyVisible: boolean | null;
  internalNotes: string | null;
  elevation: string | null;
}

export default function FarmManager({ farm }: { farm: Farm }) {
  // We use .bind to pass the 'id' to the server action
  const updateWithId = updateFarmData.bind(null, farm.id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);

  return (
    <div className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm">
      <form action={formAction} className="space-y-6">
        
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-serif italic text-[#2C1810]">{farm.region}</h3>
           <label className="flex items-center gap-2 cursor-pointer">
              <input name="isPublic" type="checkbox" defaultChecked={farm.isPubliclyVisible || false} className="accent-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Publish to Frontend</span>
           </label>
        </div>

        {/* FEEDBACK MESSAGES */}
        {state?.success && <p className="text-xs font-bold text-green-600 uppercase tracking-widest animate-pulse">{state.success}</p>}
        {state?.error && <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{state.error}</p>}

        <div className="grid grid-cols-2 gap-8 border-y border-stone-50 py-6">
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Farmer Count</label>
              <input name="farmerCount" type="number" defaultValue={farm.farmerCount || 0} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#D4AF37] font-mono bg-transparent" />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Nursery Plants</label>
              <input name="nurseryPlants" type="number" defaultValue={farm.nurseryPlants || 0} className="w-full border-b border-stone-200 py-2 outline-none focus:border-[#D4AF37] font-mono bg-transparent" />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Internal Operational Notes</label>
           <textarea name="internalNotes" defaultValue={farm.internalNotes || ""} rows={3} className="w-full bg-stone-50 p-4 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none" placeholder="monsoon impact, transport issues..." />
           <input type="hidden" name="elevation" defaultValue={farm.elevation || "1200m"} />
        </div>

        <button disabled={isPending} className="w-full bg-[#2C1810] text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all disabled:bg-stone-300">
           {isPending ? "Syncing..." : "Update Region Data"}
        </button>
      </form>
    </div>
  );
}