"use client";

interface Product {
  priceLkr: string | null;
  priceUsd: string | null;
  wholesalePriceUsd: string | null;
}

export default function PriceDisplay({ 
  product, 
  userRole, 
  isApproved 
}: { 
  product: Product, 
  userRole: string, 
  isApproved: boolean 
}) {
  // If Wholesale User and Approved by Super Admin
  if (userRole === "WHOLESALE" && isApproved) {
    return (
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-black text-[#D4AF37]">Wholesale Partner Price</p>
        <p className="text-2xl font-bold text-[#2C1810]">${product.wholesalePriceUsd}</p>
      </div>
    );
  }

  // Standard Retail View
  return (
    <div className="flex flex-col">
       <p className="text-xl font-bold text-[#2C1810]">LKR {product.priceLkr}</p>
       <p className="text-[10px] text-stone-400 font-bold uppercase">Approx. ${product.priceUsd}</p>
    </div>
  );
}