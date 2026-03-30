"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: 'LKR' | 'USD';
  exchangeRate: number;
  setCurrency: (c: 'LKR' | 'USD') => void;
  // Helper to format any price based on current selection
  convert: (lkr: string | number | null, usdManual?: string | number | null, logic?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ 
  children, 
  initialRate 
}: { 
  children: React.ReactNode; 
  initialRate: number 
}) {
  const [currency, setCurrency] = useState<'LKR' | 'USD'>('LKR');

  useEffect(() => {
    const saved = localStorage.getItem('kiyota_pref_currency');
    if (saved === 'LKR' || saved === 'USD') {
      setCurrency(saved);
    } else {
      // Geo-IP Logic: Default to USD if outside Sri Lanka
      const isSL = Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Colombo";
      setCurrency(isSL ? 'LKR' : 'USD');
    }
  }, []);

  const handleSetCurrency = (c: 'LKR' | 'USD') => {
    setCurrency(c);
    localStorage.setItem('kiyota_pref_currency', c);
  };

  const convert = (lkr: string | number | null, usdManual?: string | number | null, logic = "AUTO_CONVERT") => {
    const lkrNum = Number(lkr || 0);
    const usdNum = Number(usdManual || 0);

    if (currency === 'LKR') {
      return `LKR ${lkrNum.toLocaleString()}`;
    }

    // USD Logic: Use manual if provided and logic is MANUAL, otherwise auto-convert
    if (logic === "MANUAL" && usdNum > 0) {
      return `$${usdNum.toFixed(2)}`;
    }
    return `$${(lkrNum / initialRate).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, exchangeRate: initialRate, setCurrency: handleSetCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within Provider");
  return context;
};