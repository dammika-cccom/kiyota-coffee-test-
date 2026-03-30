"use client";

import { updateOrderStatus } from "./actions"; // Ensure this action exists

export default function OrderStatusToggle({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <select 
      defaultValue={currentStatus}
      onChange={(e) => updateOrderStatus(orderId, e.target.value)}
      className="text-[9px] font-black uppercase bg-stone-50 border border-stone-100 p-2 rounded-sm outline-none cursor-pointer hover:bg-stone-100 transition-all"
    >
      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}