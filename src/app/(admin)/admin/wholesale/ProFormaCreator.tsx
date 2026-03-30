"use client";

import { useState, useActionState } from "react";
import { generateProForma } from "@/lib/generateProForma";
import { registerB2BQuote, QuoteResponse } from "./actions";
import {  GlobeIcon } from "@/components/ui/icons";

interface B2BLead {
  id: string;
  companyName: string | null;
  contactName: string;
  location: string;
  volumeRequirement: string | null;
}

export default function ProFormaCreator({ lead }: { lead: B2BLead }) {
  const [fob, setFob] = useState(12.50);
  const [freight, setFreight] = useState(450);
  const [insurance, setInsurance] = useState(50);

  const [state, formAction, isPending] = useActionState(
    (prevState: QuoteResponse, fd: FormData) => registerB2BQuote(lead.id, fd), 
    null
  );

  const qty = parseInt(lead.volumeRequirement || "100") || 100;
  const landedTotal = (qty * fob) + freight + insurance;

  const handlePDF = () => {
    generateProForma({
      company: lead.companyName || "Private Buyer",
      contact: lead.contactName,
      destination: lead.location,
      product: "Institutional Grade Ceylon Arabica",
      qty, fob, freight, insurance
    });
  };

  return (
    <div className="bg-[#FAF9F6] p-6 border border-stone-200 rounded-sm space-y-6">
      <form id={`form-${lead.id}`} action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input name="fobPrice" type="number" step="0.01" value={fob} onChange={(e) => setFob(parseFloat(e.target.value) || 0)} className="kiyota-input text-xs" placeholder="FOB Price" />
          <input name="freight" type="number" value={freight} onChange={(e) => setFreight(parseFloat(e.target.value) || 0)} className="kiyota-input text-xs" placeholder="Freight" />
          <input name="insurance" type="number" value={insurance} onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)} className="kiyota-input text-xs" placeholder="Insurance" />
          <input type="hidden" name="quantity" value={qty} />
        </div>
      </form>

      <div className="bg-white p-4 border border-stone-100 rounded-sm shadow-inner">
         <p className="text-[8px] font-black uppercase text-stone-300">Total Landed (CIF)</p>
         <p className="text-xl font-bold text-[#D4AF37] mb-4">USD {landedTotal.toLocaleString()}</p>
         
         <div className="flex gap-2">
            {/* FIXED: Removed (as any) by using form attribute */}
            <button 
              form={`form-${lead.id}`}
              type="submit" 
              disabled={isPending} 
              className="flex-1 bg-[#2C1810] text-white py-2 text-[9px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
            >
              {isPending ? "..." : "Record"}
            </button>
            <button 
              type="button" 
              onClick={handlePDF} 
              className="flex-1 bg-[#D4AF37] text-white py-2 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <GlobeIcon className="w-3 h-3" /> PDF
            </button>
         </div>
      </div>
      {state?.success && <p className="text-[8px] text-green-600 font-bold text-center uppercase tracking-tighter">✓ Recorded in Ledger</p>}
    </div>
  );
}