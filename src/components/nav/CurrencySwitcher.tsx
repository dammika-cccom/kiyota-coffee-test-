"use client";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-stone-100 p-1 rounded-sm border border-stone-200">
      <button 
        onClick={() => setCurrency('LKR')}
        className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter transition-all ${
          currency === 'LKR' ? 'bg-[#2C1810] text-white shadow-sm' : 'text-stone-400 hover:text-[#2C1810]'
        }`}
      >
        LKR
      </button>
      <button 
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter transition-all ${
          currency === 'USD' ? 'bg-[#D4AF37] text-[#2C1810] shadow-sm' : 'text-stone-400 hover:text-[#2C1810]'
        }`}
      >
        USD
      </button>
    </div>
  );
}