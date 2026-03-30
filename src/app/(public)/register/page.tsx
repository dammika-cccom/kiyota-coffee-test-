"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { registerUser, FormState } from "./actions";
import { CoffeeIcon } from "@/components/ui/icons";

export default function RegisterPage() {
  // useActionState bridges the Server Action logic to the Client UI
  const [state, formAction, isPending] = useActionState(registerUser, {
    error: "",
  } as FormState);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* 1. BRAND STORY SIDEBAR (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C1810] relative overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200"
          alt="Kiyota Coffee Roasting"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 p-20 flex flex-col justify-between h-full text-white">
          <Link href="/" className="flex flex-col group">
            <span className="text-3xl font-bold tracking-tighter uppercase italic group-hover:text-[#D4AF37] transition-colors">Kiyota</span>
            <span className="text-xs uppercase tracking-[0.4em] font-light text-[#D4AF37]">Coffee Roasters</span>
          </Link>
          <div className="space-y-6">
            <h2 className="text-5xl font-serif italic leading-tight">
              Join the <br /> Circle of Precision.
            </h2>
            <p className="text-stone-300 font-light max-w-md leading-loose text-justify italic">
              &quot;Create an account to track your specialty roasts, access the Barista Academy, and enjoy the true taste of Sri Lankan highlands.&quot;
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">© 2026 Kiyota Coffee Roasters</p>
        </div>
      </div>

      {/* 2. REGISTRATION FORM SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-[#FAF9F6]">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <CoffeeIcon className="w-8 h-8 text-[#D4AF37] mx-auto lg:mx-0 mb-4" />
            <h1 className="text-3xl font-serif italic text-[#2C1810]">Create Account</h1>
            <p className="text-stone-400 text-sm">Become a Kiyota member today.</p>
          </div>

          {/* Feedback Section (Error Messaging) */}
          {state?.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-in fade-in slide-in-from-top-2">
              <p className="text-red-700 text-[10px] font-black uppercase tracking-widest leading-none">
                Registration Error
              </p>
              <p className="text-red-900 text-xs mt-1 font-medium italic">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">First Name</label>
                <input name="firstName" type="text" required disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Last Name</label>
                <input name="lastName" type="text" required disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Email Address</label>
              <input name="email" type="email" required disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Create Password</label>
              <input name="password" type="password" required disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400">Mobile Number</label>
              <input name="mobile" type="text" placeholder="+94 XX XXX XXXX" disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-100">
              <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Shipping Information</p>
              <div className="space-y-4">
                <input name="addressLine1" type="text" placeholder="House / Office Name & Street" disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
                <input name="addressLine2" type="text" placeholder="Area / Lane (Optional)" disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" type="text" placeholder="City" disabled={isPending} className="w-full border-b border-stone-200 bg-transparent py-2 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-30" />
                  <input value="Sri Lanka" disabled className="w-full border-b border-stone-200 bg-transparent py-2 text-sm text-stone-400 cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-500 shadow-xl cursor-pointer disabled:bg-stone-400 disabled:cursor-not-allowed"
              >
                {isPending ? "Connecting to System..." : "Confirm Membership"}
              </button>
            </div>

            <p className="text-center text-xs text-stone-400 pt-4">
              Already a member? <Link href="/login" className="text-[#D4AF37] font-bold underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}