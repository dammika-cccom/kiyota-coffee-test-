"use client";

import { useState } from "react";
import { resetUserPassword, releaseEmail, toggleUserSuspension, authorizeB2BPartner } from "./actions";
import { TrashIcon, ClockIcon, ShieldAlertIcon, AwardIcon, RefreshCwIcon } from "@/components/ui/icons";

export default function UserManagementActions({ 
  userId, isSuspended, email, b2bStatus 
}: { 
  userId: string, isSuspended: boolean, email: string, b2bStatus: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleB2BApproval = async () => {
    const limit = prompt(`Enter CREDIT LIMIT for ${email} (LKR):`, "100000");
    if (!limit) return;
    const terms = prompt(`Enter REPAYMENT TERMS (Days):`, "30");
    if (!terms) return;

    setLoading(true);
    const res = await authorizeB2BPartner(userId, limit, parseInt(terms));
    if (res.success) alert(res.success);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* B2B AUTHORIZATION TRIGGER */}
      {b2bStatus === "PENDING" && (
        <button 
          onClick={handleB2BApproval}
          disabled={loading}
          className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-sm transition-all"
          title="Authorize B2B Facility"
        >
          {loading ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <AwardIcon className="w-4 h-4" />}
        </button>
      )}

      {/* RESET PASSWORD */}
      <button 
        onClick={async () => {
          if (confirm(`Reset credentials for ${email}?`)) {
            const res = await resetUserPassword(userId);
            if (res.success) alert(res.success);
          }
        }}
        className="p-2 text-stone-400 hover:text-[#2C1810]"
        title="Reset Password"
      >
        <ClockIcon className="w-4 h-4" />
      </button>

      {/* SUSPEND TOGGLE */}
      <button 
        onClick={() => toggleUserSuspension(userId, isSuspended)}
        className={`p-2 transition-all ${isSuspended ? 'text-red-600' : 'text-stone-300 hover:text-red-500'}`}
        title="Toggle Access"
      >
        <ShieldAlertIcon className="w-4 h-4" />
      </button>

      {/* HARD DELETE */}
      <button 
        onClick={async () => {
          if (confirm(`PERMANENT PURGE: ${email}?`)) await releaseEmail(userId);
        }}
        className="p-2 text-stone-200 hover:text-red-600 transition-all"
        title="Delete Member"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}