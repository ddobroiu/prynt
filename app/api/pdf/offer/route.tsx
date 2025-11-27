import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToStream,
  Font,
} from "@react-pdf/renderer";

// --- 1. CONFIGURARE STILURI (Design System) ---
// Folosim culori profesionale: Navy Blue pentru seriozitate, Orange pentru accent (specific print).
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155", // Slate-700
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b", // Slate-900
    paddingBottom: 10,
  },
  logoContainer: {
    width: 120,
    height: 50,
    justifyContent: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "heavy",
    color: "#f97316", // Orange-500
    textTransform: "uppercase",
  },
  offerTitleBlock: {
    alignItems: "flex-end",
  },
  offerTitle: {
    fontSize: 20,
    color: "#1e293b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  offerSubtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  // Info Grid (Furnizor vs Beneficiar)
  infoContainer: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  infoColumn: {
    width: "48%",
    backgroundColor: "#f8fafc", // Slate-50
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#cbd5e1",
  },
  infoColumnActive: {
    borderLeftColor: "#f97316", // Orange border for Client
  },
  infoLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
    color: "#1e293b",
    marginBottom: 2,
  },
  infoValueBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  // Tabel Produse
  table: {
    width: "auto",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 24,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#1e293b", // Dark Header
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    padding: 8,
    textTransform: "uppercase",
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: "#334155",
  },
  // Zebra Striping
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f1f5f9",
  },
  // Coloane Tabel
  col1: { width: "5%", textAlign: "center" }, // Nr.
  col2: { width: "55%", textAlign: "left" },  // Produs
  col3: { width: "10%", textAlign: "center" }, // UM
  col4: { width: "15%", textAlign: "right" }, // Pret Unit
  col5: { width: "15%", textAlign: "right" }, // Total

  // Totals Section
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  totalsBox: {
    width: "40%",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 2,
    borderTopColor: "#1e293b",
  },
  totalLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f97316", // Orange amount
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 2,
  },
  footerBrand: {
    fontSize: 8,
    color: "#f97316",
    fontWeight: "bold",
  },
});

// --- 2. HELPERS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " RON";
};

// --- 3. COMPONENTA PDF ---
const OfferDocument = ({ order }: { order: any }) => {
  const createdDate = new Date(order.createdAt).toLocaleDateString("ro-RO");
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 30); // Valabil 30 zile

  // Parsing Addresses (assuming JSON or simple object structure)
  const billing = order.billingAddress || {};
  const shipping = order.shippingAddress || {};
  const clientName = billing.name || shipping.name || "Client";
  const clientPhone = billing.phone || shipping.phone || "-";
  const clientEmail = order.userEmail || "-";
  
  // Construire adresă completă
  const addressParts = [
    billing.street,
    billing.city,
    billing.county
  ].filter(Boolean).join(", ");

  const items = order.items || [];
  
  // Calculate Subtotal (if not stored)
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
  const shippingCost = order.shippingCost || 0; // Dacă există câmpul, altfel 0
  const grandTotal = order.total || subtotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {/* Dacă ai un logo public, folosește <Image src="https://prynt.ro/logo.png" /> */}
            <Text style={styles.logoText}>PRYNT.RO</Text>
          </View>
          <View style={styles.offerTitleBlock}>
            <Text style={styles.offerTitle}>OFERTĂ DE PREȚ</Text>
            <Text style={styles.offerSubtitle}>Nr: #{order.orderNo} / Data: {createdDate}</Text>
          </View>
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoContainer}>
          {/* FURNIZOR */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>FURNIZOR:</Text>
            <Text style={styles.infoValueBold}>PRYNT.RO (S.C. Exemplu S.R.L.)</Text>
            <Text style={styles.infoValue}>Reg. Com: J40/XXXX/20XX</Text>
            <Text style={styles.infoValue}>CUI: RO12345678</Text>
            <Text style={styles.infoValue}>Adresa: Str. Exemplu Nr. 1, București</Text>
            <Text style={styles.infoValue}>Email: contact@prynt.ro</Text>
            <Text style={styles.infoValue}>Tel: 0750.473.111</Text>
          </View>

          {/* BENEFICIAR */}
          <View style={[styles.infoColumn, styles.infoColumnActive]}>
            <Text style={styles.infoLabel}>BENEFICIAR:</Text>
            <Text style={styles.infoValueBold}>{clientName}</Text>
            <Text style={styles.infoValue}>{addressParts}</Text>
            {billing.cui && <Text style={styles.infoValue}>CUI: {billing.cui}</Text>}
            <Text style={styles.infoValue}>Email: {clientEmail}</Text>
            <Text style={styles.infoValue}>Telefon: {clientPhone}</Text>
          </View>
        </View>

        {/* TABEL PRODUSE */}
        <View style={styles.table}>
          {/* Header Tabel */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Denumire Produs / Serviciu</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Preț Unit.</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Valoare</Text>
          </View>

          {/* Rânduri Produse */}
          {items.map((item: any, index: number) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {item.name}
                {item.metadata?.details ? `\n(${item.metadata.details})` : ""}
              </Text>
              <Text style={[styles.tableCell, styles.col3]}>{item.qty}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(item.unit)}</Text>
              <Text style={[styles.tableCell, styles.col5]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* TOTALURI */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Transport:</Text>
              <Text style={styles.totalValue}>{formatCurrency(shippingCost)}</Text>
            </View>
            <View style={styles.totalRowFinal}>
              <Text style={styles.finalTotalLabel}>TOTAL DE PLATĂ:</Text>
              <Text style={styles.finalTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER & TERMS */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { marginBottom: 10 }]}>
            Termeni: Oferta este valabilă până la data de {validUntilDate.toLocaleDateString("ro-RO")}.
            Prețurile includ TVA (dacă este aplicabil).
          </Text>
          <Text style={[styles.footerText, { fontWeight: 'bold' }]}>Conturi Bancare:</Text>
          <Text style={styles.footerText}>Banca Transilvania: RO99 BTRL 0000 0000 0000 00XX (RON)</Text>
          <Text style={styles.footerText}>
            Vă mulțumim că ați ales <Text style={styles.footerBrand}>Prynt.ro</Text>!
          </Text>
          <Text style={styles.footerText}>www.prynt.ro | contact@prynt.ro | 0750.473.111</Text>
        </View>
      </Page>
    </Document>
  );
};

// --- 4. API HANDLER ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID-ul comenzii/ofertei lipsește." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true, // pentru date extra dacă e nevoie
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Comanda nu a fost găsită." }, { status: 404 });
    }

    // Render to Stream
    const stream = await renderToStream(<OfferDocument order={order} />);
    
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Oferta_Prynt_${order.orderNo}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Eroare la generarea PDF-ului." }, { status: 500 });
  }
}