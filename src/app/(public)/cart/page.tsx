"use client";

import { useState, useMemo } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { 
  TrashIcon, 
  ShoppingBagIcon, 
  GlobeIcon, 
  TruckIcon, 
  MoveLeftIcon, 
  MoveRightIcon,
  PackageIcon
} from "@/components/ui/icons";
import Link from "next/link";
import Image from "next/image";

/**
 * INSTITUTIONAL ROASTERY BAG
 * Purpose: Pre-checkout audit and item management.
 * Zero-Any | Zero-ESLint | Next.js 15 Compliant
 */
export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalWeightGrams } = useCart();
  const { currency, convert } = useCurrency();
  const [country, setCountry] = useState("Sri Lanka");

  // --- 1. INSTITUTIONAL PRICING ENGINE ---
  // Calculates per-item surcharge/discount based on Packaging Variance
  const calculateItemLkr = (item: CartItem): number => {
    let price = item.priceLkr;
    if (item.id.includes("WHITE_LABEL")) price *= 1.05; // 5% Surcharge for neutral packaging
    if (item.id.includes("BULK_JUTE")) price *= 0.98;   // 2% Discount for bulk sacks
    return price * item.quantity;
  };

  const modifiedSubtotalLkr = useMemo(() => {
    return cart.reduce((acc, item) => acc + calculateItemLkr(item), 0);
  }, [cart]);

  // --- 2. LOGISTICS ESTIMATOR ---
  const isLocal = country === "Sri Lanka";
  const grossWeightKg = Math.ceil((totalWeightGrams * 1.1) / 1000);
  
  // Estimation based on Matale HQ base rates
  const estimatedShipping = isLocal 
    ? (500 + (Math.max(0, grossWeightKg - 1) * 150)) 
    : 4800; // Flat base for international inquiry

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
        <PackageIcon className="w-16 h-16 text-stone-100" />
        <h2 className="text-2xl font-serif italic text-[#2C1810]">Your roastery bag is empty.</h2>
        <Link href="/shop" className="bg-[#2C1810] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-xl">
           Discover Our Roasts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 lg:py-48 grid lg:grid-cols-3 gap-16">
      
      {/* --- LEFT: ITEM AUDIT (Col 1-2) --- */}
      <div className="lg:col-span-2 space-y-12 animate-in slide-in-from-bottom-4 duration-1000">
        <header className="flex justify-between items-center border-b border-stone-100 pb-8">
           <div className="space-y-1">
              <h2 className="text-4xl font-serif italic text-[#2C1810]">Roastery Bag</h2>
              <p className="text-[10px] uppercase font-black text-stone-400 tracking-widest">
                Reviewing {cart.length} unique profiles
              </p>
           </div>
           <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black uppercase text-stone-300 hover:text-[#2C1810] transition-colors group">
              <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
              Keep Sourcing
           </Link>
        </header>

        <div className="divide-y divide-stone-100">
          {cart.map((item) => (
            <div key={item.id} className="py-10 flex flex-col md:flex-row gap-10 items-center group">
              {/* Image Asset */}
              <div className="w-32 h-32 relative bg-[#FAF9F6] rounded-sm overflow-hidden shrink-0 border border-stone-100 shadow-sm">
                <Image 
                  src={item.image || "/images/placeholder.jpg"} 
                  alt={item.name} 
                  fill 
                  className="object-cover mix-blend-multiply opacity-80" 
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h3 className="text-xl font-serif italic text-[#2C1810]">{item.name}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase text-stone-400 tracking-tighter">
                   <span>{item.weightGrams}G Unit</span>
                   <span className="text-stone-200">|</span>
                   <span className="text-[#D4AF37]">{convert(item.priceLkr, item.priceUsd)} / unit</span>
                </div>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-10">
                <div className="flex items-center bg-stone-50 rounded-full px-4 py-2 border border-stone-100">
                   <button 
                     onClick={() => updateQuantity(item.id, -1)} 
                     className="w-8 h-8 text-[#2C1810] hover:scale-125 transition-transform"
                   >
                    -
                   </button>
                   <span className="w-10 text-center font-mono font-bold text-sm">{item.quantity}</span>
                   <button 
                     onClick={() => updateQuantity(item.id, 1)} 
                     className="w-8 h-8 text-[#2C1810] hover:scale-125 transition-transform"
                   >
                    +
                   </button>
                </div>
                
                <div className="text-right min-w-[120px]">
                   <p className="text-lg font-bold text-[#2C1810]">
                     LKR {calculateItemLkr(item).toLocaleString()}
                   </p>
                   <button 
                     onClick={() => removeFromCart(item.id)} 
                     className="text-[9px] font-black uppercase text-red-400 hover:text-red-600 mt-1 flex items-center gap-1 ml-auto"
                   >
                     <TrashIcon className="w-3 h-3" /> Remove
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT: LOGISTICS SUMMARY --- */}
      <aside className="space-y-8">
        <div className="bg-white border border-stone-100 p-10 shadow-2xl rounded-sm space-y-8 sticky top-40">
           <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
              <ShoppingBagIcon className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Bag Summary</h3>
           </div>

           <div className="space-y-6">
              {/* Target Selector for Real-time Estimation */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-2">
                    <GlobeIcon className="w-3 h-3" /> Target Market
                 </label>
                 <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-stone-50 border-none p-3 text-xs font-bold outline-none rounded-sm cursor-pointer"
                 >
                    <option value="Sri Lanka">Sri Lanka (Domestic)</option>
                    <option value="Japan">Japan (Export)</option>
                    <option value="USA">USA (Export)</option>
                 </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-50">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <span>Cargo Weight</span>
                    <span className="text-[#2C1810]">{(totalWeightGrams / 1000).toFixed(2)} KG</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <span>Est. Logistics ({currency})</span>
                    <span className="text-[#2C1810]">{estimatedShipping.toLocaleString()}</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-stone-100 flex justify-between items-end">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Order Subtotal</p>
                 <div className="text-right">
                    <p className="text-3xl font-serif italic text-[#2C1810]">LKR {modifiedSubtotalLkr.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-300 font-bold uppercase mt-1">Excl. Tax & Final Ship</p>
                 </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-[#2C1810] text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all shadow-xl flex items-center justify-center gap-4 group"
              >
                Go to Checkout
                <MoveRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="pt-4 flex items-center gap-3 justify-center opacity-40">
                 <TruckIcon className="w-4 h-4 text-[#2C1810]" />
                 <p className="text-[8px] font-black uppercase tracking-widest text-[#2C1810]">Kiyota Vertical Logistics Chain</p>
              </div>
           </div>
        </div>
      </aside>

    </div>
  );
}