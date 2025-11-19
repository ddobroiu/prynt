import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type OfferData = {
  client: {
    name: string;
    company?: string;
    cui?: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    metadata?: any; // Detalii extra (dimensiuni, material)
  }>;
  offerNumber: string;
  date: string;
};

export const generateOfferPDF = async (data: OfferData): Promise<Buffer> => {
  const doc = new jsPDF();

  // --- HEADER ---
  // Logo (Simulat text, ideal ar fi imagine base64)
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text("Prynt.ro", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Tipar Digital & Producție Publicitară", 14, 26);
  doc.text("Email: contact@prynt.ro", 14, 31);
  doc.text("Tel: +40 750 473 111", 14, 36);

  // --- INFO OFERTĂ (Dreapta Sus) ---
  doc.setFontSize(12);
  doc.setTextColor(0);
  const rightX = 140;
  doc.text(`OFERTĂ PREȚ`, rightX, 20);
  doc.setFontSize(10);
  doc.text(`Nr: ${data.offerNumber}`, rightX, 26);
  doc.text(`Data: ${data.date}`, rightX, 31);
  doc.text(`Valabilă: 30 zile`, rightX, 36);

  // --- BENEFICIAR (Stânga Jos Header) ---
  doc.setDrawColor(200);
  doc.line(14, 45, 196, 45); // Linie separatoare

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("BENEFICIAR:", 14, 55);
  
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(data.client.company || data.client.name, 14, 62); // Prioritate nume firmă

  doc.setFontSize(10);
  if (data.client.company && data.client.name) {
      doc.text(`Pers. contact: ${data.client.name}`, 14, 67);
  }
  if (data.client.cui) {
      doc.text(`CUI/CIF: ${data.client.cui}`, 14, 72);
  }
  if (data.client.email) {
      doc.text(`Email: ${data.client.email}`, 14, data.client.cui ? 77 : 72); // Ajustare poziție
  }

  // --- TABEL PRODUSE ---
  const tableBody = data.items.map((item, index) => {
    // Construim descrierea din metadata
    let desc = item.title;
    if (item.metadata) {
        const details = [];
        if (item.metadata.width && item.metadata.height) details.push(`${item.metadata.width}x${item.metadata.height} cm`);
        if (item.metadata.material) details.push(item.metadata.material);
        if (details.length) desc += `\n(${details.join(", ")})`;
    }

    return [
      index + 1,
      desc,
      `${item.quantity} buc`,
      `${item.price.toFixed(2)} RON`,
      `${(item.price * item.quantity).toFixed(2)} RON`
    ];
  });

  // Calcul Total
  const totalVal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tva = totalVal * 0.19;
  const totalCuTva = totalVal + tva;

  autoTable(doc, {
    startY: 90,
    head: [["#", "Produs / Serviciu", "Cant.", "Preț Unitar", "Total"]],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo Header
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' }, // Descriere flexibilă
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
    },
    foot: [
        ["", "", "", "Subtotal:", `${totalVal.toFixed(2)} RON`],
        ["", "", "", "TVA (19%):", `${tva.toFixed(2)} RON`],
        ["", "", "", "TOTAL:", `${totalCuTva.toFixed(2)} RON`]
    ],
    footStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: 'bold', halign: 'right' }
  });

  // --- FOOTER ---
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Aceasta este o ofertă generată automat și nu ține loc de factură fiscală.", 14, finalY);
  doc.text("Prețurile includ TVA (dacă nu este specificat altfel).", 14, finalY + 5);
  
  // Semnătură digitală simplă
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generat de Prynt AI Assistant la ${new Date().toLocaleString('ro-RO')}`, 14, 285);

  // Returnăm buffer-ul (ca ArrayBuffer pentru compatibilitate Next.js App Router)
  return Buffer.from(doc.output("arraybuffer"));
};