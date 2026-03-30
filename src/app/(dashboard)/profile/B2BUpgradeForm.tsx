"use client";

import { useActionState } from "react";
import { requestB2BUpgrade, ProfileState } from "./actions";
import { BuildingIcon, BriefcaseIcon, RefreshCwIcon, ShieldCheckIcon } from "@/components/ui/icons";

export default function B2BUpgradeForm({ userId }: { userId: string }) {
  const [state, formAction, isPending] = useActionState(
    (prevState: ProfileState, formData: FormData) => requestB2BUpgrade(userId, formData),
    { success: undefined, error: undefined }
  );

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-100 p-8 text-center space-y-4 rounded-sm animate-in zoom-in duration-500">
        <ShieldCheckIcon className="w-12 h-12 text-green-600 mx-auto" />
        <h3 className="text-xl font-serif italic text-green-900">Application Transmitted</h3>
        <p className="text-xs text-green-700 uppercase font-black tracking-widest leading-relaxed">
          Kiyota&apos;s governance team is reviewing your credentials. <br /> You will be notified upon authorization.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-100 p-8 shadow-2xl space-y-8 rounded-sm relative overflow-hidden">
      <div className="flex items-center gap-4 border-b border-stone-50 pb-6">
        <BuildingIcon className="w-6 h-6 text-[#D4AF37]" />
        <div>
          <h3 className="text-lg font-serif italic text-[#2C1810]">Institutional Partnership</h3>
          <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em]">Upgrade to Wholesale Tier</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-stone-400">Legal Entity Name</label>
            <input name="companyName" placeholder="e.g. Kyoto Roasters Ltd" className="kiyota-input w-full" required disabled={isPending} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-stone-400">Business Registration (BR)</label>
            <input name="brNumber" placeholder="Reg. Identifier" className="kiyota-input w-full" required disabled={isPending} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-stone-400">Tax / VAT ID</label>
            <input name="vatNumber" placeholder="Tax Identification" className="kiyota-input w-full" disabled={isPending} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-stone-400">Annual Vol. Forecast (MT)</label>
            <select name="forecast" className="kiyota-input w-full bg-transparent" disabled={isPending}>
              <option value="TRIAL">Trial (Under 100kg)</option>
              <option value="LCL">LCL (1 - 5 Metric Tons)</option>
              <option value="FCL">FCL (Full Container Load)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-stone-400">Repayment Terms Requested</label>
          <div className="flex gap-4">
             {["Pre-Paid", "Net-15", "Net-30"].map((term) => (
               <label key={term} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="paymentTerm" value={term} defaultChecked={term === "Pre-Paid"} className="accent-[#D4AF37]" />
                  <span className="text-[10px] font-bold text-stone-500 group-hover:text-[#2C1810] uppercase">{term}</span>
               </label>
             ))}
          </div>
        </div>

        <button 
          disabled={isPending}
          className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isPending ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <BriefcaseIcon className="w-4 h-4" />}
          {isPending ? "Authenticating..." : "Submit B2B Application"}
        </button>

        {state?.error && (
          <p className="text-red-500 text-[9px] font-black uppercase text-center tracking-widest">{state.error}</p>
        )}
      </form>
    </div>
  );
}