"use client";

import { useState } from "react";
import { SensoryProduct } from "@/types/store";
import Image from "next/image";
import Link from "next/link";
import { AwardIcon, GlobeIcon, CoffeeIcon, SearchIcon, ListIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";

export default function StorefrontManager({ products }: { products: SensoryProduct[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const filtered = products.filter(p => {
    const catMatch = activeCategory === "ALL" || p.category === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="space-y-12">
      {/* 1. PREMIUM SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-stone-100 pb-8">
        <div className="flex gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
          {["ALL", "SPECIALTY_ARABICA", "GREEN_BEANS", "CEYLON_SPICES"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap pb-2 border-b-2 transition-all cursor-pointer ${
                activeCategory === cat ? "text-[#D4AF37] border-[#D4AF37]" : "text-stone-300 border-transparent hover:text-stone-600"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72 group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Collections..." 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-full pl-10 pr-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 2. ALIGNED INSTITUTIONAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
        {filtered.map((product) => (
          <div key={product.id} className="flex flex-col h-full group animate-in fade-in duration-1000">
            
            {/* Image Container - Macro Crop Style */}
            <Link href={`/products/${product.slug}`} className="aspect-[4/5] w-full bg-white relative overflow-hidden rounded-sm shadow-sm hover:shadow-2xl transition-all duration-700 block">
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.scaScore && (
                  <div className="bg-[#2C1810] text-[#D4AF37] px-3 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                    <AwardIcon className="w-3 h-3" /> SCA {product.scaScore}
                  </div>
                )}
                <div className="bg-white/90 backdrop-blur-md text-[#2C1810] px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-sm">
                  {product.originRegion}
                </div>
              </div>

              <Image
                src={(product.imageUrls as string[])?.[0] || "https://images.unsplash.com/photo-1559056191-75902420fef5?auto=format&fit=crop&q=80&w=800"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 mix-blend-multiply"
              />
            </Link>

            {/* Content Container - Flexbox ensures vertical alignment */}
            <div className="mt-8 flex flex-col flex-grow space-y-4">
              {/* Title Slot: Fixed Height for consistency */}
              <div className="min-h-[60px] flex flex-col justify-center">
                <Link href={`/products/${product.slug}`} className="block group">
                  <h3 className="text-2xl font-serif italic text-[#2C1810] group-hover:text-[#D4AF37] transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#D4AF37] mt-1">
                   {product.processingMethod || "Specialty"} Process • {product.altitude}
                </p>
              </div>

              <div className="h-px w-8 bg-stone-100" />

              {/* Price Slot */}
              <div className="min-h-[40px] flex items-center">
                {product.isInquiryOnly ? (
                  <div className="flex items-center gap-2 text-stone-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    <GlobeIcon className="w-3 h-3" /> Export Inquiry Required
                  </div>
                ) : (
                  <p className="text-xl font-bold text-[#2C1810] tracking-tighter">LKR {Number(product.price).toLocaleString()}</p>
                )}
              </div>

              {/* Action Slot - Always at the bottom of the card */}
              <div className="pt-2 mt-auto flex flex-col gap-3">
                {!product.isInquiryOnly ? (
                  <>
                    <button
                      onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price || 0),
                          priceUsd: Number(product.priceUsd || 0),
                          weightGrams: Number(product.weightGrams || 250),
                          quantity: 1,
                          image: (product.imageUrls as string[])?.[0] || "",
                          slug: product.slug
                      })}
                      className="w-full py-4 bg-[#2C1810] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-500 shadow-xl cursor-pointer active:scale-95 flex items-center justify-center gap-3"
                    >
                      <CoffeeIcon className="w-4 h-4" /> Add to Cart
                    </button>
                    
                    <Link href={`/products/${product.slug}`} className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-[#2C1810] transition-colors py-2">
                       <ListIcon className="w-3 h-3" /> Sensory Profile & Details
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/wholesale"
                    className="w-full py-4 border border-[#2C1810] text-[#2C1810] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#2C1810] hover:text-white transition-all duration-500 flex items-center justify-center gap-3"
                  >
                    <GlobeIcon className="w-4 h-4" /> B2B Price Request
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}