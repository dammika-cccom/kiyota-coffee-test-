"use client";

import { useState } from "react";
import { updateFarmRegion, deleteFarmRegion } from "./actions";
import { MapPinIcon, TrashIcon } from "@/components/ui/icons";

interface Farm {
  id: string;
  region: string;
  farmerCount: number | null;
  nurseryPlants: number | null;
  elevation: string | null;
  description: string | null;
}

export default function FarmStatsCard({ farm }: { farm: Farm }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    
    /* 
       FIXED: Passed '{}' as the 2nd argument instead of 'null'. 
       This aligns with the strict ActionResponse type in actions.ts.
    */
    const res = await updateFarmRegion(farm.id, {}, formData);
    
    setIsPending(false);
    
    // FIXED: Added check to ensure 'res' exists before accessing .success
    if (res && res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  }

  return (
    <div className="bg-white p-8 border border-stone-100 shadow-sm hover:border-[#D4AF37]/30 transition-all rounded-sm group relative">
      <form action={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
           <div>
              <h4 className="text-xl font-serif italic text-[#2C1810]">{farm.region}</h4>
              <div className="flex items-center gap-2 mt-1">
                 <MapPinIcon className="w-3 h-3 text-[#D4AF37]" />
                 <input 
                    name="elevation" 
                    defaultValue={farm.elevation || ""} 
                    className="text-[10px] font-black uppercase text-stone-400 bg-transparent outline-none focus:text-[#2C1810]"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              {isSaved && <span className="text-[9px] font-black text-green-600 uppercase animate-pulse">Synced</span>}
              <button 
                type="button"
                onClick={() => confirm("Security Protocol: Permanently delete this region from facilitation records?") && deleteFarmRegion(farm.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-50">
           <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-stone-400">Farmer Families</label>
              <input 
                name="farmerCount" 
                type="number" 
                defaultValue={farm.farmerCount || 0} 
                className="w-full border-b border-stone-100 py-1 text-sm outline-none focus:border-[#D4AF37] font-mono bg-transparent"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-stone-400">Nursery Plants</label>
              <input 
                name="nurseryPlants" 
                type="number" 
                defaultValue={farm.nurseryPlants || 0} 
                className="w-full border-b border-stone-100 py-1 text-sm outline-none focus:border-[#D4AF37] font-mono bg-transparent"
              />
           </div>
        </div>

        <div className="space-y-1">
           <label className="text-[8px] font-black uppercase text-stone-400">Region Summary</label>
           <textarea 
             name="description" 
             rows={2}
             defaultValue={farm.description || ""} 
             className="w-full bg-stone-50 p-3 text-xs outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-sm resize-none"
           />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-[#2C1810] transition-colors cursor-pointer flex items-center gap-2 border-none bg-transparent p-0 disabled:opacity-30"
        >
           {isPending ? "Syncing..." : "Update Log →"}
        </button>
      </form>
    </div>
  );
}