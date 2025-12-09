// Shared constants for web and mobile

export const MATERIAL_OPTIONS = [
  { 
    id: "frontlit-440", 
    key: "frontlit-440", 
    name: "Frontlit 440 g/mp (standard)", 
    label: "Frontlit 440 g/mp (standard)", 
    description: "Material rezistent pentru exterior", 
    priceModifier: 0, 
    recommendedFor: ["bannere"] 
  },
  { 
    id: "frontlit-510", 
    key: "frontlit-510", 
    name: "Frontlit 510 g/mp (durabil)", 
    label: "Frontlit 510 g/mp (durabil)", 
    description: "Mai gros, pentru expuneri îndelungate", 
    priceModifier: 0.1, 
    recommendedFor: ["bannere"] 
  },
  { 
    id: "couche-150", 
    key: "couche-150", 
    name: "Hârtie couché 150 g/mp", 
    label: "Hârtie couché 150 g/mp", 
    description: "Hârtie pentru afișe/interior și pliante", 
    priceModifier: 0, 
    recommendedFor: ["afise", "pliante"] 
  },
  { 
    id: "couche-170", 
    key: "couche-170", 
    name: "Hârtie couché 170 g/mp", 
    label: "Hârtie couché 170 g/mp", 
    description: "Hârtie premium pentru pliante/catalog", 
    priceModifier: 0.12, 
    recommendedFor: ["pliante"] 
  },
  { 
    id: "pp-5mm", 
    key: "pp-5mm", 
    name: "PVC 5mm", 
    label: "PVC 5mm", 
    description: "Material rigid pentru indoor/outdoor", 
    priceModifier: 0.15, 
    recommendedFor: ["decor", "materiale-rigide"] 
  },
];

export const CONFIGURATOR_FIRST_IMAGES: Record<string, string> = {
  'banner': '/products/banner/banner-1.webp',
  'bannere': '/products/banner/banner-1.webp',
  'banner-verso': '/products/banner/verso/banner-verso-1.webp',
  'afise': '/products/afise/afise-1.webp',
  'autocolante': '/products/autocolante/autocolante-1.webp',
  'canvas': '/products/canvas/canvas-1.webp',
  'tapet': '/products/tapet/tapet-1.webp',
  'rollup': '/products/rollup/rollup-1.webp',
  'window-graphics': '/products/window-graphics/window-graphics-1.webp',
  'pliante': '/products/pliante/pliante-1.webp',
  'flayere': '/products/flayere/flayere-1.webp',
  'plexiglass': '/products/materiale/plexiglass/plexiglass-1.webp',
  'pvc-forex': '/products/materiale/pvc-forex/pvc-forex-1.webp',
  'alucobond': '/products/materiale/alucobond/alucobond-1.webp',
  'carton': '/products/materiale/carton/carton-1.webp',
  'polipropilena': '/products/materiale/polipropilena/polipropilena-1.webp',
};

export const BUTTON_STYLES = {
  whatsapp: {
    gradient: 'from-green-600 to-emerald-600',
    text: 'Comandă pe WhatsApp',
    icon: '💬'
  },
  quote: {
    gradient: 'from-slate-600 to-slate-700',
    text: 'Cerere Ofertă',
    icon: '📧'
  },
  cta: {
    gradient: 'from-indigo-600 to-indigo-700',
    text: 'Adaugă în Coș',
    fullWidth: true,
    size: 'lg'
  }
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.prynt.ro/api';
