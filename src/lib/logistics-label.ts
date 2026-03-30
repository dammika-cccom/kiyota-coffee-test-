import jsPDF from "jspdf";
import type { OrderRecord } from "@/app/(admin)/admin/orders/page";

/**
 * INSTITUTIONAL LOGISTICS GENERATOR
 * Generates a 4x6 inch (Standard) Shipping Label
 */
export const generateShippingLabel = (order: OrderRecord) => {
  // Create a 4x6 inch PDF (Standard Shipping Label Size)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [4, 6]
  });

  // 1. BRAND HEADER
  doc.setFillColor(44, 24, 16); // #2C1810 Espresso
  doc.rect(0, 0, 4, 0.8, "F");
  
  doc.setTextColor(212, 175, 55); // #D4AF37 Gold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("KIYOTA COFFEE", 0.3, 0.4);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("GLOBAL SUPPLY CHAIN | MATALE HQ", 0.3, 0.6);

  // 2. LOGISTICS DATA (Order ID)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER REFERENCE:", 0.3, 1.2);
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.text(`#${order.id.slice(0, 12).toUpperCase()}`, 0.3, 1.45);

  // 3. SHIPPING IDENTITY
  doc.setLineWidth(0.01);
  doc.line(0.3, 1.7, 3.7, 1.7);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SHIP TO:", 0.3, 2.0);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const addressLines = doc.splitTextToSize(order.customerAddress || "No Address Provided", 3.4);
  doc.text(order.customerName || "B2C Buyer", 0.3, 2.25);
  doc.text(addressLines, 0.3, 2.5);
  doc.text(`T: ${order.customerPhone || "N/A"}`, 0.3, 3.5);

  // 4. TRACEABILITY BLOCK (The Institutional Promise)
  doc.setFillColor(250, 249, 246); // Cream BG
  doc.rect(0.3, 4.0, 3.4, 1.0, "F");
  doc.rect(0.3, 4.0, 3.4, 1.0, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("VERTICAL CHAIN AUTHENTICATION", 0.5, 4.3);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Linked Lot #:", 0.5, 4.6);
  doc.setFont("helvetica", "bold");
  doc.text(order.metadata?.lotNumber || "NOT_ASSIGNED", 1.5, 4.6);
  
  doc.setFont("helvetica", "normal");
  doc.text("SCA Verified:", 0.5, 4.8);
  doc.text("AUTHENTIC", 1.5, 4.8);

  // 5. FOOTER BARCODE AREA (Visual Placeholder)
  doc.setLineWidth(0.03);
  doc.line(0.3, 5.5, 3.7, 5.5);
  doc.setFontSize(7);
  doc.text("GENERATED VIA KIYOTA RETAIL CONTROL TOWER", 2.0, 5.8, { align: "center" });

  doc.save(`Kiyota_Label_${order.id.slice(0, 8)}.pdf`);
};