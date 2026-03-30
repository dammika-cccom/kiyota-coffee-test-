"use client";

import { useActionState, useEffect } from "react"; // FIXED: Import useEffect
import { loginUser, LoginState } from "./actions";
import { CoffeeIcon } from "@/components/ui/icons";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, {
    error: "",
  } as LoginState);

  /**
   * FIXED: Moved logic inside the component
   */
  useEffect(() => {
    if (state?.success) {
      const role = state.role;
      // Admin Branching
      if (role === "SUPER_ADMIN" || role?.endsWith("_ADMIN")) {
        window.location.href = "/admin";
      } 
      // B2B Branching
      else if (role === "WHOLESALE_USER") {
        window.location.href = "/profile/export"; 
      }
      // Student Branching
      else if (role === "STUDENT") {
        window.location.href = "/profile/academy";
      }
      else {
        window.location.href = "/shop";
      }
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">
      <div className="w-full max-w-sm space-y-8 bg-white p-10 shadow-2xl rounded-sm border border-stone-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#2C1810] rounded-full flex items-center justify-center mx-auto shadow-xl">
             <CoffeeIcon className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-serif italic text-[#2C1810]">Member Login</h1>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Kiyota Coffee Roasters</p>
        </div>

        {state?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-in slide-in-from-top-1">
            <p className="text-red-700 text-xs font-bold uppercase tracking-tighter italic">
              {state.error}
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              required 
              disabled={isPending}
              className="w-full border-b border-stone-200 bg-transparent py-3 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-50" 
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
              disabled={isPending}
              className="w-full border-b border-stone-200 bg-transparent py-3 text-sm focus:border-[#D4AF37] outline-none transition-all disabled:opacity-50" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-500 shadow-xl cursor-pointer disabled:bg-stone-300"
          >
            {isPending ? "Connecting..." : "Access My Account"}
          </button>

          <div className="text-center pt-6 border-t border-stone-100">
             <p className="text-xs text-stone-400 font-light">
               New to the Roastery? 
               <Link href="/register" className="text-[#2C1810] font-bold ml-2 underline underline-offset-4">Register Now</Link>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}