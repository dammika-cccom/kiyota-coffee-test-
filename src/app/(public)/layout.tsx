import type { Metadata } from "next";
import { db } from "@/db";
import { systemSettings } from "@/db/schema";
import { Providers } from "@/components/Providers";
import PublicClientWrapper from "./PublicClientWrapper";
import Link from "next/link";
import { 
  CoffeeIcon, 
  InstagramIcon, 
  FacebookIcon, 
  YoutubeIcon 
} from "@/components/ui/icons";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: "Kiyota Coffee | Premium Sri Lankan Specialty",
  description: "Japanese precision meeting Ceylon heritage. Farm-to-Cup Excellence.",
  icons: { icon: "/images/favicon.ico" } 
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // 1. Fetch Institutional Exchange Rate from Matale HQ Database
  const settingsArray = await db.select().from(systemSettings).limit(1);
  const exchangeRate = Number(settingsArray[0]?.exchangeRate || 300);

  return (
    <div className="antialiased bg-[#FAF9F6] text-[#2C1810] min-h-screen flex flex-col">
      {/* 
          2. PASS THE EXCHANGE RATE TO PROVIDERS
          The Providers component (Client Side) will initialize the CurrencyProvider 
          using this live value.
      */}
      <Providers exchangeRate={exchangeRate}>
        
        <PublicClientWrapper>
          {children}
        </PublicClientWrapper>

        {/* INSTITUTIONAL FOOTER */}
        <footer className="bg-[#2C1810] text-[#FAF9F6] py-32 px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/5 pb-24">
              
              {/* Branding & Identity */}
              <div className="space-y-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold italic text-white leading-none uppercase tracking-tighter">Kiyota</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">Global Supply Chain</span>
                </div>
                <p className="text-sm opacity-40 font-light leading-relaxed italic">
                  The resurrection of Ceylon Arabica. Sourced from 4,500 families, processed with Japanese standards, and delivered globally.
                </p>
                <div className="flex gap-6 items-center">
                  <Link href="#" className="text-white opacity-30 hover:opacity-100 transition-all"><InstagramIcon className="w-5 h-5" /></Link>
                  <Link href="#" className="text-white opacity-30 hover:opacity-100 transition-all"><FacebookIcon className="w-5 h-5" /></Link>
                  <Link href="#" className="text-white opacity-30 hover:opacity-100 transition-all"><YoutubeIcon className="w-5 h-5" /></Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-6">
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37]">Ecosystem</h5>
                <div className="flex flex-col gap-4 text-xs opacity-60">
                  <Link href="/shop" className="hover:text-[#D4AF37]">Online Store (B2C)</Link>
                  <Link href="/shops" className="hover:text-white">Flagship Roasteries</Link>
                  <Link href="/academy" className="hover:text-white">Barista Academy</Link>
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37]">Transparency</h5>
                <div className="flex flex-col gap-4 text-xs opacity-60">
                  <Link href="/farmers" className="hover:text-white">Farmer Network</Link>
                  <Link href="/trace" className="hover:text-[#D4AF37] font-bold">Trace Batch Lot #</Link>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37]">Contact HQ</h5>
                  <p className="text-xs opacity-60 leading-loose">No. 13, Meegasthenna Road, Matale, SL.</p>
                  <p className="text-xs font-bold pt-2 text-white">+94 (66) 224 4555</p>
                </div>
              </div>
            </div>
            
            <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 text-[9px] uppercase tracking-[0.5em] font-bold">
              <div className="flex items-center gap-4">
                  <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" />
                  <p>© 2026 Kiyota Coffee Company (Pvt) Ltd</p>
              </div>
            </div>
          </div>
        </footer>
      </Providers>
    </div>
  );
}