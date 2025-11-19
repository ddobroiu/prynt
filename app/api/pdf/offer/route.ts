import { NextResponse } from "next/server";
import { generateOfferPDF } from "@/lib/pdfTemplate";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Definim tipul pentru datele clientului care pot veni din exterior (ex: Chat AI)
type ExternalClientData = {
  clientName?: string;
  companyName?: string;
  cui?: string;
  email?: string;
  phone?: string;
  items?: any[]; // Putem trimite și produse specifice, nu doar cele din coș
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Citim datele trimise (poate fi gol dacă e apel simplu din coș)
    const body: ExternalClientData = await req.json().catch(() => ({}));

    let clientData = {
      name: body.clientName || session?.user?.name || "Oaspete",
      company: body.companyName || "",
      cui: body.cui || "",
      email: body.email || session?.user?.email || "",
      phone: body.phone || "",
    };

    let itemsToOffer = body.items;

    // Dacă nu au fost trimise produse specifice prin body (ex: din AI), luăm din coșul userului salvat în DB (dacă există)
    // NOTĂ: Pentru coșul 'guest' (localStorage), clientul trebuie să trimită lista de produse în body.
    if (!itemsToOffer && session?.user?.email) {
       // Logica de recuperare coș din DB (dacă ai implementat coș salvat în DB)
       // Deocamdată, pentru simplitate, presupunem că frontend-ul trimite întotdeauna produsele (cart items)
    }

    if (!itemsToOffer || itemsToOffer.length === 0) {
        return NextResponse.json({ error: "Nu există produse pentru ofertă." }, { status: 400 });
    }

    // Generăm PDF-ul
    const pdfBuffer = await generateOfferPDF({
      client: clientData,
      items: itemsToOffer,
      offerNumber: `OFF-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("ro-RO"),
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Oferta_Prynt_${clientData.name.replace(/\s/g, '_')}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("PDF Gen Error:", error);
    return NextResponse.json({ error: "Eroare la generarea ofertei" }, { status: 500 });
  }
}