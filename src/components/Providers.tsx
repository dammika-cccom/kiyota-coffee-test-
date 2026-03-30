"use client";

import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext"; // Corrected Path

interface ProviderProps {
  children: React.ReactNode;
  exchangeRate: number; // Institutional Rate passed from Server (layout.tsx)
}

export function Providers({ children, exchangeRate }: ProviderProps) {
  return (
    /* 
       1. Currency Provider must be top-level so that the 
          Cart can use currency logic if needed.
    */
    <CurrencyProvider initialRate={exchangeRate}>
      <CartProvider>
        {children}
      </CartProvider>
    </CurrencyProvider>
  );
}