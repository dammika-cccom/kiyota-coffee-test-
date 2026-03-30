"use client";

import { useState } from "react";
import { addCountry } from "./actions";
import { countries } from "@/db/schema";
import { GlobeIcon, RefreshCwIcon } from "@/components/ui/icons";

type Country = typeof countries.$inferSelect;

export default function CountryManager({ initialCountries }: { initialCountries: Country[] }) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    await addCountry(
      formData.get("name") as string,
      formData.get("code") as string
    );
    
    setIsPending(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-8">
      {/* Country List Scroll Area */}
      <div className="max-h-48 overflow-y-auto pr-2 space-y-2 no-scrollbar">
        {initialCountries.map((c) => (
          <div key={c.id} className="flex justify-between items-center bg-white p-3 rounded-sm border border-stone-200">
            <div className="flex items-center gap-3">
              <GlobeIcon className="w-3 h-3 text-stone-300" />
              <p className="text-[10px] font-bold text-[#2C1810] uppercase">{c.name}</p>
            </div>
            <span className="text-[9px] font-mono text-stone-400">{c.code}</span>
          </div>
        ))}
      </div>

      {/* Add New Country Form */}
      <form onSubmit={handleSubmit} className="pt-6 border-t border-stone-200 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <input name="name" placeholder="Country Name" className="col-span-2 kiyota-input bg-white" required />
          <input name="code" placeholder="ISO Code" className="kiyota-input bg-white" required maxLength={3} />
        </div>
        <button disabled={isPending} className="w-full py-3 bg-[#2C1810] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2">
          {isPending ? <RefreshCwIcon className="w-3 h-3 animate-spin" /> : "Add to Destination Registry"}
        </button>
      </form>
    </div>
  );
}