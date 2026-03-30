"use client";
import { ShoppingBagIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartIcon() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" className="relative text-stone-400 hover:text-[#2C1810] transition-colors cursor-pointer">
      <ShoppingBagIcon className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in fade-in zoom-in">
          {totalItems}
        </span>
      )}
    </Link>
  );
}