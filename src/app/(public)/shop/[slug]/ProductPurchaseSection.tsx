"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBagIcon, PlusIcon, MinusIcon, ShieldCheckIcon } from "@/components/ui/icons";
import type { ProductRecord } from "./page";

export default function ProductPurchaseSection({ product, userRole }: { product: ProductRecord, userRole: string }) {
  const isWholesale = userRole === "WHOLESALE_USER" || userRole === "SUPER_ADMIN";
  
  // Enforce institutional MOQ for partners
  const minQty = isWholesale ? (product.moq || 10) : 1;
  const [qty, setQty] = useState(minQty);
  const [packaging, setPackaging] = useState("KIYOTA_BRANDED");
  
  const { addToCart } = useCart();
  const { convert, currency } = useCurrency();

  // Tiered Pricing Selection
  const activeLkr = isWholesale ? product.wholesalePriceLkr : product.priceLkr;
  const activeUsd = isWholesale ? product.wholesalePriceUsd : product.priceUsd;

  const handleAddToCart = () => {
    const images = product.imageUrls as string[] | null;
    addToCart({
      id: `${product.id}-${packaging}`, // Institutional SKU variance
      name: `${product.name} (${packaging.replace("_", " ")})`,
      priceLkr: Number(activeLkr || 0),
      priceUsd: Number(activeUsd || 0),
      weightGrams: product.weightGrams,
      quantity: qty,
      image: images?.[0] || "/images/placeholder.jpg",
      slug: product.slug
    }, qty);
  };

  return (
    <div className="bg-[#2C1810] p-10 rounded-sm text-white space-y-10 shadow-2xl relative border border-white/5 overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <ShoppingBagIcon className="w-64 h-64" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-baseline border-b border-white/10 pb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
              {isWholesale ? "Partner Procurement Rate" : "Fulfillment Rate"}
            </p>
            <h3 className="text-4xl font-bold mt-2">{convert(activeLkr, activeUsd)}</h3>
          </div>
          {isWholesale && (
             <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full">
                <ShieldCheckIcon className="w-3 h-3 text-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Wholesale</span>
             </div>
          )}
        </div>

        <div className="space-y-6 pt-8">
          {/* PACKAGING SELECTOR - B2B EXCLUSIVE */}
          {isWholesale && (
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Packaging Protocol</label>
                <select 
                  value={packaging} 
                  onChange={(e) => setPackaging(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                >
                   <option value="KIYOTA_BRANDED" className="bg-stone-900">Kiyota Retail Branded (Valve)</option>
                   <option value="WHITE_LABEL" className="bg-stone-900">Neutral White Label (Export Neutral)</option>
                   <option value="BULK_JUTE" className="bg-stone-900">Institutional Jute Sack (Bulk 60KG)</option>
                </select>
             </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-sm w-full md:w-48">
              <button 
                onClick={() => setQty(Math.max(minQty, qty - 1))} 
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-[#D4AF37]"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="text-sm font-black font-mono w-10 text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)} 
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-[#D4AF37]"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <button 
               onClick={handleAddToCart}
               className="flex-1 bg-[#D4AF37] text-[#2C1810] py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
            >
              <ShoppingBagIcon className="w-4 h-4" /> Add to Bag
            </button>
          </div>

          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-stone-500 border-t border-white/5 pt-4">
             <span>{currency === 'LKR' ? 'Domestic Supply' : 'Global Export'}</span>
             {isWholesale && <span>Applied MOQ: {minQty} Units</span>}
          </div>
        </div>
      </div>
    </div>
  );
}