"use client";
import { updateUserRole, toggleUserSuspension } from "./actions"; 
import { ShieldAlertIcon, GlobeIcon, CheckCircleIcon } from "@/components/ui/icons";

interface Props {
  user: {
    id: string;
    firstName: string;
    role: string | null;
    isSuspended: boolean | null;
    requestingUpgrade: boolean | null;
  };
}

export default function WholesaleApproval({ user }: Props) {
  return (
    <div className="flex items-center gap-3 justify-end">
      
      {/* 1. B2B APPROVAL ACTION */}
      {user.role !== "WHOLESALE_USER" && (
        <button 
          onClick={async () => {
            if(confirm(`Upgrade ${user.firstName} to B2B Partner?`)) {
              await updateUserRole(user.id, "WHOLESALE_USER");
            }
          }}
          className="flex items-center gap-2 bg-white border border-[#D4AF37] text-[#D4AF37] px-4 py-1.5 rounded-full text-[9px] font-black uppercase hover:bg-[#D4AF37] hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <GlobeIcon className="w-3.5 h-3.5" /> Approve B2B
        </button>
      )}

      {/* 2. SECURITY TOGGLE (Suspension) */}
      <button 
        onClick={async () => {
            const action = user.isSuspended ? "Re-Activate" : "De-Activate";
            if(confirm(`Execute Security Protocol: ${action} account?`)) {
              await toggleUserSuspension(user.id, user.isSuspended || false);
            }
        }}
        className={`p-2 rounded-full transition-all cursor-pointer border ${
          user.isSuspended ? "bg-red-600 text-white border-red-600" : "bg-white text-stone-300 border-stone-100 hover:text-red-500"
        }`}
      >
        <ShieldAlertIcon className="w-4 h-4" />
      </button>

      {/* 3. VERIFIED STATUS INDICATOR */}
      {user.role === 'WHOLESALE_USER' && (
        <div className="flex items-center gap-1 border-l border-stone-100 pl-3">
           <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
           <span className="text-[8px] font-black text-green-600 uppercase">Verified</span>
        </div>
      )}
    </div>
  );
}