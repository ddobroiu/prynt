// Simple, editable config for the Offer PDF. Adjust values to brand.
// You can safely tweak these without touching the generator logic.

export type RGB = [number, number, number];

export const pdfOfferConfig = {
  company: {
    name: 'CULOAREA DIN VIATA SA SRL',
    cui: '44820819',
    regCom: 'J2021001108100',
    addressLine: 'București, România',
    phone: '+40 7xx xxx xxx',
    email: 'contact@prynt.ro',
    website: 'www.prynt.ro',
  },
  // Path under /public, e.g. '/logo.png' or '/brand/logo.svg' (PNG/JPG recommended for jsPDF)
  logoPath: '/logo.png',
  // Optional A4 background letterhead (PNG/JPG). If provided, it will be drawn full-bleed.
  letterheadPath: '', // e.g. '/pdf/letterhead.png'
  // Try to load custom fonts from /public/fonts. If not present, falls back to Helvetica.
  fonts: {
    regular: '/fonts/Inter-Regular.ttf',
    bold: '/fonts/Inter-Bold.ttf',
    familyName: 'Inter', // how it will be registered inside jsPDF
  },
  layout: {
    margin: 40,
    // Brand colors
    primary: [67, 56, 202] as RGB, // indigo-700
    textMuted: [110, 110, 120] as RGB,
    panelBg: [248, 249, 251] as RGB,
    border: [220, 220, 225] as RGB,
  },
  notes: {
    validity: 'Oferta este valabilă 7 zile și nu reprezintă o factură fiscală.',
  },
};
