"use client";
import { useCart } from "@/context/CartContext";
import { ShoppingBagIcon } from "@/components/ui/icons";
import CurrencySwitcher from "./CurrencySwitcher";

export default function NavbarActions({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems } = useCart();

  return (
    <div className="flex items-center gap-6">
      <CurrencySwitcher />
      
      <button 
        onClick={onOpenCart}
        className="relative group flex items-center gap-2 cursor-pointer"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-100 group-hover:border-[#D4AF37] transition-all shadow-sm">
           <ShoppingBagIcon className="w-4 h-4 text-[#2C1810] group-hover:text-[#D4AF37] transition-colors" />
           {totalItems > 0 && (
             <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#2C1810] text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg animate-in zoom-in">
               {totalItems}
             </span>
           )}
        </div>
        <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-[#2C1810]">Bag</span>
      </button>
    </div>
  );
}