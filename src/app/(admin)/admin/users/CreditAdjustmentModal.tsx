"use client";

import { useState } from "react";
import { adjustCreditLedger } from "./credit-actions";
import { XIcon, ShieldCheckIcon, RefreshCwIcon, TrendingUpIcon } from "@/components/ui/icons";

interface CreditModalProps {
  user: { id: string; email: string; creditLimit: string; creditBalance: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditAdjustmentModal({ user, isOpen, onClose }: CreditModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState({ limit: user.creditLimit, balance: user.creditBalance });

  if (!isOpen) return null;

  const handleUpdate = async () => {
    setIsPending(true);
    const res = await adjustCreditLedger(user.id, data);
    if (res.success) {
       alert(res.success);
       onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <header className="bg-[#2C1810] p-6 text-white flex justify-between items-center">
           <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif italic text-xl">Credit Governance</h3>
           </div>
           <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors cursor-pointer"><XIcon className="w-5 h-5" /></button>
        </header>

        <div className="p-8 space-y-8">
           <div className="space-y-1 text-center bg-stone-50 py-4 border border-stone-100">
              <p className="text-[10px] font-black uppercase text-stone-400">Adjusting Partner Ledger</p>
              <p className="text-sm font-bold text-[#2C1810]">{user.email}</p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-stone-400 flex items-center gap-2">
                    <TrendingUpIcon className="w-3 h-3" /> Master Credit Limit (LKR)
                 </label>
                 <input 
                   type="number" 
                   value={data.limit} 
                   onChange={(e) => setData({...data, limit: e.target.value})}
                   className="kiyota-input w-full font-mono font-bold text-[#2C1810] text-center" 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-stone-400 flex items-center gap-2">
                    <RefreshCwIcon className="w-3 h-3" /> Available Balance (LKR)
                 </label>
                 <input 
                   type="number" 
                   value={data.balance} 
                   onChange={(e) => setData({...data, balance: e.target.value})}
                   className="kiyota-input w-full font-mono font-bold border-[#D4AF37] text-[#2C1810] text-center" 
                 />
              </div>
           </div>

           <button 
             disabled={isPending}
             onClick={handleUpdate}
             className="w-full bg-[#2C1810] text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl cursor-pointer"
           >
             {isPending ? <RefreshCwIcon className="w-3 h-3 animate-spin" /> : <ShieldCheckIcon className="w-3 h-3" />}
             {isPending ? "Syncing..." : "Commit Ledger Override"}
           </button>
        </div>
      </div>
    </div>
  );
}