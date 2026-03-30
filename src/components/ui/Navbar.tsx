"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  GlobeIcon, UserIcon, MenuIcon, XIcon, 
  TruckIcon, FactoryIcon, ShoppingBagIcon 
} from "@/components/ui/icons";
import CurrencySwitcher from "../nav/CurrencySwitcher"; // Import our new switcher
import { useCart } from "@/context/CartContext";

// Define the Interface for Institutional Props
interface NavbarProps {
  onOpenCart: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  // Auto-close menu when route changes
  useEffect(() => setIsOpen(false), [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const isActive = (path: string) => pathname === path;

  const brandLinks = [
    { name: "Online Shop", href: "/shop" },
    { name: "The Source", href: "/farmers" },
    { name: "Our World", href: "/infrastructure" },
    { name: "Visit Us", href: "/shops" },
    { name: "Journal", href: "/stories" },
  ];

  const corporateLinks = [
    { name: "Wholesale & Export", href: "/wholesale", icon: TruckIcon },
    { name: "Partnerships", href: "/partnerships", icon: FactoryIcon },
    { name: "The Academy", href: "/academy", icon: null },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50">
        {/* --- DESKTOP TOP BAR --- */}
        <div className="hidden lg:block bg-[#1A1A1A] text-white py-2 px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex gap-6">
                {corporateLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 hover:text-[#D4AF37] transition-colors">
                    {link.name}
                  </Link>
                ))}
            </div>
            <div className="flex items-center gap-4">
                 <GlobeIcon className="w-3 h-3 text-stone-600" />
                 <span className="text-[8px] font-black uppercase text-stone-500">Logistics HQ: Matale, SL</span>
            </div>
          </div>
        </div>

        {/* --- MAIN NAVIGATION BAR --- */}
        <div className="bg-white/95 backdrop-blur-md px-6 h-20 border-b border-stone-100">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
            
            {/* Logo */}
            <Link href="/" className="relative w-32 md:w-40 h-10">
              <Image src="/images/logo.png" alt="Kiyota" fill className="object-contain object-left" priority />
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {brandLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[#D4AF37] ${isActive(link.href) ? 'text-[#2C1810]' : 'text-stone-400'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* B2C UTILITY ACTIONS */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:block">
                <CurrencySwitcher />
              </div>

              <Link href="/login" title="Member Vault">
                <UserIcon className="w-5 h-5 text-stone-400 hover:text-[#2C1810] transition-colors" />
              </Link>
              
              {/* Institutional Cart Trigger */}
              <button 
                onClick={onOpenCart} 
                className="relative group p-2 cursor-pointer"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBagIcon className="w-5 h-5 text-stone-400 group-hover:text-[#2C1810] transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#2C1810] text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#2C1810] p-2">
                {isOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER (Tiered) */}
      <div className={`fixed inset-0 z-40 bg-[#FAF9F6] transition-transform duration-500 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-32 pb-10 px-8 overflow-y-auto">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Retail & Brand</p>
            <div className="grid gap-4">
              {brandLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-3xl font-serif italic text-[#2C1810] border-b border-stone-100 pb-2">{link.name}</Link>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-12 flex justify-between items-center border-t border-stone-200">
             <CurrencySwitcher />
             <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]">Member Login →</Link>
          </div>
        </div>
      </div>
    </>
  );
}