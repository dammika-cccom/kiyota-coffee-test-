"use client";

import { useActionState, useEffect, useRef } from "react";
import { logPlantDistribution, ActionResponse } from "./actions";
import { ClipboardListIcon, CheckCircleIcon, TrendingUpIcon } from "@/components/ui/icons";

// FIXED: Defined strict interfaces to remove 'any' errors
interface FarmOption {
  id: string;
  region: string;
}

interface LedgerEntry {
  id: string;
  farmerName: string;
  plantsGiven: number;
  date: Date | null;
  region: string | null;
}

export default function NurseryLedgerUI({ 
  farmsList, 
  history 
}: { 
  farmsList: FarmOption[], 
  history: LedgerEntry[] 
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    logPlantDistribution, 
    null as ActionResponse
  );

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      {/* LEFT: INPUT FORM */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 border border-stone-100 shadow-xl rounded-sm">
          <div className="flex items-center justify-between mb-8 border-b border-stone-50 pb-4">
            <div className="flex items-center gap-3">
                <TrendingUpIcon className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-[#2C1810]">Log Distribution</h3>
            </div>
            {/* FIXED: CheckCircleIcon now used for success feedback */}
            {state?.success && <CheckCircleIcon className="w-5 h-5 text-green-500 animate-bounce" />}
          </div>

          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-stone-400">Recipient Farmer</label>
              <input name="farmerName" required disabled={isPending} className="kiyota-input w-full" placeholder="Full Name" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-stone-400">Seedling Quantity</label>
              <input name="count" type="number" required disabled={isPending} className="kiyota-input w-full" placeholder="e.g. 500" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-stone-400">Nursery Region</label>
              <select name="farmId" disabled={isPending} className="kiyota-input w-full bg-transparent cursor-pointer" required>
                <option value="">Select Farm...</option>
                {farmsList.map(f => <option key={f.id} value={f.id}>{f.region}</option>)}
              </select>
            </div>

            <button disabled={isPending} className="w-full bg-[#2C1810] text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-lg active:scale-95 disabled:opacity-30">
              {isPending ? "Updating Registry..." : "Confirm facilitation"}
            </button>
          </form>
          {state?.success && <p className="mt-4 text-green-600 text-[10px] font-black uppercase">{state.success}</p>}
          {state?.error && <p className="mt-4 text-red-500 text-[10px] font-black uppercase">{state.error}</p>}
        </div>
      </div>

      {/* RIGHT: LIVE AUDIT TRAIL */}
      <div className="lg:col-span-2 bg-white border border-stone-100 shadow-sm rounded-sm overflow-hidden">
        <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
             <ClipboardListIcon className="w-4 h-4" /> Recent Facilitation Logs
           </h4>
           <span className="text-[8px] font-bold bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">Traceable History</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-stone-50">
            {history.map((log) => (
              <tr key={log.id} className="text-xs hover:bg-stone-50/50 transition-colors">
                <td className="p-4 font-bold text-[#2C1810]">{log.farmerName}</td>
                <td className="p-4 text-stone-400 uppercase tracking-tighter">{log.region}</td>
                <td className="p-4"><span className="text-green-600 font-mono font-bold">+{log.plantsGiven}</span></td>
                <td className="p-4 text-right text-stone-300 font-mono">
                    {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && (
          <div className="py-20 text-center opacity-20 italic">
             <p className="text-xs font-black uppercase tracking-widest">Awaiting facilitation records...</p>
          </div>
        )}
      </div>
    </div>
  );
}