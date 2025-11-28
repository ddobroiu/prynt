// lib/landingData.ts
// Catalog data-driven pentru landing pages.
// Acesta centralizează toate datele SEO din modulele specifice.

import { BANNER_SEO_DATA } from "./seo/bannerData";
import { AUTOCOLANTE_SEO_DATA } from "./seo/autocolanteData";
import { AFISE_SEO_DATA } from "./seo/afiseData";
import { CANVAS_SEO_DATA } from "./seo/canvasData";
import { PLIANTE_SEO_DATA } from "./seo/plianteData";
import { TAPET_SEO_DATA } from "./seo/tapetData";
import { 
  PVC_FOREX_DATA, 
  PLEXIGLASS_DATA, 
  ALUCOBOND_DATA, 
  POLIPROPILENA_DATA, 
  CARTON_DATA 
} from "./seo/materialeRigideData";
import { BANNER_VERSO_DATA } from "./seo/bannerVersoData";
import { FONDURI_DATA } from "./seo/fonduriData";

// --- TIPURI ---
export type LandingInfo = {
  key: string; // keyword (ex: 'frizerie', 'vulcanizare')
  title: string; // H1
  shortDescription: string; // visible short intro
  seoTitle?: string;
  seoDescription?: string;
  images?: string[]; // paths under /public
  contentHtml?: string; // rich server-rendered HTML (SEO)
  productRouteSlug?: string; // optional link to PRODUCTS routeSlug (dacă diferă de cheia categoriei)
  metadata?: Record<string, unknown>;
};


// Allow either a direct LandingInfo or a grouped map of LandingInfo entries
export type LandingGroup = Record<string, LandingInfo>;
export type LandingCatalog = Record<string, Record<string, LandingInfo | LandingGroup>>;

// --- CATALOGUL PRINCIPAL ---
export const LANDING_CATALOG: LandingCatalog = {
  // 1. Bannere
  bannere: BANNER_SEO_DATA as unknown as LandingCatalog[string],

  // 2. Autocolante
  autocolante: AUTOCOLANTE_SEO_DATA as unknown as LandingCatalog[string],

  // 3. Afișe
  afise: AFISE_SEO_DATA as unknown as LandingCatalog[string],

  // 4. Canvas
  canvas: CANVAS_SEO_DATA as unknown as LandingCatalog[string],

  // 5. Pliante & Flyere
  pliante: PLIANTE_SEO_DATA as unknown as LandingCatalog[string],
  flayere: PLIANTE_SEO_DATA as unknown as LandingCatalog[string], // Alias: folosim aceleași date și pentru /flayere/...

  // 6. Tapet
  tapet: TAPET_SEO_DATA as unknown as LandingCatalog[string],

  // 7. Materiale Rigide
  "materiale": {
    "pvc-forex": PVC_FOREX_DATA,
    "plexiglass": PLEXIGLASS_DATA,
    "alucobond": ALUCOBOND_DATA,
    "polipropilena": POLIPROPILENA_DATA,
    "carton": CARTON_DATA,
  } as unknown as LandingCatalog[string],
  
  "pvc-forex": PVC_FOREX_DATA as unknown as LandingCatalog[string],
  "pvc_forex": PVC_FOREX_DATA as unknown as LandingCatalog[string], // Alias pentru consistență
  
  "plexiglass": PLEXIGLASS_DATA as unknown as LandingCatalog[string],
  
  "alucobond": ALUCOBOND_DATA as unknown as LandingCatalog[string],
  "bond": ALUCOBOND_DATA as unknown as LandingCatalog[string], // Alias comun
  
  "polipropilena": POLIPROPILENA_DATA as unknown as LandingCatalog[string],
  
  "carton": CARTON_DATA as unknown as LandingCatalog[string],

  // 8. Banner Față-Verso
  "banner-verso": BANNER_VERSO_DATA as unknown as LandingCatalog[string],

  // 9. Proiecte Fonduri (Mapăm toate categoriile URL la același set de date)
  "fonduri-pnrr": FONDURI_DATA as unknown as LandingCatalog[string],
  "fonduri-nationale": FONDURI_DATA as unknown as LandingCatalog[string],
  "fonduri-regio": FONDURI_DATA as unknown as LandingCatalog[string],
  "fonduri": FONDURI_DATA as unknown as LandingCatalog[string], // Categorie generică
};

// --- HELPER FUNCTIONS ---

// Helper: list all landing routes for generateStaticParams
// Exclude duplicate/alias categories to avoid duplicate content penalties
export function listAllLandingRoutes() {
  const out: { category: string; slug: string }[] = [];
  
  // Categories to exclude (aliases that duplicate content)
  const excludedCategories = new Set([
    'flayere',          // Duplicate of 'pliante'
    'pvc_forex',        // Duplicate of 'pvc-forex' 
    'bond',             // Duplicate of 'alucobond'
    'fonduri',          // Duplicate of 'fonduri-pnrr'
    'fonduri-nationale', // Duplicate of 'fonduri-pnrr'
    'fonduri-regio',    // Duplicate of 'fonduri-pnrr'
    'pvc-forex',        // Use only materiale/pvc-forex
    'plexiglass',       // Use only materiale/plexiglass
    'alucobond',        // Use only materiale/alucobond
    'polipropilena',    // Use only materiale/polipropilena
    'carton',           // Use only materiale/carton
  ]);
  
  Object.keys(LANDING_CATALOG).forEach((category) => {
    // Skip excluded categories
    if (excludedCategories.has(category)) return;
    
    const entries = LANDING_CATALOG[category];
    Object.keys(entries).forEach((key) => {
      const val = entries[key];
      // If the value looks like a LandingInfo (has .key), push it directly
      if (val && typeof val === 'object' && 'key' in val) {
        // normalize slug: prefer hyphenated form for URLs
        const slugNormalized = String(key).replace(/_/g, '-');
        out.push({ category, slug: slugNormalized });
        return;
      }
      // Otherwise assume it's a grouped map and iterate its children
      if (val && typeof val === 'object') {
        Object.keys(val as LandingGroup).forEach((childSlug) => {
          const slugNormalized = String(childSlug).replace(/_/g, '-');
          out.push({ category, slug: slugNormalized });
        });
      }
    });
  });
  return out;
}

// Find a LandingInfo by category + slug, supporting grouped maps one level deep
export function getLandingInfo(category: string, slug: string) {
  const cat = LANDING_CATALOG[category];
  if (!cat) return undefined;

  // try direct match, then underscore/hyphen variants
  const tryKeys = [slug, slug.replace(/-/g, '_'), slug.replace(/_/g, '-')];
  for (const k of tryKeys) {
    const direct = cat[k];
    if (direct && typeof direct === 'object' && 'key' in direct) return direct as LandingInfo;
  }

  // search nested groups
  for (const k of Object.keys(cat)) {
    const v = cat[k];
    if (v && typeof v === 'object' && !('key' in v)) {
      // try child variants too
      const childKeys = [slug, slug.replace(/-/g, '_'), slug.replace(/_/g, '-')];
      for (const ck of childKeys) {
        if ((v as LandingGroup)[ck]) return (v as LandingGroup)[ck];
      }
    }
  }
  return undefined;
}