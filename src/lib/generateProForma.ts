import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface QuoteData {
  company: string;
  contact: string;
  destination: string;
  product: string;
  qty: number;
  fob: number;
  freight: number;
  insurance: number;
}

export const generateProForma = (data: QuoteData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const ref = `PF-${Date.now().toString().slice(-6)}`;

  // 1. INSTITUTIONAL BRANDING
  doc.setFillColor(44, 24, 16); // Kiyota Espresso
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(212, 175, 55); // Kiyota Gold
  doc.setFontSize(24);
  doc.setFont("serif", "italic");
  doc.text("KIYOTA COFFEE ROASTERS", 15, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(255);
  doc.setFont("helvetica", "normal");
  doc.text("INDUSTRIAL EXPORT DIVISION • MATALE, SRI LANKA", 15, 32);

  // 2. DOCUMENT HEADER
  doc.setTextColor(44, 24, 16);
  doc.setFontSize(18);
  doc.text("PRO-FORMA INVOICE", 15, 55);
  
  doc.setFontSize(9);
  doc.text(`DATE: ${date}`, 150, 55);
  doc.text(`REF: ${ref}`, 150, 60);

  // 3. BUYER & LOGISTICS COORDINATES
  doc.setFont("helvetica", "bold");
  doc.text("CONSIGNEE:", 15, 75);
  doc.setFont("helvetica", "normal");
  doc.text(data.company, 15, 80);
  doc.text(`Attn: ${data.contact}`, 15, 85);
  
  doc.setFont("helvetica", "bold");
  doc.text("PORT OF DISCHARGE:", 110, 75);
  doc.setFont("helvetica", "normal");
  doc.text(data.destination, 110, 80);

  // 4. ITEM SPECIFICATIONS
  autoTable(doc, {
    startY: 95,
    head: [["Technical Description", "Quantity", "Unit Price (FOB)", "Total (USD)"]],
    body: [
      [
        `${data.product}\nSpecialty Grade Arabica\nJFTC Standard QC`,
        `${data.qty} KG`,
        `$${data.fob}`,
        `$${(data.qty * data.fob).toLocaleString()}`
      ]
    ],
    headStyles: { fillColor: [44, 24, 16], textColor: [212, 175, 55] },
    styles: { fontSize: 9, cellPadding: 5 }
  });

  // 5. LANDED COST CALCULATION
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  const subtotal = data.qty * data.fob;
  const grandTotal = subtotal + data.freight + data.insurance;

  doc.setFontSize(10);
  doc.text(`FOB VALUE:`, 130, finalY);
  doc.text(`$${subtotal.toLocaleString()}`, 175, finalY, { align: "right" });
  
  doc.text(`FREIGHT CHARGES:`, 130, finalY + 7);
  doc.text(`$${data.freight.toLocaleString()}`, 175, finalY + 7, { align: "right" });
  
  doc.text(`INSURANCE:`, 130, finalY + 14);
  doc.text(`$${data.insurance.toLocaleString()}`, 175, finalY + 14, { align: "right" });

  doc.setFillColor(212, 175, 55);
  doc.rect(125, finalY + 18, 70, 10, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL CIF VALUE:`, 130, finalY + 24.5);
  doc.text(`USD ${grandTotal.toLocaleString()}`, 190, finalY + 24.5, { align: "right" });

  // 6. INSTITUTIONAL SIGNATURE
  doc.setTextColor(150);
  doc.setFontSize(8);
  doc.text("Valid for 15 days. Subject to Coffee Board Approval.", 15, 270);
  doc.text("CERTIFIED BY: KAZUYUKI KIYOTA", 15, 275);

  doc.save(`Kiyota_ProForma_${ref}.pdf`);
};