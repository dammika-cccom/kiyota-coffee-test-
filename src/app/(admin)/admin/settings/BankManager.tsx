"use client";

import { useState } from "react";
import { upsertBankAccount } from "./actions";
import { bankAccounts } from "@/db/schema";
import { CheckCircleIcon, RefreshCwIcon } from "@/components/ui/icons";

type Account = typeof bankAccounts.$inferSelect;

export default function BankManager({ initialAccounts }: { initialAccounts: Account[] }) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      bankName: formData.get("bankName") as string,
      accountNumber: formData.get("accountNumber") as string,
      branch: formData.get("branch") as string,
      type: formData.get("type") as "RETAIL" | "CORPORATE",
      isActive: true,
    };

    await upsertBankAccount(null, data);
    setIsPending(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-8">
      {/* Existing Accounts List */}
      <div className="space-y-4">
        {initialAccounts.map((acc) => (
          <div key={acc.id} className="flex justify-between items-center bg-stone-50 p-4 rounded-sm border border-stone-100">
            <div>
              <p className="text-[10px] font-black text-[#D4AF37] uppercase">{acc.type}</p>
              <p className="text-sm font-bold text-[#2C1810]">{acc.bankName}</p>
              <p className="text-[10px] font-mono text-stone-400">{acc.accountNumber} • {acc.branch}</p>
            </div>
            {acc.isActive && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
          </div>
        ))}
      </div>

      {/* Add New Account Form */}
      <form onSubmit={handleSubmit} className="pt-6 border-t border-stone-100 space-y-4">
        <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Register New Account</p>
        <div className="grid grid-cols-2 gap-4">
          <input name="bankName" placeholder="Bank Name" className="kiyota-input bg-stone-50" required />
          <input name="branch" placeholder="Branch" className="kiyota-input bg-stone-50" required />
        </div>
        <input name="accountNumber" placeholder="Account Number" className="kiyota-input bg-stone-50 w-full" required />
        <select name="type" className="kiyota-input bg-stone-50 w-full">
          <option value="RETAIL">B2C Retail Account</option>
          <option value="CORPORATE">B2B Corporate Account</option>
        </select>
        <button disabled={isPending} className="w-full py-3 bg-stone-100 text-[#2C1810] text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2">
          {isPending ? <RefreshCwIcon className="w-3 h-3 animate-spin" /> : "Authorize Account"}
        </button>
      </form>
    </div>
  );
}