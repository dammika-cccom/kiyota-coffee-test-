"use client";
import { useActionState } from "react";
import { submitInquiry, AcademyState } from "@/app/(admin)/admin/academy/actions"; 
import { BookOpenIcon, ClockIcon, CheckCircleIcon } from "@/components/ui/icons";

export default function PublicAcademyPage() {
  // FIXED: Type assertion ensures 'state' is AcademyState, not 'never'
  const [state, formAction, isPending] = useActionState(submitInquiry, {} as AcademyState);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-40 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
           <BookOpenIcon className="w-12 h-12 text-[#D4AF37] mx-auto" />
           <h1 className="text-6xl font-serif italic text-[#2C1810]">The Masterclass.</h1>
           <div className="flex items-center justify-center gap-3 text-stone-400">
              <ClockIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Enrolling Now for Q2 2026</span>
           </div>
        </div>

        {state?.success ? (
          <div className="bg-white p-12 text-center shadow-xl border border-green-100 rounded-sm space-y-6 animate-in zoom-in">
             <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
             <h2 className="text-2xl font-serif italic text-[#2C1810]">Enrollment Logged</h2>
             <p className="text-stone-400 text-sm">We will contact you via mobile to verify your technical prerequisites.</p>
          </div>
        ) : (
          <form action={formAction} className="bg-white p-10 shadow-2xl border border-stone-100 rounded-sm space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
               <input name="fullName" placeholder="Full Identity" required className="kiyota-input" />
               <input name="email" type="email" placeholder="Email Address" required className="kiyota-input" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <input name="mobile" placeholder="+94 Mobile" required className="kiyota-input" />
               <input name="experienceLevel" placeholder="Current Skill (Beginner/Expert)" required className="kiyota-input" />
            </div>
            <textarea name="message" placeholder="Technical Goals..." className="w-full bg-stone-50 p-4 text-sm" rows={4} />
            <button disabled={isPending} className="w-full bg-[#2C1810] text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all">
              {isPending ? "Connecting..." : "Confirm Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}