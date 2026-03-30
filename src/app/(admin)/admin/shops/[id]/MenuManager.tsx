"use client";

import { useActionState } from "react";
import { addMenuItem, removeMenuItem } from "./actions";
import { PlusIcon, TrashIcon, CoffeeIcon } from "@/components/ui/icons";
import { MenuItem } from "@/types/retail";

interface MenuManagerProps {
  shopId: string;
  initialMenu: MenuItem[];
}

export function MenuManager({ shopId, initialMenu }: MenuManagerProps) {
  const [state, formAction, isPending] = useActionState(
    addMenuItem.bind(null, shopId), 
    { error: "", success: "" }
  );

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* 1. Add New Item Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810] mb-8">New Menu Entry</h3>
          
          <form action={formAction} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[8px] uppercase font-bold text-stone-400">Item Name</label>
              <input name="name" required disabled={isPending} className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" placeholder="e.g. Kyoto Cold Brew" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] uppercase font-bold text-stone-400">Price (LKR)</label>
                <input name="price" type="number" required disabled={isPending} className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" placeholder="950" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] uppercase font-bold text-stone-400">Category</label>
                <select name="category" className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent">
                  <option value="DRINK">Drink</option>
                  <option value="FOOD">Food</option>
                  <option value="MERCHANDISE">Merchandise</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] uppercase font-bold text-stone-400">Brief Description</label>
              <textarea name="description" disabled={isPending} className="w-full border border-stone-100 p-3 text-sm outline-none focus:border-[#D4AF37] bg-stone-50 h-24 resize-none" placeholder="Notes on flavor profile..." />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#2C1810] text-white py-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 disabled:bg-stone-300"
            >
              {isPending ? "Syncing..." : <><PlusIcon className="w-3 h-3" /> Add to Menu</>}
            </button>
            {state?.success && <p className="text-[9px] text-green-600 font-bold uppercase text-center">{state.success}</p>}
          </form>
        </div>
      </div>

      {/* 2. Live Menu List */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810] flex items-center gap-3">
          <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" /> Active Digital Menu
        </h3>

        <div className="bg-white border border-stone-100 shadow-sm rounded-sm">
          {initialMenu.length > 0 ? (
            <div className="divide-y divide-stone-50">
              {initialMenu.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center group hover:bg-stone-50/50 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-tighter">{item.category}</span>
                    <h4 className="text-sm font-bold text-[#2C1810]">{item.name}</h4>
                    <p className="text-xs text-stone-400 italic font-light">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="font-mono text-sm font-bold text-[#2C1810]">LKR {item.price.toFixed(2)}</p>
                    <button 
                      onClick={async () => {
                        if (confirm(`Remove ${item.name}?`)) await removeMenuItem(shopId, item.id);
                      }}
                      className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center opacity-20">
               <p className="text-xs font-black uppercase tracking-widest italic">Digital menu is currently empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}