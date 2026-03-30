import jsPDF from "jspdf";

export const generateCertificate = (studentName: string, courseTitle: string) => {
  const doc = new jsPDF({ orientation: "landscape" });
  
  // Premium Aesthetic Design
  doc.setFillColor(44, 24, 16); // Deep Espresso
  doc.rect(0, 0, 297, 20, "F");
  
  doc.setFont("serif", "italic");
  doc.setFontSize(40);
  doc.text("Certificate of Mastery", 148, 80, { align: "center" });
  
  doc.setFontSize(20);
  doc.text("This is to certify that", 148, 100, { align: "center" });
  
  doc.setFontSize(30);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text(studentName, 148, 120, { align: "center" });
  
  doc.setTextColor(0);
  doc.setFontSize(15);
  doc.text(`Has successfully completed the ${courseTitle}`, 148, 140, { align: "center" });
  
  doc.text("KIYOTA BARISTA ACADEMY", 148, 180, { align: "center" });
  
  doc.save(`${studentName}_Kiyota_Certificate.pdf`);
};