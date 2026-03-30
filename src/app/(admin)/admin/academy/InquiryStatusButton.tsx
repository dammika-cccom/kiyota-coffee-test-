"use client";

import { useState } from "react";
import { updateInquiryStatus } from "./actions";

interface StatusButtonProps {
  inquiryId: string;
}

export function InquiryStatusButton({ inquiryId }: StatusButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!confirm("Confirm student enrollment and send notification?")) return;
    
    setLoading(true);
    await updateInquiryStatus(inquiryId, "ENROLLED");
    setLoading(false);
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={loading}
      className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer disabled:opacity-30"
    >
      {loading ? "Processing..." : "Mark Enrolled →"}
    </button>
  );
}