import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// Helper pentru buffer
async function pdfStreamToBuffer(pdf: typeof PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    pdf.on("data", (chunk) => chunks.push(chunk));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", (err) => reject(err));
  });
}

// Helper pentru formatare preț
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " RON";

export async function POST(req: NextRequest) {
  try {
    const { items, shipping } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Nu există produse." }, { status: 400 });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const pdfBufferPromise = pdfStreamToBuffer(doc);

    // --- 1. HEADER & LOGO ---
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    
    // Logo (Stânga)
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 60 });
    }

    // Info Companie (Stânga, sub logo)
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PRYNT.RO", 50, 110)
      .font("Helvetica")
      .fontSize(9)
      .text("Tipografie Online & Large Format", 50, 125)
      .text("Email: contact@prynt.ro", 50, 140)
      .text("Tel: 0750.259.955", 50, 155);

    // Info Ofertă (Dreapta)
    const today = new Date();
    const validUntil = new Date();
    validUntil.setDate(today.getDate() + 30);

    const rightColX = 350;
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("OFERTĂ DE PREȚ", rightColX, 45, { align: "right" })
      .fontSize(10)
      .font("Helvetica")
      .text(`Data emiterii: ${today.toLocaleDateString("ro-RO")}`, rightColX, 75, { align: "right" })
      .text(`Valabilă până la: ${validUntil.toLocaleDateString("ro-RO")}`, rightColX, 90, { align: "right" })
      .moveDown(4);

    // --- 2. TABEL PRODUSE ---
    let y = 200;
    
    // Header Tabel (Background Gri)
    doc.rect(50, y, 500, 25).fill("#f3f4f6");
    doc.fillColor("black").font("Helvetica-Bold").fontSize(9);
    doc.text("PRODUS / DETALII", 60, y + 8);
    doc.text("CANT.", 320, y + 8, { width: 40, align: "center" });
    doc.text("PREȚ UNIT.", 380, y + 8, { width: 70, align: "right" });
    doc.text("TOTAL", 460, y + 8, { width: 80, align: "right" });
    
    y += 35;
    doc.font("Helvetica").fontSize(9);

    let subtotal = 0;

    // Iterare Produse
    items.forEach((item: any) => {
      const name = item.name || item.title || "Produs";
      const qty = Number(item.quantity || 1);
      const price = Number(item.unitAmount || item.price || 0);
      const totalItem = price * qty;
      subtotal += totalItem;

      // Verificare pagină nouă
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      // Titlu Produs
      doc.font("Helvetica-Bold").text(name, 60, y, { width: 250 });
      
      // Coloane numerice
      doc.font("Helvetica").text(qty.toString(), 320, y, { width: 40, align: "center" });
      doc.text(formatCurrency(price), 380, y, { width: 70, align: "right" });
      doc.font("Helvetica-Bold").text(formatCurrency(totalItem), 460, y, { width: 80, align: "right" });

      // --- DETALII CONFIGURATE (METADATA) ---
      y += 15;
      doc.font("Helvetica").fontSize(8).fillColor("#555555");

      // Extragem detaliile relevante din metadata
      const meta = item.metadata || {};
      const detailsParts: string[] = [];

      // Mapare chei tehnice -> etichete prietenoase
      const labels: Record<string, string> = {
          width_cm: "Lățime", height_cm: "Înălțime", 
          material: "Material", materialId: "Material",
          want_hem_and_grommets: "Finisaje", want_wind_holes: "Găuri vânt",
          details: "Specificații", textDesign: "Text dorit"
      };

      // 1. Dacă avem un câmp 'details' explicit (din Chat), îl afișăm primul
      if (meta.details) detailsParts.push(meta.details);

      // 2. Dacă avem dimensiuni
      if (meta.width_cm && meta.height_cm) {
          detailsParts.push(`Dimensiuni: ${meta.width_cm} x ${meta.height_cm} cm`);
      }

      // 3. Alte opțiuni relevante
      Object.entries(meta).forEach(([key, val]) => {
          if (["details", "width_cm", "height_cm", "price", "source", "productId", "productSlug"].includes(key)) return;
          if (!val) return;
          
          // Formatare valori boolean/tehnice
          let readableVal = String(val);
          if (val === true) readableVal = "Da";
          if (val === false) readableVal = "Nu";
          if (String(val).includes("frontlit_")) readableVal = val === "frontlit_510" ? "Premium (510g)" : "Standard (440g)";

          const label = labels[key] || key;
          // Afișăm doar dacă pare o opțiune de produs (evităm ID-uri lungi etc)
          if (label.length < 20 && String(readableVal).length < 50) {
             detailsParts.push(`${label.charAt(0).toUpperCase() + label.slice(1)}: ${readableVal}`);
          }
      });

      // Randare detalii (linie cu linie sau bullet)
      detailsParts.forEach(detail => {
          doc.text(`• ${detail}`, 70, y, { width: 240 });
          y += 10;
      });

      // Linie separator
      y += 10;
      doc.moveTo(50, y).lineTo(550, y).lineWidth(0.5).strokeColor("#e5e7eb").stroke();
      y += 15;
      
      // Reset culoare
      doc.fillColor("black");
    });

    // --- 3. TOTALURI ---
    const shippingCost = Number(shipping || 0);
    const totalGrand = subtotal + shippingCost;

    y += 10;
    // Dacă suntem jos pe pagină, să nu tăiem totalul
    if (y > 700) { doc.addPage(); y = 50; }

    // Container Totaluri (Dreapta)
    const totalX = 350;
    const valX = 440;

    doc.font("Helvetica");
    doc.text("Subtotal:", totalX, y, { width: 80, align: "right" });
    doc.text(formatCurrency(subtotal), valX, y, { width: 100, align: "right" });
    y += 15;

    doc.text("Livrare:", totalX, y, { width: 80, align: "right" });
    doc.text(shippingCost === 0 ? "Gratuit" : formatCurrency(shippingCost), valX, y, { width: 100, align: "right" });
    y += 20;

    // Linie îngroșată
    doc.moveTo(totalX, y).lineTo(550, y).lineWidth(1).strokeColor("black").stroke();
    y += 10;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("TOTAL:", totalX, y, { width: 80, align: "right" });
    doc.text(formatCurrency(totalGrand), valX, y, { width: 100, align: "right" });

    // --- 4. FOOTER ---
    const footerY = 730;
    doc.moveTo(50, footerY).lineTo(550, footerY).lineWidth(0.5).strokeColor("#cccccc").stroke();
    
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#777777")
      .text(
        "Această ofertă este valabilă timp de 30 de zile de la data emiterii. Prețurile includ TVA (dacă este aplicabil). Pentru confirmarea comenzii, vă rugăm să ne contactați sau să finalizați comanda online pe prynt.ro.",
        50,
        footerY + 10,
        { align: "center", width: 500 }
      );

    doc.end();

    const buffer = await pdfBufferPromise;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Oferta_Prynt_${Date.now()}.pdf`,
      },
    });

  } catch (error: any) {
    console.error("Eroare generare PDF:", error);
    return NextResponse.json({ message: "Eroare internă la generarea PDF." }, { status: 500 });
  }
}