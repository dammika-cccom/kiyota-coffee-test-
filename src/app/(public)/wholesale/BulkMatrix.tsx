"use client";

import { useState } from "react";
import { SensoryProduct } from "@/types/store";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBagIcon, RefreshCwIcon, TrendingUpIcon } from "@/components/ui/icons";

export default function BulkMatrix({ products }: { products: SensoryProduct[] }) {
  const { addToCart } = useCart();
  const { convert } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (id: string, val: string) => {
    setQuantities(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
  };

  const handleBulkSync = async () => {
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate Roastery processing

    Object.entries(quantities).forEach(([id, qty]) => {
      if (qty > 0) {
        const p = products.find(prod => prod.id === id);
        if (p) {
          addToCart({
            id: p.id,
            name: p.name,
            priceLkr: Number(p.wholesalePriceLkr || 0),
            priceUsd: Number(p.wholesalePriceUsd || 0),
            weightGrams: p.weightGrams,
            quantity: qty,
            image: p.imageUrls[0] || "/images/placeholder.jpg",
            slug: p.slug
          }, qty);
        }
      }
    });
    setIsAdding(false);
    alert("Wholesale bag synchronized.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-100 text-[9px] font-black uppercase text-stone-400">
            <tr>
              <th className="p-6">Roast Profile / Grade</th>
              <th className="p-6 text-right">Unit Rate</th>
              <th className="p-6 text-center w-40">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map(p => (
              <tr key={p.id} className="text-sm hover:bg-stone-50/50 transition-colors">
                <td className="p-6">
                   <p className="font-bold text-[#2C1810]">{p.name}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <TrendingUpIcon className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[9px] text-stone-400 uppercase tracking-widest font-black">SCA {p.scaScore}</span>
                   </div>
                </td>
                <td className="p-6 text-right font-bold text-[#2C1810]">
                   {convert(p.wholesalePriceLkr, p.wholesalePriceUsd)}
                </td>
                <td className="p-6">
                   <div className="flex flex-col items-center gap-1">
                      <input 
                        type="number" 
                        placeholder={`MOQ: ${p.moq || 1}`}
                        className="kiyota-input w-full text-center bg-stone-50 border-none font-bold"
                        onChange={(e) => handleQtyChange(p.id, e.target.value)}
                      />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={handleBulkSync}
        disabled={isAdding || Object.values(quantities).every(q => q === 0)}
        className="w-full bg-[#2C1810] text-[#D4AF37] py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-30 cursor-pointer"
      >
        {isAdding ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <ShoppingBagIcon className="w-4 h-4" />}
        Sync Procurement Matrix
      </button>
    </div>
  );
}