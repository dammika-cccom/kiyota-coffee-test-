"use client";

import { useActionState } from "react";
import { submitContactInquiry, ContactState } from "./actions";
import { MapPinIcon, GlobeIcon, CoffeeIcon, CheckCircleIcon, UserIcon } from "@/components/ui/icons";
import Image from "next/image";

export default function ContactHub() {
  const [state, formAction, isPending] = useActionState(submitContactInquiry, null as ContactState);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40">
      {/* 1. MINIMALIST HEADER - FIXED: Integrated CoffeeIcon */}
      <section className="pt-40 pb-20 px-6 text-center space-y-4">
        <div className="flex justify-center items-center gap-4 text-[#D4AF37]">
            <div className="h-px w-8 bg-current opacity-20" />
            <CoffeeIcon className="w-6 h-6" /> 
            <div className="h-px w-8 bg-current opacity-20" />
        </div>
        <h5 className="text-[10px] uppercase tracking-[0.6em] font-black text-[#D4AF37]">
          Corporate Relations
        </h5>
        <h1 className="text-5xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter">
          Connect with Us.
        </h1>
      </section>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
        
        {/* 2. INFRASTRUCTURE & COORDINATES (LEFT) */}
        <div className="space-y-16">
          <div className="relative h-[400px] rounded-sm overflow-hidden shadow-2xl group">
             <Image 
               src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
               alt="Matale Headquarters" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 to-transparent" />
             <div className="absolute bottom-10 left-10 text-white">
                <p className="text-2xl font-serif italic">Global Headquarters</p>
                <p className="text-[10px] uppercase tracking-widest opacity-60">Matale, Central Highlands</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <MapPinIcon className="w-6 h-6 text-[#D4AF37]" />
               <h4 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Location</h4>
               <p className="text-sm text-stone-500 font-light leading-relaxed">
                 No. 13, Meegasthenna Road, <br/> Udupihilla, Matale, Sri Lanka.
               </p>
            </div>
            <div className="space-y-4">
               <GlobeIcon className="w-6 h-6 text-[#D4AF37]" />
               <h4 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Digital Channels</h4>
               <p className="text-sm text-stone-500 font-light leading-relaxed">
                 exports@kiyotacoffee.lk <br/>
                 +94 (66) 224 4555
               </p>
            </div>
          </div>
        </div>

        {/* 3. SMART INQUIRY FORM (RIGHT) - FIXED: Integrated UserIcon */}
        <div className="bg-white p-10 md:p-16 border border-stone-100 shadow-2xl rounded-sm">
          {state?.success ? (
            <div className="py-20 text-center space-y-6 animate-in zoom-in duration-500">
               <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
               <h3 className="text-3xl font-serif italic text-[#2C1810]">Inquiry Received</h3>
               <p className="text-stone-400 text-sm leading-relaxed uppercase tracking-widest">
                 The roastery team will evaluate your message and respond within 24 hours.
               </p>
               <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase border-b border-[#D4AF37] pb-1 text-[#D4AF37] cursor-pointer">Send another message</button>
            </div>
          ) : (
            <form action={formAction} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-50 pb-4">
                    <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Personal Identity</h4>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Full Name</label>
                    <input name="name" required className="kiyota-input w-full" placeholder="Full Name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Phone / WhatsApp</label>
                    <input name="phone" required className="kiyota-input w-full" placeholder="+94" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Email Address</label>
                  <input name="email" type="email" required className="kiyota-input w-full" placeholder="email@domain.com" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Subject Segment</label>
                  <select name="segment" className="kiyota-input w-full bg-transparent cursor-pointer" required>
                    <option value="RETAIL">General / Retail Support</option>
                    <option value="WHOLESALE">Wholesale & Export Technical</option>
                    <option value="CAREER">Careers & Barista Academy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Message</label>
                  <textarea name="message" required rows={4} className="w-full bg-stone-50 p-4 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-sm resize-none" placeholder="How can our roastery facilitate you today?" />
                </div>
              </div>

              <button 
                disabled={isPending}
                className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all shadow-xl active:scale-95 disabled:bg-stone-300 cursor-pointer"
              >
                {isPending ? "Connecting to Roastery..." : "Transmit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}