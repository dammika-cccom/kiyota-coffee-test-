"use client";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon, MoveRightIcon, PackageIcon } from "@/components/ui/icons";

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, subtotalLkr, subtotalUsd, totalWeightGrams } = useCart();
  const { currency } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#2C1810]/40 backdrop-blur-sm" onClick={onClose} />

      {/* SIDEBAR PANEL */}
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* HEADER */}
        <header className="p-8 border-b border-stone-100 flex justify-between items-end">
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Selected Roasts</h5>
            <h2 className="text-3xl font-serif italic text-[#2C1810]">Shopping Bag</h2>
          </div>
          <button onClick={onClose} className="text-[10px] font-black uppercase text-stone-400 hover:text-[#2C1810] mb-1 cursor-pointer">
            Close [esc]
          </button>
        </header>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-20 h-24 relative bg-stone-50 rounded-sm overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black uppercase text-[#2C1810] tracking-widest">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-400 uppercase font-bold mt-1">
                      {item.weightGrams}G Bag
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-stone-50 px-3 py-1 rounded-full">
                       <button onClick={() => updateQuantity(item.id, -1)} className="text-xs font-black text-stone-400 hover:text-[#2C1810]">-</button>
                       <span className="text-xs font-black text-[#2C1810]">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, 1)} className="text-xs font-black text-stone-400 hover:text-[#2C1810]">+</button>
                    </div>
                    <p className="text-xs font-bold text-[#2C1810]">
                      {currency === 'LKR' ? `Rs. ${(item.priceLkr * item.quantity).toLocaleString()}` : `$${(item.priceUsd * item.quantity).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20 italic">
               <PackageIcon className="w-12 h-12 text-[#2C1810]" />
               <p className="text-[10px] uppercase font-black tracking-widest text-[#2C1810]">Bag is empty</p>
            </div>
          )}
        </div>

        {/* FOOTER & TOTALS */}
        {cart.length > 0 && (
          <footer className="p-8 bg-[#FAF9F6] border-t border-stone-100 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-400 uppercase">
                 <span>Gross Weight</span>
                 <span>{totalWeightGrams / 1000} KG</span>
              </div>
              <div className="flex justify-between items-end">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Order Subtotal</p>
                 <p className="text-2xl font-serif italic text-[#2C1810]">
                   {currency === 'LKR' ? `LKR ${subtotalLkr.toLocaleString()}` : `$${subtotalUsd.toFixed(2)}`}
                 </p>
              </div>
            </div>

            <Link 
              href="/checkout" 
              onClick={onClose}
              className="w-full bg-[#2C1810] text-white flex items-center justify-center gap-4 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-xl group"
            >
              Secure Checkout
              <MoveRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <p className="text-[8px] text-center text-stone-400 uppercase font-bold tracking-widest">
              Standard Matale Logistics Rates Apply
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}