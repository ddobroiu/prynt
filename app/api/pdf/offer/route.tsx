import { NextResponse } from 'next/server';
import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getAuthSession } from '@/lib/auth';

export const runtime = 'nodejs';

const styles = StyleSheet.create({
  page: { fontSize: 11, padding: 24, fontFamily: 'Helvetica' },
  header: { fontSize: 18, marginBottom: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 12, marginTop: 8, marginBottom: 4, fontWeight: 'bold' },
  text: { fontSize: 11, marginBottom: 2 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingVertical: 6 },
  colName: { width: '60%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '25%', textAlign: 'right' },
});

function OfferDocument({ name, items, shipping }: { name?: string; items: any[]; shipping: number }) {
  const subtotal = (items || []).reduce((s, it) => s + (Number(it.unitAmount || it.price || 0) * Number(it.quantity || 1)), 0);
  const total = subtotal + (Number(shipping) || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Ofertă de preț Prynt.ro</Text>

        <Text style={styles.sectionTitle}>Către:</Text>
        <Text style={styles.text}>{name || 'Client'}</Text>

        <Text style={styles.sectionTitle}>Detalii ofertă</Text>

        <View>
          {(items || []).map((it: any, idx: number) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colName}>{it.name}</Text>
              <Text style={styles.colQty}>{it.quantity}</Text>
              <Text style={styles.colPrice}>{(Number(it.unitAmount || it.price || 0)).toFixed(2)} RON</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.colName}>Subtotal</Text>
            <Text style={styles.colQty} />
            <Text style={styles.colPrice}>{subtotal.toFixed(2)} RON</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colName}>Cost livrare</Text>
            <Text style={styles.colQty} />
            <Text style={styles.colPrice}>{(Number(shipping) || 0).toFixed(2)} RON</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colName}>Total</Text>
            <Text style={styles.colQty} />
            <Text style={styles.colPrice}>{total.toFixed(2)} RON</Text>
          </View>
        </View>

        <Text style={{ marginTop: 12, fontSize: 10, color: '#666' }}>
          Această ofertă este valabilă 7 zile. Pentru confirmare, răspunde prin acest chat sau folosește link-ul din email.
        </Text>
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Items: [{ name, quantity, unitAmount }], shipping: number
    const items = Array.isArray(body.items) ? body.items : [];
    const shipping = typeof body.shipping === 'number' ? body.shipping : Number(body.shipping) || 0;

    // Try to get logged in user name via NextAuth
    let name: string | undefined = undefined;
    try {
      const session = await getAuthSession();
      if (session?.user?.name) name = session.user.name as string;
      else if (session?.user?.email) name = session.user.email as string;
    } catch (e) {
      // ignore
    }

    // If payload includes customer_details.name prefer it
    if (body.customer_details?.name) name = body.customer_details.name;

    const doc = <OfferDocument name={name} items={items} shipping={shipping} />;
    const buffer = await pdf(doc).toBuffer();

    return new NextResponse(buffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=oferta.pdf' } });
  } catch (e: any) {
    console.error('PDF Offer Error', e);
    return NextResponse.json({ ok: false, message: e?.message || 'Eroare generare PDF' }, { status: 500 });
  }
}
