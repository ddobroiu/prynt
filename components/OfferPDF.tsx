import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

// Styles will be created inside the component so we can conditionally set `fontFamily`
// depending on whether font registration succeeded.

const formatPrice = (val: number) => 
  new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' RON';

export const OfferPDF = ({ items, shipping }: { items: any[], shipping: number }) => {
  // Try to register local fonts (preferred). If not found, fall back to remote registration.
  let fontRegistered = false;
  try {
    const fontsDir = path.resolve(process.cwd(), 'public', 'fonts');
    const regular = path.join(fontsDir, 'Roboto-Regular.ttf');
    const bold = path.join(fontsDir, 'Roboto-Bold.ttf');

    if (fs.existsSync(regular) && fs.existsSync(bold)) {
      Font.register({
        family: 'Roboto',
        fonts: [
          { src: regular, fontWeight: 'normal' },
          { src: bold, fontWeight: 'bold' },
        ],
      });
      fontRegistered = true;
    } else {
      try {
        // Best-effort remote registration (may fail in some envs).
        Font.register({
          family: 'Roboto',
          fonts: [
            { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf', fontWeight: 'normal' },
            { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.ttf', fontWeight: 'bold' },
          ],
        });
        fontRegistered = true;
      } catch (err) {
        // If remote registration fails, we'll continue without custom fonts.
        console.error('OfferPDF: remote font registration failed', err);
        fontRegistered = false;
      }
    }
  } catch (err) {
    console.error('OfferPDF: font registration check failed', err);
    fontRegistered = false;
  }

  const styles = StyleSheet.create({
    page: {
      ...(fontRegistered ? { fontFamily: 'Roboto' } : {}),
      fontSize: 10,
      padding: 0,
      color: '#111827',
      lineHeight: 1.4,
    },
    headerBg: {
      backgroundColor: '#4F46E5',
      height: 100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    headerSub: {
      color: '#E0E7FF',
      fontSize: 10,
    },
    companyInfo: {
      color: 'white',
      fontSize: 9,
      alignItems: 'flex-end',
    },
    section: {
      marginHorizontal: 40,
      marginTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 8,
      color: '#6B7280',
      marginBottom: 4,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    value: {
      fontSize: 10,
      marginBottom: 2,
    },
    valueBold: {
      fontWeight: 'bold',
      color: '#4F46E5',
    },
    table: {
      marginTop: 30,
      marginHorizontal: 40,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F3F4F6',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    colProd: { width: '50%', fontSize: 9, fontWeight: 'bold', color: '#374151' },
    colQty: { width: '10%', fontSize: 9, fontWeight: 'bold', color: '#374151', textAlign: 'center' },
    colPrice: { width: '20%', fontSize: 9, fontWeight: 'bold', color: '#374151', textAlign: 'right' },
    colTotal: { width: '20%', fontSize: 9, fontWeight: 'bold', color: '#374151', textAlign: 'right' },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    prodTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
    prodDetail: { fontSize: 9, color: '#6B7280', marginBottom: 1 },
    totals: {
      marginTop: 20,
      marginRight: 40,
      alignItems: 'flex-end',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      marginBottom: 5,
    },
    grandTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 2,
      borderTopColor: '#4F46E5',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      paddingTop: 10,
    },
    footerText: {
      fontSize: 8,
      color: '#9CA3AF',
    },
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shipping;
  const today = new Date().toLocaleDateString('ro-RO');
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* 1. HEADER */}
        <View style={styles.headerBg}>
          <View>
            <Text style={styles.headerTitle}>PRYNT.RO</Text>
            <Text style={styles.headerSub}>Tipografie Online & Large Format</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>OFERTĂ DE PREȚ</Text>
            <Text>#{Date.now().toString().slice(-6)}</Text>
          </View>
        </View>

        {/* 2. INFO */}
        <View style={styles.section}>
          <View>
            <Text style={styles.label}>FURNIZOR</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>SC PRYNT SRL</Text>
            <Text style={styles.value}>Email: contact@prynt.ro</Text>
            <Text style={styles.value}>Tel: 0750.259.955</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>VALABILITATE</Text>
            <Text style={styles.value}>Data: {today}</Text>
            <Text style={styles.value}>Expiră: <Text style={styles.valueBold}>{expiry.toLocaleDateString('ro-RO')}</Text></Text>
          </View>
        </View>

        {/* 3. TABEL */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colProd}>PRODUS / DETALII</Text>
            <Text style={styles.colQty}>CANT.</Text>
            <Text style={styles.colPrice}>PREȚ UNIT</Text>
            <Text style={styles.colTotal}>TOTAL</Text>
          </View>

          {items.map((item, i) => {
            const meta = item.metadata || {};
            const details = [];
            
            // Construire detalii
            if (meta.details) details.push(meta.details);
            if (meta.width_cm || meta.width) details.push(`Dimensiuni: ${meta.width_cm || meta.width} x ${meta.height_cm || meta.height} cm`);
            
            // Material
            let mat = meta.material || meta.materialId;
            if (mat) {
                let s = String(mat);
                if(s.includes('frontlit_510')) s = "Frontlit 510g (Premium)";
                if(s.includes('frontlit_440')) s = "Frontlit 440g (Standard)";
                details.push(s);
            }
            
            // Finisaje
            if (meta.want_hem_and_grommets === true) details.push("Finisaje: Tiv și Capse");
            if (meta.want_wind_holes === true) details.push("Găuri de vânt: Da");
            if (item.textDesign) details.push(`Text: "${item.textDesign}"`);

            return (
              <View key={i} style={styles.row} wrap={false}>
                <View style={styles.colProd}>
                  <Text style={styles.prodTitle}>{item.title || item.name}</Text>
                  {details.map((d, idx) => (
                    <Text key={idx} style={styles.prodDetail}>• {d}</Text>
                  ))}
                </View>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{formatPrice(item.price || item.unitAmount)}</Text>
                <Text style={styles.colTotal}>{formatPrice((item.price || item.unitAmount) * item.quantity)}</Text>
              </View>
            );
          })}
        </View>

        {/* 4. TOTALURI */}
        <View style={styles.totals} wrap={false}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Livrare:</Text>
            <Text style={{ fontWeight: 'bold' }}>{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#4F46E5' }}>TOTAL:</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4F46E5' }}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* 5. FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Prețurile includ TVA. Ofertă valabilă 30 de zile.</Text>
          <Text style={styles.footerText}>Vă mulțumim! Contact: contact@prynt.ro | 0750.259.955</Text>
        </View>

      </Page>
    </Document>
  );
};