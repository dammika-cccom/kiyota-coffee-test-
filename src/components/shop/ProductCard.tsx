"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBagIcon, AwardIcon, MoveRightIcon, GlobeIcon } from "@/components/ui/icons";

export interface InstitutionalProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceLkr: string | null;
  priceUsd: string | null;
  pricingLogic: "MANUAL" | "AUTO_CONVERT" | null;
  displayMode: "LKR_ONLY" | "USD_ONLY" | "BOTH" | null;
  weightGrams: number;
  category: string;
  scaScore: string | null;
  imageUrls: unknown; 
  isRetailEnabled: boolean | null;
  isInquiryOnly: boolean | null;
  isWholesaleOnly: boolean | null;
  visibility: "B2C_ONLY" | "B2B_ONLY" | "BOTH" | null;
  wholesalePriceLkr: string | null;
  wholesalePriceUsd: string | null;
  moq: number | null;
}

export interface ProductCardProps {
  product: InstitutionalProduct;
  userRole?: string;
}

export default function ProductCard({ product, userRole }: ProductCardProps) {
  const { addToCart } = useCart();
  const { convert } = useCurrency(); // 'currency' removed to satisfy ESLint unused-vars

  // Role Detection: SUPER_ADMIN and WHOLESALE_ADMIN granted Wholesale access
  const isWholesalePartner = userRole === "WHOLESALE_USER" || userRole === "SUPER_ADMIN" || userRole === "WHOLESALE_ADMIN";

  // 1. VISIBILITY GATING
  if (!isWholesalePartner && product.visibility === "B2B_ONLY") return null;
  if (isWholesalePartner && product.visibility === "B2C_ONLY") return null;

  // 2. PRICING TIER SELECTION
  const activeLkr = isWholesalePartner ? product.wholesalePriceLkr : product.priceLkr;
  const activeUsd = isWholesalePartner ? product.wholesalePriceUsd : product.priceUsd;
  const showInquiry = product.isInquiryOnly || (!activeLkr && isWholesalePartner);

  // 3. ASSET HANDLING (Safe casting for JSONB)
  const images = product.imageUrls as string[] | null;
  const firstImage = images && images.length > 0 ? images[0] : "/images/placeholder.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      priceLkr: Number(activeLkr || 0),
      priceUsd: Number(activeUsd || 0),
      weightGrams: product.weightGrams,
      quantity: isWholesalePartner ? (product.moq || 1) : 1, // Institutional MOQ Enforcement
      image: firstImage,
      slug: product.slug
    });
  };

  return (
    <div className="group bg-white rounded-sm overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-700 flex flex-col h-full">
      
      {/* VISUAL CANVAS */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FAF9F6]">
        <Image 
          src={firstImage} 
          alt={product.name} 
          fill 
          className="object-cover mix-blend-multiply opacity-95 group-hover:scale-105 transition-all duration-[2000ms]" 
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.scaScore && (
            <div className="bg-[#2C1810] text-[#D4AF37] px-3 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
               <AwardIcon className="w-3 h-3" /> SCA {product.scaScore}
            </div>
          )}
          {isWholesalePartner && (
            <div className="bg-blue-600 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
               <GlobeIcon className="w-3 h-3" /> Wholesale Tier
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT HUB */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
            {product.category.replace("_", " ")}
          </p>
          <h3 className="text-lg font-serif italic text-[#2C1810] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="pt-4 border-t border-stone-50 mt-auto flex justify-between items-end">
          <div className="space-y-1">
            {showInquiry ? (
               <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Price on Request</p>
            ) : (
               <>
                 <p className="text-xl font-bold text-[#2C1810]">
                   {convert(activeLkr, activeUsd)}
                 </p>
                 {isWholesalePartner && product.moq && product.moq > 1 && (
                   <p className="text-[8px] font-black text-blue-500 uppercase">Min. Order: {product.moq} Units</p>
                 )}
               </>
            )}
          </div>

          {showInquiry ? (
            <Link href="/wholesale" className="p-3 bg-stone-100 rounded-full hover:bg-[#D4AF37] transition-all">
              <MoveRightIcon className="w-4 h-4 text-[#2C1810]" />
            </Link>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="w-12 h-12 bg-[#2C1810] text-white flex items-center justify-center rounded-full hover:bg-[#D4AF37] transition-all shadow-xl active:scale-90"
            >
              <ShoppingBagIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}