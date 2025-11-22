import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

// Styles will be created inside the component so we can conditionally set `fontFamily`
// depending on whether font registration succeeded.

const formatPrice = (val: number) => {
  const num = Number(val ?? 0);
  if (!isFinite(num)) return '0,00 RON';
  return new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' RON';
};

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
      // Do NOT attempt remote font registration to avoid Unknown font format errors
      // in environments where remote font fetch returns unexpected content.
      console.warn('OfferPDF: local Roboto fonts not found in public/fonts; continuing with default fonts');
      fontRegistered = false;
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
      minHeight: 120,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 40,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      marginBottom: 6,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: 1.1,
    },
    headerSub: {
      color: '#E0E7FF',
      fontSize: 10,
      marginTop: 2,
    },
    companyInfo: {
      color: 'white',
      fontSize: 9,
      alignItems: 'flex-end',
      paddingTop: 6,
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

  // Normalize item numbers safely (price could be in `price`, `unitAmount`, or be a Decimal/string)
  const subtotal = items.reduce((acc, item) => {
    const unit = Number(item?.price ?? item?.unitAmount ?? item?.unit_amount ?? 0);
    const qty = Number(item?.quantity ?? item?.qty ?? 0);
    const line = (isFinite(unit) ? unit : 0) * (isFinite(qty) ? qty : 0);
    return acc + line;
  }, 0);
  const total = (isFinite(subtotal) ? subtotal : 0) + (isFinite(Number(shipping)) ? Number(shipping) : 0);
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
            <Text style={[styles.value, { fontWeight: 'bold' }]}>CULOAREA DIN VIATA SA SRL</Text>
            <Text style={styles.value}>CUI: 44820819 · Nr. Reg. Com.: J2021001108100</Text>
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
                    // Combine metadata with top-level item fields so configurators
                    // that set width/height or other props directly on the item
                    // are also discoverable by the `findFirst` helper.
                    const meta = {
                      ...(item?.metadata || {}),
                      ...(typeof item === 'object' && item ? item : {}),
                    } as Record<string, any>;
                    const details: string[] = [];

                    // Helper pentru extragerea unei chei dintr-o listă de sinonime
                    const findFirst = (...keys: (string | undefined)[]) => {
                      for (const k of keys) {
                        if (!k) continue;
                        if (Object.prototype.hasOwnProperty.call(meta, k) && meta[k] !== undefined && meta[k] !== null && String(meta[k]).trim() !== '') return meta[k];
                      }
                      return undefined;
                    };

                    // Push if value exists
                    const pushIf = (label: string, ...keys: string[]) => {
                      const v = findFirst(...keys);
                      if (v === undefined) return false;
                      details.push(`${label}: ${String(v)}`);
                      return true;
                    };

                    // 1) free-form details / description
                    if (findFirst('details', 'description', 'detalii')) details.push(String(findFirst('details', 'description', 'detalii')));

                    // 2) Dimensiuni: prefer width/height numeric pair, altfel size field
                    const w = findFirst('width_cm', 'width');
                    const h = findFirst('height_cm', 'height');
                    if (w !== undefined || h !== undefined) {
                      details.push(`Dimensiuni: ${w ?? '0'} x ${h ?? '0'} cm`);
                    } else {
                      pushIf('Dimensiune', 'Dimensiune', 'dimensiune', 'size', 'format');
                    }

                    // 3) Față-verso / two-sided
                    const twoSided = findFirst('Față-verso', 'Fata-verso', 'față-verso', 'fata-verso', 'twoSided', 'two_sided', 'face', 'faces');
                    if (twoSided !== undefined) {
                      const tv = String(twoSided).toLowerCase();
                      const yes = ['da', 'true', '1', 'yes'].includes(tv);
                      const no = ['nu', 'false', '0', 'no'].includes(tv);
                      details.push(`Față-verso: ${yes ? 'Da' : (no ? 'Nu' : String(twoSided))}`);
                    }

                    // 4) Tip împăturire / folding
                    pushIf('Tip Împăturire', 'impaturire', 'tip_impaturire', 'fold', 'folding', 'Tip Împăturire', 'Tip Impaturire');

                    // 5) Hârtie / paper
                    const paperVal = findFirst('hartie', 'hârtie', 'paper', 'paper_gsm', 'gramaj', 'Hârtie', 'HARTIE');
                    if (paperVal !== undefined) {
                      const p = String(paperVal);
                      const n = Number(p.replace(/[^0-9.,]/g, '').replace(',', '.'));
                      if (isFinite(n) && n > 0 && (/^\d+(?:[.,]\d+)?$/).test(p)) details.push(`Hârtie: ${n} g/mp`);
                      else details.push(`Hârtie: ${p}`);
                    }

                    // 6) Grafică
                    pushIf('Grafică', 'grafica', 'grafic', 'graphic', 'graphics', 'Grafică', 'Grafica');

                    // 7) Suprafață / finisaj (tapet, canvas, etc.)
                    pushIf('Suprafață', 'Suprafață', 'Suprafata', 'Suprafața', 'Suprafata', 'Suprafață');
                    pushIf('Finisaj', 'Finisaj', 'Finisaje', 'Finisaj', 'Finisaje');

                    // 8) Design option / misc flags
                    const designOpt = findFirst('designOption', 'design_option', 'design', 'designOpt');
                    if (designOpt !== undefined) details.push(`Opțiune grafică: ${String(designOpt)}`);
                    if (meta.laminated === true || meta.laminare === true) details.push('Laminare: Da');
                    if (meta.shape_diecut === true || meta.shape_diecut === 'true' || meta.shape_diecut === 1) details.push('Die-cut: Da');
                    if (meta.want_adhesive === true || meta.want_adhesive === 'true') details.push('Auto-adeziv: Da');

                    // 9) Margine / edge (canvas)
                    pushIf('Margine', 'Margine', 'edge', 'edge_type', 'edgeType');

                    // 10) Material
                    const material = findFirst('material', 'materialId', 'material_id', 'material_name');
                    if (material !== undefined) {
                      let s = String(material);
                      if (s.includes('frontlit_510')) s = 'Frontlit 510g (Premium)';
                      if (s.includes('frontlit_440')) s = 'Frontlit 440g (Standard)';
                      details.push(s);
                    }

                    // 8) Finisaje / other boolean flags
                    if (meta.want_hem_and_grommets === true || meta.tiv === true || meta.tiv_capse === true) details.push('Finisaje: Tiv și Capse');
                    if (meta.want_wind_holes === true || meta.wind_holes === true) details.push('Găuri de vânt: Da');
                    if (findFirst('textDesign', 'text_design', 'text')) details.push(`Text: ${String(findFirst('textDesign', 'text_design', 'text'))}`);
                    if (findFirst('Cost grafică', 'Cost grafica', 'cost_grafica', 'CostGrafica')) details.push(`Cost grafică: ${String(findFirst('Cost grafică', 'Cost grafica', 'cost_grafica', 'CostGrafica'))}`);

                    const unit = Number(item?.price ?? item?.unitAmount ?? item?.unit_amount ?? 0);
                    const qty = Number(item?.quantity ?? item?.qty ?? 0);
                    const lineTotal = (isFinite(unit) ? unit : 0) * (isFinite(qty) ? qty : 0);

                    return (
                      <View key={i} style={styles.row} wrap={false}>
                        <View style={styles.colProd}>
                          <Text style={styles.prodTitle}>{item.title || item.name}</Text>
                          {details.map((d, idx) => (
                            <Text key={idx} style={styles.prodDetail}>• {d}</Text>
                          ))}
                        </View>
                        <Text style={styles.colQty}>{isFinite(qty) ? String(qty) : '0'}</Text>
                        <Text style={styles.colPrice}>{formatPrice(unit)}</Text>
                        <Text style={styles.colTotal}>{formatPrice(lineTotal)}</Text>
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