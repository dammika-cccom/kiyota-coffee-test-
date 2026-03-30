"use client";

import { generateInstitutionalInvoice, type InvoiceItem } from "@/lib/generateInvoice";
import { FileTextIcon } from "@/components/ui/icons";
import type { orders } from "@/db/schema";

type OrderRecord = typeof orders.$inferSelect;

export default function InvoiceDownloadButton({ 
  order, 
  variant = "primary" 
}: { 
  order: OrderRecord, 
  variant?: "primary" | "ghost" 
}) {
  const handleDownload = () => {
    // FIXED: Non-null assertion and strict metadata parsing
    const metadata = order.metadata as { items?: InvoiceItem[] } | null;

    generateInstitutionalInvoice({
      orderId: order.id,
      customerName: order.customerName || "Institutional Partner",
      customerAddress: order.customerAddress || "Fulfillment Archive",
      customerPhone: order.customerPhone || "N/A",
      amount: Number(order.totalAmount || 0),
      shippingCost: Number(order.shippingCost || 0),
      paymentType: order.paymentType || "STANDARD",
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "PENDING",
      items: metadata?.items || []
    });
  };

  if (variant === "ghost") {
    return (
      <button onClick={handleDownload} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#D4AF37] hover:text-[#2C1810] transition-colors cursor-pointer">
        <FileTextIcon className="w-4 h-4" /> Download PDF
      </button>
    );
  }

  return (
    <button onClick={handleDownload} className="w-full border-2 border-stone-100 py-4 text-[10px] font-black uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center gap-3 transition-all cursor-pointer">
       <FileTextIcon className="w-4 h-4" /> Download Pro-forma Invoice
    </button>
  );
}