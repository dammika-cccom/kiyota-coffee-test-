"use client";

import { CheckCircleIcon, TrashIcon } from "@/components/ui/icons";
import { updateUserRole, toggleUserSuspension, deleteUser } from "./actions";

interface UserActionsProps {
  userId: string;
  isSuspended: boolean;
}

export function UserActions({ userId, isSuspended }: UserActionsProps) {
  return (
    <div className="flex gap-2 justify-end items-center">
      {/* 1. Upgrade/Approve Button */}
      <button 
        onClick={async () => {
          if (confirm("Promote this user to WHOLESALE partner?")) {
            await updateUserRole(userId, "WHOLESALE");
          }
        }}
        className="text-stone-400 hover:text-green-600 transition-colors p-2 cursor-pointer" 
        title="Approve as Wholesale"
      >
        <CheckCircleIcon className="w-4 h-4" />
      </button>

      {/* 2. Suspend/Unsuspend Button */}
      <button 
        onClick={async () => {
          const action = isSuspended ? "Unsuspend" : "Suspend";
          if (confirm(`${action} this account?`)) {
            await toggleUserSuspension(userId, isSuspended);
          }
        }}
        className={`text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-sm border transition-all cursor-pointer ${
          isSuspended 
            ? "bg-stone-800 text-white border-stone-800" 
            : "border-stone-200 text-stone-400 hover:border-red-500 hover:text-red-500"
        }`}
      >
        {isSuspended ? "Unsuspend" : "Suspend"}
      </button>

      {/* 3. Delete Button */}
      <button 
        onClick={async () => {
          if (confirm("CRITICAL: Permanently delete this user? This cannot be undone.")) {
            await deleteUser(userId);
          }
        }}
        className="text-stone-300 hover:text-red-600 transition-colors p-2 cursor-pointer"
        title="Delete User"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}