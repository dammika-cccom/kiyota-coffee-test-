import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  amount: number;
  shippingCost: number;
  paymentType: string;
  date: string;
  items: InvoiceItem[];
}

// Define the interface for the jsPDF instance with the autotable plugin results
interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const generateInstitutionalInvoice = (data: InvoiceData) => {
  const doc = new jsPDF() as jsPDFWithPlugin;
  const title = data.paymentType === "ON_CREDIT" ? "PRO-FORMA INVOICE" : "COMMERCIAL INVOICE";

  // 1. BRANDING HEADER
  doc.setFillColor(44, 24, 16); 
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(212, 175, 55); 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("KIYOTA COFFEE ROASTERS", 14, 25);
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("GLOBAL SUPPLY CHAIN | MATALE HQ | SRI LANKA", 14, 32);

  // 2. DOCUMENT METADATA
  doc.setTextColor(44, 24, 16);
  doc.setFontSize(10);
  doc.text(title, 140, 50);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: #${data.orderId.slice(0, 12).toUpperCase()}`, 140, 55);
  doc.text(`Date: ${data.date}`, 140, 60);

  // 3. BILLING IDENTITY
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 14, 50);
  doc.setFont("helvetica", "normal");
  doc.text(data.customerName, 14, 55);
  const splitAddress = doc.splitTextToSize(data.customerAddress, 80);
  doc.text(splitAddress, 14, 60);
  doc.text(`Contact: ${data.customerPhone}`, 14, 75);

  // 4. ITEMIZATION TABLE
  const tableRows = data.items.map(item => [
    item.name,
    `${item.weight}G`,
    item.quantity,
    `LKR ${item.price.toLocaleString()}`,
    `LKR ${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [["Product Specification", "Unit Weight", "Qty", "Unit Price", "Subtotal"]],
    body: tableRows,
    headStyles: { fillColor: [44, 24, 16], textColor: [212, 175, 55] },
    alternateRowStyles: { fillColor: [250, 249, 246] },
  });

  // 5. TOTALS SECTION
  // FIXED: Using properly typed lastAutoTable instead of 'any'
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Logistics Fee: LKR ${data.shippingCost.toLocaleString()}`, 140, finalY);
  doc.setFontSize(14);
  doc.text(`GRAND TOTAL: LKR ${data.amount.toLocaleString()}`, 140, finalY + 8);

  doc.save(`Kiyota_${data.orderId.slice(0, 8)}.pdf`);
};