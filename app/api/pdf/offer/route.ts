import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

// Funcție helper pentru a colecta stream-ul PDF într-un Buffer
async function pdfStreamToBuffer(pdf: typeof PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    pdf.on("data", (chunk) => chunks.push(chunk));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", (err) => reject(err));
  });
}

export async function POST(req: NextRequest) {
  try {
    const { items, shipping } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Nu există produse." }, { status: 400 });
    }

    // 1. Inițializare Document PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Colectăm datele (nu trimitem încă răspunsul)
    const pdfBufferPromise = pdfStreamToBuffer(doc);

    // --- HEADER ---
    doc
      .fontSize(20)
      .text("Prynt.ro", { align: "left" })
      .fontSize(10)
      .text("Tipografie Online & Large Format", { align: "left" })
      .moveDown();

    doc
      .fontSize(10)
      .text(`Data ofertă: ${new Date().toLocaleDateString("ro-RO")}`, { align: "right" })
      .moveDown(2);

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("OFERTA DE PRET", { align: "center" })
      .moveDown(2);

    // --- TABEL PRODUSE ---
    let y = doc.y;
    
    // Header Tabel
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Produs", 50, y);
    doc.text("Cant.", 300, y, { width: 40, align: "right" });
    doc.text("Pret Unit.", 350, y, { width: 80, align: "right" });
    doc.text("Total (RON)", 440, y, { width: 100, align: "right" });
    
    // Linie sub header
    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
    y += 25;

    doc.font("Helvetica");

    let subtotal = 0;

    // Rânduri Produse
    items.forEach((item: any) => {
      const name = item.name || item.title || "Produs";
      const qty = Number(item.quantity || 1);
      const price = Number(item.unitAmount || item.price || 0);
      const totalItem = price * qty;
      subtotal += totalItem;

      // Verificăm dacă mai avem loc pe pagină
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(name, 50, y, { width: 240 });
      doc.text(qty.toString(), 300, y, { width: 40, align: "right" });
      doc.text(price.toFixed(2), 350, y, { width: 80, align: "right" });
      doc.text(totalItem.toFixed(2), 440, y, { width: 100, align: "right" });

      // Detalii extra (dacă există metadata relevante)
      if (item.metadata?.details) {
          y += 12;
          doc.fontSize(8).text(item.metadata.details, 50, y, { color: 'grey' });
          doc.fontSize(10).text("", { color: 'black' }); // Reset culoare
      }

      y += 20; // Spațiu între rânduri
    });

    // Linie final tabel
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    // --- TOTALURI ---
    const shippingCost = Number(shipping || 0);
    const totalGrand = subtotal + shippingCost;

    doc.font("Helvetica-Bold");
    
    // Subtotal
    doc.text("Subtotal:", 350, y, { width: 80, align: "right" });
    doc.text(subtotal.toFixed(2) + " RON", 440, y, { width: 100, align: "right" });
    y += 15;

    // Livrare
    doc.text("Livrare:", 350, y, { width: 80, align: "right" });
    doc.text(shippingCost.toFixed(2) + " RON", 440, y, { width: 100, align: "right" });
    y += 20;

    // Total General
    doc.fontSize(12);
    doc.text("TOTAL DE PLATA:", 300, y, { width: 130, align: "right" });
    doc.text(totalGrand.toFixed(2) + " RON", 440, y, { width: 100, align: "right" });

    // --- FOOTER ---
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Aceasta este o ofertă generată automat și nu ține loc de factură fiscală.", 50, 750, { align: "center", width: 500 });

    // Finalizare PDF
    doc.end();

    // Așteptăm generarea buffer-ului
    const buffer = await pdfBufferPromise;

    // Returnăm răspunsul cu header-ul corect pentru download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=oferta-prynt.pdf`,
      },
    });

  } catch (error: any) {
    console.error("Eroare generare PDF:", error);
    return NextResponse.json({ message: "Eroare internă la generarea PDF." }, { status: 500 });
  }
}