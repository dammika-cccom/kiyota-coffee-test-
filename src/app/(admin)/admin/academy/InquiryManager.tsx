"use client";
import { useState } from "react";
import { updateStudentStatus } from "./actions";
import { CheckCircleIcon, ClockIcon, UserIcon, BookOpenIcon } from "@/components/ui/icons";

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  experienceLevel: string;
  message: string | null;
  status: string | null;
  courseName: string | null;
}

export default function InquiryManager({ inquiries }: { inquiries: Inquiry[] }) {
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = inquiries.filter(i => 
    filter === "ALL" ? true : i.status === filter
  );

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {["ALL", "NEW", "CONTACTED", "ENROLLED"].map((s) => (
          <button 
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
              filter === s ? "bg-[#2C1810] text-white border-[#2C1810]" : "bg-white text-stone-400 border-stone-100 hover:border-[#D4AF37]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* INQUIRY LIST */}
      <div className="bg-white border border-stone-100 rounded-sm divide-y divide-stone-50 shadow-sm overflow-hidden">
        {filteredData.map((iq) => (
          <div key={iq.id} className="group">
            <div 
              onClick={() => setSelectedId(selectedId === iq.id ? null : iq.id)}
              className={`p-6 flex justify-between items-center cursor-pointer transition-colors ${selectedId === iq.id ? 'bg-stone-50' : 'hover:bg-stone-50/50'}`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <p className="text-sm font-bold text-[#2C1810]">{iq.fullName}</p>
                   <span className="text-[8px] font-black uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full">
                      {iq.courseName || "General"}
                   </span>
                </div>
                <p className="text-[10px] text-stone-400 uppercase font-black tracking-tighter">
                  {iq.experienceLevel} • {iq.status}
                </p>
              </div>
              <ClockIcon className={`w-4 h-4 text-stone-300 transition-transform ${selectedId === iq.id ? 'rotate-180' : ''}`} />
            </div>

            {selectedId === iq.id && (
              <div className="p-8 bg-stone-50 border-t border-stone-100 animate-in slide-in-from-top-2 duration-300">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-2">
                         <UserIcon className="w-3 h-3" /> Contact Details
                      </h4>
                      <div className="text-xs space-y-1 text-stone-600">
                         <p>Email: <span className="font-bold text-[#2C1810]">{iq.email}</span></p>
                         <p>Mobile: <span className="font-bold text-[#2C1810]">{iq.mobile}</span></p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-2">
                         <BookOpenIcon className="w-3 h-3" /> Application Message
                      </h4>
                      {/* FIXED: Escaped double quotes below */}
                      <p className="text-xs text-stone-500 italic leading-relaxed">
                        &quot;{iq.message || "No specific requirements mentioned."}&quot;
                      </p>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-center">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => updateStudentStatus(iq.id, "ENROLLED")}
                        className="bg-green-600 text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                         <CheckCircleIcon className="w-3 h-3" /> Mark Enrolled
                      </button>
                   </div>
                   <p className="text-[8px] font-black text-stone-300 uppercase">Ref: {iq.id.slice(0,8)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredData.length === 0 && (
          <p className="p-12 text-center text-xs text-stone-400 italic">No inquiries found for this filter.</p>
        )}
      </div>
    </div>
  );
}