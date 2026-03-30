"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import CartSidebar from "@/components/shop/CartSidebar";

export default function PublicClientWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* Navbar trigger to open the drawer */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Global Sidebar for all public routes */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 
          SPACING LOGIC: 
          We add pt-32 to account for the fixed Navbar and Topbar height.
      */}
      <main className="flex-1 pt-20 lg:pt-32">
        {children}
      </main>
    </>
  );
}