"use client";

import Image from "next/image";
import { EditIcon, GlobeIcon, AwardIcon } from "@/components/ui/icons";
import type { ProductWithFullMeta } from "./page"; // Import the strict DB type

// We removed the unused "interface AdminProduct" block that was causing the error.

export default function AdminProductList({ products }: { products: ProductWithFullMeta[] }) {
  return (
    <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-black uppercase text-stone-400 tracking-widest">
          <tr>
            <th className="p-6">Roast Profile & Identity</th>
            <th className="p-6">Category</th>
            <th className="p-6">Stock Status</th>
            <th className="p-6">Pricing Strategy</th>
            <th className="p-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {products.map((p) => {
            // Institutional Logic: Casting JSONB safely
            const images = p.imageUrls as string[] | null;
            const firstImage = images && images.length > 0 
              ? images[0] 
              : "https://images.unsplash.com/photo-1559056191-75902420fef5";

            return (
              <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group text-sm">
                {/* 1. Identity */}
                <td className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 relative bg-stone-100 rounded-sm overflow-hidden shrink-0">
                    <Image 
                      src={firstImage} 
                      alt={p.name} 
                      fill 
                      className="object-cover mix-blend-multiply" 
                      sizes="48px"
                    />
                  </div>
                  <div>
                      <p className="font-bold text-[#2C1810]">{p.name}</p>
                      <p className="text-[9px] text-stone-400 uppercase tracking-tighter">{p.slug}</p>
                  </div>
                </td>

                {/* 2. Category */}
                <td className="p-6">
                  <span className="text-[9px] font-black px-2 py-1 bg-stone-100 rounded-full text-stone-500 uppercase tracking-tighter border border-stone-200">
                      {p.category ? p.category.replace("_", " ") : "UNCATEGORIZED"}
                  </span>
                </td>

                {/* 3. Inventory */}
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${Number(p.stockQuantity || 0) < 10 ? 'text-red-500' : 'text-green-600'}`}>
                      {p.stockQuantity || 0} in stock
                    </span>
                    <span className="text-[9px] text-stone-300 font-mono">Weight: {p.weightGrams}G</span>
                  </div>
                </td>

                {/* 4. Pricing Strategy */}
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-sm text-[#2C1810]">
                         LKR {p.priceLkr ? Number(p.priceLkr).toLocaleString() : "—"}
                       </span>
                       {p.displayMode === "LKR_ONLY" && (
                         <span className="text-[7px] bg-blue-100 text-blue-700 px-1 rounded font-black">LOCAL</span>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-[#D4AF37] font-bold">
                         {p.priceUsd ? `$${p.priceUsd}` : "Auto-Calc"}
                       </span>

                       {p.pricingLogic === "AUTO_CONVERT" ? (
                         <span title="Auto-converted via Global Exchange Rate">
                           <GlobeIcon className="w-2.5 h-2.5 text-stone-300" />
                         </span>
                       ) : (
                         <span title="Manual Price Override applied">
                           <AwardIcon className="w-2.5 h-2.5 text-[#D4AF37]" />
                         </span>
                       )}

                       {p.displayMode === "USD_ONLY" && (
                         <span className="text-[7px] bg-amber-100 text-amber-700 px-1 rounded font-black">EXPORT</span>
                       )}
                    </div>
                  </div>
                </td>

                {/* 5. Actions */}
                <td className="p-6 text-right">
                  <button 
                    onClick={() => window.location.href = `/admin/products/${p.id}`}
                    className="text-stone-300 hover:text-[#D4AF37] transition-all p-2 rounded-full hover:bg-stone-100 cursor-pointer"
                  >
                      <EditIcon className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}