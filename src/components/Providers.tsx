"use client";

import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

interface ProviderProps {
  children: React.ReactNode;
  exchangeRate?: number; // Made optional to satisfy Root Layout
}

export function Providers({ children, exchangeRate = 325.00 }: ProviderProps) {
  return (
    <CurrencyProvider initialRate={exchangeRate}>
      <CartProvider>
        {children}
      </CartProvider>
    </CurrencyProvider>
  );
}