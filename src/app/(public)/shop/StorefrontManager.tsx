"use client";

import { useState } from "react";
import { SensoryProduct } from "@/types/store";
import Image from "next/image";
import Link from "next/link";
import { 
  AwardIcon, CoffeeIcon, 
  SearchIcon, FilterIcon, ShoppingBagIcon, ListIcon 
} from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

interface StorefrontManagerProps {
  initialProducts: SensoryProduct[];
  nurseryCount: number;
  userRole: string;
}

export default function StorefrontManager({ initialProducts, nurseryCount, userRole }: StorefrontManagerProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { convert, exchangeRate } = useCurrency();

  const filtered = initialProducts.filter(p => {
    const catMatch = activeCategory === "ALL" || p.category === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-12">
      <aside className="hidden lg:block space-y-12">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Roasts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-full pl-12 pr-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2C1810] flex items-center gap-2">
            <FilterIcon className="w-3 h-3 text-[#D4AF37]" /> Collections
          </h4>
          <div className="flex flex-col gap-3">
            {["ALL", "SPECIALTY_ARABICA", "GREEN_BEANS", "EQUIPMENT"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeCategory === cat ? "text-[#D4AF37] translate-x-2" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#2C1810] p-8 rounded-sm text-white space-y-6 shadow-xl relative overflow-hidden">
           <CoffeeIcon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 -rotate-12" />
           <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">The Source</p>
              <p className="text-3xl font-serif italic">{(nurseryCount / 1000).toFixed(0)}k Seedlings</p>
              <p className="text-[9px] opacity-50 uppercase leading-relaxed font-bold">Access Level: {userRole}</p>
           </div>
        </div>
      </aside>

      <div className="space-y-12">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
            {filtered.map((product) => {
              const displayImg = product.imageUrls[0] || "https://images.unsplash.com/photo-1559056191-75902420fef5";
              
              // Effective USD calculation for Cart
              const effectiveUsd = product.pricingLogic === "MANUAL" 
                ? Number(product.priceUsd || 0) 
                : Number(product.priceLkr || 0) / exchangeRate;

              return (
                <div key={product.id} className="flex flex-col h-full group">
                  <div className="aspect-[4/5] bg-white relative overflow-hidden rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <Link href={`/shop/${product.slug}`} className="block h-full w-full">
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-[#2C1810] text-[#D4AF37] px-2 py-1 text-[7px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1">
                          <AwardIcon className="w-2.5 h-2.5" /> SCA {product.scaScore || "85+" }
                        </div>
                      </div>
                      <Image src={displayImg} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover opacity-90 group-hover:scale-105 transition-all duration-1000 mix-blend-multiply" />
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-col flex-grow text-center">
                    <div className="min-h-[50px] flex flex-col justify-center">
                       <Link href={`/shop/${product.slug}`} className="hover:text-[#D4AF37] transition-colors">
                          <h3 className="text-sm md:text-base font-serif italic text-[#2C1810] line-clamp-2">{product.name}</h3>
                       </Link>
                    </div>

                    <div className="mt-4 min-h-[40px] flex items-center justify-center border-y border-stone-50">
                        <p className="text-base font-bold text-[#2C1810]">
                            {convert(product.priceLkr, product.priceUsd, product.pricingLogic || "AUTO_CONVERT")}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-px border border-[#2C1810] rounded-sm overflow-hidden">
                        <button
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            priceLkr: Number(product.priceLkr || 0),
                            priceUsd: effectiveUsd,
                            weightGrams: product.weightGrams,
                            quantity: 1,
                            image: displayImg,
                            slug: product.slug
                          })}
                          className="flex-1 bg-[#2C1810] text-white py-3 text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all cursor-pointer"
                        >
                          Add to Bag
                        </button>
                      <Link href={`/shop/${product.slug}`} className="flex-1 bg-white text-[#2C1810] py-3 text-[9px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all text-center border-l border-[#2C1810] flex items-center justify-center gap-1.5">
                        <ListIcon className="w-3 h-3" /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
             <ShoppingBagIcon className="w-16 h-16 text-stone-100 mx-auto" />
             <p className="text-xs uppercase font-black tracking-widest text-stone-300 italic">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}