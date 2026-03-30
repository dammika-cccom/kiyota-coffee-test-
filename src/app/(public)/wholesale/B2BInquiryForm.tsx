"use client";
import { useActionState } from "react";
import { submitWholesaleInquiry } from "./actions";

export default function B2BInquiryForm() {
  // FIXED: 'state' is now used to display feedback messages below
  const [state, formAction, isPending] = useActionState(submitWholesaleInquiry, { errors: {} });

  return (
    <form action={formAction} className="bg-white p-10 shadow-2xl border border-stone-100 rounded-sm space-y-6">
      <h3 className="text-2xl font-serif italic text-[#2C1810]">Export Specification Request</h3>
      
      {/* Feedback Message Section (Uses 'state') */}
      {state?.error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black uppercase">
          {state.error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <input name="companyName" placeholder="Company Name" className="kiyota-input" required disabled={isPending} />
        <input name="contactName" placeholder="Contact Person" className="kiyota-input" required disabled={isPending} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <input name="email" type="email" placeholder="Business Email" className="kiyota-input" required disabled={isPending} />
        <select name="volume" className="kiyota-input" disabled={isPending}>
          <option value="TRIAL">Trial (50-100kg)</option>
          <option value="LCL">Less than Container (1-5 MT)</option>
          <option value="FCL">Full Container (18 MT+)</option>
        </select>
      </div>

      <textarea 
        name="message" 
        placeholder="Technical requirements (Moisture, SCA Score, Roasting Profile...)" 
        rows={4} 
        className="w-full bg-stone-50 p-4 text-sm outline-none border-b border-stone-200 focus:border-[#D4AF37] disabled:opacity-50" 
        required 
        disabled={isPending}
      />

      <button 
        type="submit"
        disabled={isPending} 
        className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all shadow-xl active:scale-95 disabled:bg-stone-300"
      >
        {isPending ? "Connecting to Supply Chain..." : "Transmit B2B Request"}
      </button>
    </form>
  );
}