"use client";
import Link from "next/link";
import { CheckCircleIcon } from "@/components/ui/icons"; // FIXED: Removed unused Globe/Coffee icons

export default function B2BRegisterPage() {
  return (
    <div className="min-h-screen bg-[#2C1810] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Value Proposition */}
        <div className="space-y-8 animate-in slide-in-from-left duration-1000">
          <Link href="/" className="flex flex-col mb-12 group">
            <span className="text-3xl font-bold tracking-tighter uppercase italic text-[#D4AF37] group-hover:text-white transition-colors">Kiyota</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-light opacity-60">Wholesale Division</span>
          </Link>
          <h1 className="text-5xl font-serif italic leading-tight">Elevate your <br/> Coffee Program.</h1>
          <ul className="space-y-4">
            {[
              "Preferential Wholesale Pricing (LKR/USD)",
              "Global Export Documentation Support",
              "Priority Access to Micro-lot Harvests",
              "Japanese Roasting Quality Control"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm opacity-80">
                <CheckCircleIcon className="w-5 h-5 text-[#D4AF37]" /> {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Application Form */}
        <div className="bg-white text-[#2C1810] p-10 rounded-sm shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-1000">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif italic">Partner Application</h2>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Verification required for pricing</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-stone-400">First Name</label>
                <input required className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-stone-400">Last Name</label>
                <input required className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
              </div>
            </div>
            <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-stone-400">Company / Café Name</label>
                <input required className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-stone-400">Business Email</label>
                <input required type="email" className="w-full border-b border-stone-200 py-2 text-sm outline-none focus:border-[#D4AF37] bg-transparent" />
            </div>
            <div className="flex items-center gap-4 py-4">
               <div className="flex-1 h-px bg-stone-100"></div>
               <span className="text-[10px] font-black uppercase text-stone-300">Submission</span>
               <div className="flex-1 h-px bg-stone-100"></div>
            </div>
            <button className="w-full bg-[#2C1810] text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-xl cursor-pointer">
              Submit Application
            </button>
            <p className="text-center text-[10px] text-stone-400 leading-relaxed italic">
              Our export team will verify your business and unlock your wholesale dashboard within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}