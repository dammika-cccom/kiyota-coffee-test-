"use client";

import { handleLogout } from "@/app/(public)/login/actions";
import { LogOutIcon } from "@/components/ui/icons";

export default function SignOutButton() {
  return (
    <button 
      onClick={() => handleLogout()}
      className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all rounded-sm cursor-pointer border-none bg-transparent"
    >
      <LogOutIcon className="w-4 h-4" /> Sign Out
    </button>
  );
}