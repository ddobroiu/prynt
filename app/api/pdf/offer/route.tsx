import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from '@/lib/auth';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { Readable } from "stream";

export const runtime = 'nodejs';

// --- STILURI MODERNE ---
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "heavy",
    color: "#f97316",
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
  infoContainer: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  infoColumn: {
    width: "48%",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#cbd5e1",
  },
  infoColumnActive: {
    borderLeftColor: "#f97316",
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
    backgroundColor: "#1e293b",
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
  rowEven: { backgroundColor: "#ffffff" },
  rowOdd: { backgroundColor: "#f1f5f9" },
  col1: { width: "5%", textAlign: "center" },
  col2: { width: "55%", textAlign: "left" },
  col3: { width: "10%", textAlign: "center" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "15%", textAlign: "right" },
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
  totalLabel: { fontSize: 10, color: "#64748b" },
  totalValue: { fontSize: 10, fontWeight: "bold", color: "#1e293b" },
  finalTotalLabel: { fontSize: 12, fontWeight: "bold", color: "#1e293b" },
  finalTotalValue: { fontSize: 14, fontWeight: "bold", color: "#f97316" },
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
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " RON";
};

// --- COMPONENTA PDF ---
const OfferDocument = ({ order }: { order: any }) => {
  const createdDate = new Date(order.createdAt).toLocaleDateString("ro-RO");
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 30);

  // Extragere date din JSON (cu fallback)
  const billing: any = order.billing || {};
  const shipping: any = order.address || {};
  
  const clientName = billing.name || shipping.name || "Client";
  const clientPhone = billing.phone || shipping.phone || "-";
  const clientEmail = billing.email || shipping.email || "-";
  
  const addressParts = [
    billing.street,
    billing.city,
    billing.county
  ].filter(Boolean).join(", ");

  const items = order.items || [];
  const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0);
  const grandTotal = Number(order.total) || subtotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View><Text style={styles.logoText}>PRYNT.RO</Text></View>
          <View style={styles.offerTitleBlock}>
            <Text style={styles.offerTitle}>OFERTA DE PRET</Text>
            <Text style={styles.offerSubtitle}>Nr: #{order.orderNo} / Data: {createdDate}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>FURNIZOR:</Text>
            <Text style={styles.infoValueBold}>PRYNT.RO</Text>
            <Text style={styles.infoValue}>Email: contact@prynt.ro</Text>
            <Text style={styles.infoValue}>Tel: 0750.473.111</Text>
          </View>
          <View style={[styles.infoColumn, styles.infoColumnActive]}>
            <Text style={styles.infoLabel}>BENEFICIAR:</Text>
            <Text style={styles.infoValueBold}>{clientName}</Text>
            <Text style={styles.infoValue}>{addressParts}</Text>
            <Text style={styles.infoValue}>Email: {clientEmail}</Text>
            <Text style={styles.infoValue}>Telefon: {clientPhone}</Text>
          </View>
        </View>

        {/* Tabel */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Produs</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Pret Unit.</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Total</Text>
          </View>
          {items.map((item: any, index: number) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{item.qty}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(Number(item.unit))}</Text>
              <Text style={[styles.tableCell, styles.col5]}>{formatCurrency(Number(item.total))}</Text>
            </View>
          ))}
        </View>

        {/* Totaluri */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRowFinal}>
              <Text style={styles.finalTotalLabel}>TOTAL:</Text>
              <Text style={styles.finalTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Oferta valabila pana la {validUntilDate.toLocaleDateString("ro-RO")}.</Text>
          <Text style={styles.footerText}>Generat automat de asistentul Prynt.ro.</Text>
        </View>
      </Page>
    </Document>
  );
};

// --- API HANDLER (GET) ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lipsă ID comandă." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Comanda nu a fost găsită." }, { status: 404 });
    }

    // Render PDF (node stream) and convert to Web ReadableStream for NextResponse
    const nodeStream = await renderToStream(<OfferDocument order={order} />);
    const webStream = Readable.toWeb(nodeStream as any);

    return new NextResponse(webStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        // Force download while keeping PDF content identical
        "Content-Disposition": `attachment; filename="Oferta_Prynt_${order.orderNo}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Error:", error);
    return NextResponse.json({ error: "Eroare server." }, { status: 500 });
  }
}

// --- API HANDLER (POST) - generează PDF din payload (folosit de CartWidget) ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping } = body as any;

    // If user is logged in, try to prefill billing/shipping with session data
    const session = await getAuthSession();
    const sessionName = (session?.user as any)?.name;
    const sessionEmail = (session?.user as any)?.email;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items invalid or empty.' }, { status: 400 });
    }

    // Construim un obiect order temporar compatibil cu OfferDocument
    const now = new Date();
    const order = {
      id: `tmp_${now.getTime()}`,
      orderNo: `OF${now.getTime()}`,
      createdAt: now.toISOString(),
      billing: {
        name: sessionName || undefined,
        email: sessionEmail || undefined,
      },
      address: {
        name: sessionName || undefined,
        email: sessionEmail || undefined,
      },
      items: items.map((it: any, idx: number) => ({
        id: it.id || `i${idx}`,
        name: it.name || it.title || 'Produs',
        qty: Number(it.quantity || it.qty || 1),
        unit: Number(it.unitAmount || it.unit || it.price || 0),
        total: Number(it.totalAmount || it.total || (it.unitAmount || it.unit || it.price || 0) * (it.quantity || it.qty || 1)),
      })),
      total: items.reduce((acc: number, it: any) => acc + (Number(it.totalAmount || it.total || ((it.unitAmount || it.unit || it.price || 0) * (it.quantity || it.qty || 1))) || 0), 0) + (Number(shipping || 0) || 0),
    };

    // Render PDF and return as attachment
    const nodeStream = await renderToStream(<OfferDocument order={order} />);
    const webStream = Readable.toWeb(nodeStream as any);

    return new NextResponse(webStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="oferta-prynt-${new Date().toLocaleDateString('ro-RO')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF POST Error:', error);
    return NextResponse.json({ error: 'Eroare la generarea PDF-ului.' }, { status: 500 });
  }
}