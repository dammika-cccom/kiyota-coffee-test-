"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Institutional Interface for Cart Items
export interface CartItem {
  id: string;
  name: string;
  priceLkr: number;   // Matches schema: price_lkr
  priceUsd: number;   // Matches schema: price_usd (or auto-calculated)
  weightGrams: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem, qty?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalLkr: number;
  subtotalUsd: number;
  totalWeightGrams: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Sync with LocalStorage on Mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('kiyota_cart_v2');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart hydration failed", e);
      }
    }
  }, []);

  // Persist to LocalStorage on Change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kiyota_cart_v2', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (item: CartItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Business Intelligence Calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightGrams = cart.reduce((acc, item) => acc + (item.weightGrams * item.quantity), 0);
  const subtotalLkr = cart.reduce((acc, item) => acc + (item.priceLkr * item.quantity), 0);
  const subtotalUsd = cart.reduce((acc, item) => acc + (item.priceUsd * item.quantity), 0);

  // Next.js 15 Hydration Safety
  if (!mounted) return <>{children}</>;

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, removeFromCart, clearCart,
      totalItems, subtotalLkr, subtotalUsd, totalWeightGrams
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  
  // Dummy return for Server-Side Rendering to prevent "context undefined" errors
  if (context === undefined) {
    return {
      cart: [],
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      totalItems: 0,
      subtotalLkr: 0,
      subtotalUsd: 0,
      totalWeightGrams: 0
    };
  }
  
  return context;
};