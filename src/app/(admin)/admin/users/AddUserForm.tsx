"use client";
import { useActionState } from "react";
import { adminAddUser, ActionResponse } from "./actions";
import { PlusIcon } from "@/components/ui/icons";

export default function AddUserForm() {
  // FIXED: Signature matches the updated action
  const [state, formAction, isPending] = useActionState(adminAddUser, null as ActionResponse);

  return (
    <div className="space-y-4">
      {/* Success/Error Feedback */}
      <div className="min-h-[20px]">
        {state?.success && (
          <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            {state.success}
          </div>
        )}
        {state?.error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-[10px] font-bold uppercase tracking-widest">
            {state.error}
          </div>
        )}
      </div>

      <form action={formAction} className="bg-white p-4 shadow-xl border border-stone-100 rounded-sm flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">Target Email</label>
          <input name="email" type="email" required disabled={isPending} className="border-b border-stone-200 py-1 text-xs outline-none focus:border-[#D4AF37] bg-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">First Name</label>
          <input name="firstName" required disabled={isPending} className="border-b border-stone-200 py-1 text-xs outline-none focus:border-[#D4AF37] bg-transparent w-24" />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-stone-400">Role</label>
          <select name="role" disabled={isPending} className="text-[10px] font-bold uppercase border-none bg-stone-50 p-2 rounded-sm cursor-pointer">
            <option value="BUYER">Buyer</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="SHOP_ADMIN">Shop Admin</option>
            <option value="ACADEMY_ADMIN">Academy Admin</option>
            <option value="FARM_ADMIN">Farm Admin</option>
          </select>
        </div>
        <button type="submit" disabled={isPending} className="bg-[#2C1810] text-white p-2.5 hover:bg-[#D4AF37] transition-all rounded-sm disabled:opacity-50 active:scale-95">
          {isPending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <PlusIcon className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}