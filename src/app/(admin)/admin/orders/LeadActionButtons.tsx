"use client";
import { updateLeadStatus, updateLeadPriority } from "./actions";

export default function LeadActionButtons({ leadId, currentStatus, currentPriority }: { leadId: string, currentStatus: string, currentPriority: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 pt-4 border-t border-stone-50">
       <select 
         defaultValue={currentStatus}
         onChange={(e) => updateLeadStatus(leadId, e.target.value)}
         className="text-[9px] font-black uppercase bg-stone-100 p-2 rounded-sm outline-none cursor-pointer hover:bg-stone-200"
       >
          <option value="NEW_LEAD">New Lead</option>
          <option value="QUOTED">Send Quote</option>
          <option value="NEGOTIATING">In Negotiation</option>
          <option value="COMPLETED">Deal Won</option>
          <option value="LOST">Deal Lost</option>
       </select>
       
       <select 
         defaultValue={currentPriority}
         onChange={(e) => updateLeadPriority(leadId, e.target.value)}
         className="text-[9px] font-black uppercase bg-stone-100 p-2 rounded-sm outline-none cursor-pointer hover:bg-stone-200"
       >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="URGENT">Urgent</option>
       </select>
    </div>
  );
}