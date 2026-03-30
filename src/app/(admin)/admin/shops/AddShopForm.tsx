"use client";

import { useActionState } from "react";
import { addShop, ShopState } from "./actions";
import { PlusIcon } from "@/components/ui/icons";

export function AddShopForm() {
  // Logic: useActionState bridges the Server Action (addShop) to this UI.
  // The 'addShop' function now correctly accepts (state, formData).
  const [state, formAction, isPending] = useActionState(addShop, {
    error: "",
    success: ""
  } as ShopState);

  return (
    <div className="space-y-4">
      {/* Dynamic Feedback Messages */}
      <div className="min-h-[20px]">
        {state?.success && (
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
            {state.success}
          </p>
        )}
        {state?.error && (
          <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest animate-in shake">
            {state.error}
          </p>
        )}
      </div>
      
      <form action={formAction} className="flex flex-col md:flex-row gap-4 items-end bg-white p-6 shadow-sm border border-stone-100 rounded-sm">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-[8px] uppercase font-black text-stone-400 tracking-widest">Shop Identity</label>
          <input 
            name="name" 
            required 
            disabled={isPending}
            placeholder="e.g. Colombo Flagship" 
            className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent disabled:opacity-30 transition-all" 
          />
        </div>
        <div className="flex-1 space-y-1 w-full">
          <label className="text-[8px] uppercase font-black text-stone-400 tracking-widest">City / Location</label>
          <input 
            name="location" 
            required 
            disabled={isPending}
            placeholder="e.g. Colombo 07" 
            className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent disabled:opacity-30 transition-all" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full md:w-auto bg-[#2C1810] text-white p-3 px-6 hover:bg-[#D4AF37] transition-all cursor-pointer disabled:bg-stone-300 shadow-lg active:scale-95 flex items-center justify-center"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}