// lib/landingData.ts
import { BANNER_SEO_DATA } from "./seo/bannerData"; // <--- IMPORT NOU

// Catalog data-driven pentru landing pages. Add / extend entries here.
export type LandingInfo = {
  key: string; 
  title: string; 
  shortDescription: string; 
  seoTitle?: string;
  seoDescription?: string;
  images?: string[]; 
  contentHtml?: string; 
  productRouteSlug?: string; 
  metadata?: Record<string, any>;
};

export type LandingGroup = Record<string, LandingInfo>;
export type LandingCatalog = Record<string, Record<string, LandingInfo | LandingGroup>>;

export const LANDING_CATALOG: LandingCatalog = {
  // Aici injectăm datele masive din fișierul separat
  bannere: BANNER_SEO_DATA as any, 

  // Păstrăm restul categoriilor (dacă vrei să le muți și pe ele, putem face fișiere separate)
  pliante: {
      materiale_rigide: {
        // ... păstrează conținutul existent pentru materiale rigide
        plexiglass: {
          key: "plexiglass",
          title: "Configurator Plexiglass — print și debitare la comandă",
          shortDescription: "Configurează plexiglass alb, grosimi variate, print UV.",
          seoTitle: "Plexiglass alb | print UV & debitare | Prynt",
          seoDescription: "Comandă plexiglass alb, grosimi 2–5 mm, print UV.",
          images: ["/images/landing/plexiglass-1.jpg"],
          productRouteSlug: "plexiglass",
          contentHtml: `<h2>Plexiglass alb — configurare rapidă</h2><p>Livrare rapidă, preț instant.</p>`
        },
        // ... restul materialelor
      },
      // ... păstrează frizerie, vulcanizare etc. dacă existau aici
  },
  
  autocolante: {
      // Putem face la fel și pentru autocolante în viitor (lib/seo/autocolanteData.ts)
      auto: {
          key: "auto",
          title: "Autocolante Auto - Branding Flote",
          shortDescription: "Colantare auto cu autocolant polimeric.",
          seoTitle: "Autocolante Auto | Branding Masini | Prynt",
          images: ["/products/autocolante/1.webp"],
          contentHtml: "<h2>Reclama ta în mișcare</h2>"
      }
  },
  // ... restul categoriilor
};

// ... restul funcțiilor helper (listAllLandingRoutes, getLandingInfo) rămân neschimbate
export function listAllLandingRoutes() {
  const out: { category: string; slug: string }[] = [];
  Object.keys(LANDING_CATALOG).forEach((category) => {
    const entries = LANDING_CATALOG[category];
    Object.keys(entries).forEach((key) => {
      const val = entries[key];
      if (val && typeof val === 'object' && 'key' in val) {
        const slugNormalized = String(key).replace(/_/g, '-');
        out.push({ category, slug: slugNormalized });
        return;
      }
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

export function getLandingInfo(category: string, slug: string) {
  const cat = (LANDING_CATALOG as any)[category];
  if (!cat) return undefined;
  const tryKeys = [slug, slug.replace(/-/g, '_'), slug.replace(/_/g, '-')];
  for (const k of tryKeys) {
    const direct = (cat as Record<string, any>)[k];
    if (direct && typeof direct === 'object' && 'key' in direct) return direct as LandingInfo;
  }
  for (const k of Object.keys(cat)) {
    const v = (cat as any)[k];
    if (v && typeof v === 'object' && !( 'key' in v)) {
      const childKeys = [slug, slug.replace(/-/g, '_'), slug.replace(/_/g, '-')];
      for (const ck of childKeys) {
        if ((v as LandingGroup)[ck]) return (v as LandingGroup)[ck];
      }
    }
  }
  return undefined;
}