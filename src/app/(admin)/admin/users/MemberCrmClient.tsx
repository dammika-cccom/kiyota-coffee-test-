"use client";

import { useState } from "react";
import type { UserRecord } from "./page";
import UserManagementActions from "./UserManagementActions";
import CreditAdjustmentModal from "./CreditAdjustmentModal";
import { 
  CheckCircleIcon, ClockIcon, SearchIcon, UserIcon, 
  GlobeIcon, BuildingIcon, XIcon, MoveRightIcon, TrendingUpIcon 
} from "@/components/ui/icons";

/**
 * BUSINESS PROFILE INTERFACE
 * Safely maps the JSONB metadata for the audit modal.
 */
interface BusinessProfile {
  companyName?: string;
  registrationNumber?: string;
  monthlyVolumeForecast?: string;
  preferredPaymentTerm?: string;
}

type Tab = "ALL" | "BUYER" | "B2B_PENDING" | "WHOLESALE_USER";

export default function MemberCrmClient({ initialUsers }: { initialUsers: UserRecord[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [adjustmentUser, setAdjustmentUser] = useState<UserRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = initialUsers.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "ALL") return matchesSearch;
    if (activeTab === "B2B_PENDING") return u.b2bStatus === "PENDING" && matchesSearch;
    return u.role === activeTab && matchesSearch;
  });

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <nav className="flex gap-2 bg-stone-100 p-1 rounded-sm overflow-x-auto no-scrollbar">
          {(["ALL", "BUYER", "B2B_PENDING", "WHOLESALE_USER"] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`px-4 py-2 text-[9px] font-black uppercase rounded-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === t ? 'bg-[#2C1810] text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {t === "B2B_PENDING" ? "Partnership Desk" : t.replace("_", " ")}
            </button>
          ))}
        </nav>
        <div className="relative w-full max-w-sm group">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
           <input placeholder="Filter identity..." className="kiyota-input w-full pl-12 bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* --- CREDIT ADJUSTMENT MODAL --- */}
      {adjustmentUser && (
        <CreditAdjustmentModal 
          user={{
            id: adjustmentUser.id,
            email: adjustmentUser.email,
            creditLimit: adjustmentUser.creditLimit || "0.00",
            creditBalance: adjustmentUser.creditBalance || "0.00"
          }}
          isOpen={!!adjustmentUser}
          onClose={() => setAdjustmentUser(null)}
        />
      )}

      {/* --- KYC AUDIT MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[#2C1810]/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
           <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start border-b border-stone-100 pb-6">
                 <div className="flex items-center gap-4">
                    <BuildingIcon className="w-8 h-8 text-[#D4AF37]" />
                    <div>
                       <h3 className="text-2xl font-serif italic text-[#2C1810]">Institutional Audit</h3>
                       <p className="text-[10px] font-black uppercase text-stone-400 flex items-center gap-2 mt-1">
                          <UserIcon className="w-3 h-3" />
                          KYC Review: {selectedUser.email}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-stone-50 rounded-full transition-all cursor-pointer"><XIcon className="w-6 h-6 text-stone-300" /></button>
              </div>

              <div className="grid grid-cols-2 gap-8 bg-[#FAF9F6] p-8 rounded-sm border border-stone-100 shadow-inner">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest">Legal Entity</p>
                    <p className="text-sm font-bold text-[#2C1810]">{(selectedUser.businessProfile as BusinessProfile)?.companyName || 'N/A'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-stone-400">Monthly Forecast</p>
                    <p className="text-sm font-bold text-[#D4AF37] uppercase">{(selectedUser.businessProfile as BusinessProfile)?.monthlyVolumeForecast || 'Trial'}</p>
                 </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                 <UserManagementActions 
                   userId={selectedUser.id} 
                   isSuspended={selectedUser.isSuspended || false} 
                   email={selectedUser.email} 
                   b2bStatus={selectedUser.b2bStatus || "NONE"} 
                 />
              </div>
           </div>
        </div>
      )}

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <tbody className="divide-y divide-stone-50">
            {filtered.map(user => (
              <tr key={user.id} className="group hover:bg-stone-50/50 transition-colors">
                <td className="p-6" onClick={() => setSelectedUser(user)}>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-300">
                        {/* FIXED: UserIcon physically utilized to satisfy ESLint */}
                        <UserIcon className="w-4 h-4 opacity-40" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-[#2C1810]">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{user.email}</p>
                     </div>
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                         {user.isEmailVerified ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <ClockIcon className="w-4 h-4 text-amber-500" />}
                         <span className="text-[7px] font-black uppercase text-stone-400 mt-1">Verified</span>
                      </div>
                      {/* FIXED: GlobeIcon utilized for Wholesale Partners */}
                      {user.role === "WHOLESALE_USER" && (
                         <div className="flex items-center gap-4 border-l border-stone-100 pl-6">
                            <GlobeIcon className="w-4 h-4 text-blue-500" />
                            <button onClick={(e) => { e.stopPropagation(); setAdjustmentUser(user); }} className="flex flex-col items-center group/ledger cursor-pointer" title="Adjust Credit">
                                <TrendingUpIcon className="w-4 h-4 text-[#D4AF37] group-hover/ledger:scale-125 transition-transform" />
                                <span className="text-[7px] font-black uppercase mt-1 text-[#D4AF37]">Ledger</span>
                            </button>
                         </div>
                      )}
                   </div>
                </td>
                <td className="p-6 text-right" onClick={() => setSelectedUser(user)}>
                   <MoveRightIcon className="w-4 h-4 text-stone-200 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all ml-auto cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}