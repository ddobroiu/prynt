// lib/landingData.ts
export type LandingInfo = {
  key: string;             // ex: "frizerie", "vulcanizare"
  title: string;           // page H1 / product title
  shortDescription: string;// short visible description
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];       // paths under /public
  contentHtml?: string;    // rich SEO HTML (server-rendered, shown under "Citește mai mult")
  productRouteSlug?: string;// optional: routeSlug to match an internal product if needed
  metadata?: Record<string, any>;
};

export type LandingCatalog = Record<string, Record<string, LandingInfo>>;
// category -> keyword -> LandingInfo
export const LANDING_CATALOG: LandingCatalog = {
  pliante: {
    frizerie: {
      key: "frizerie",
      title: "Pliante pentru frizerii — modele, prețuri și configurator",
      shortDescription: "Pliante pentru saloane și frizerii — alege formatul, tirajul și finisajele. Configurează rapid.",
      seoTitle: "Pliante pentru frizerii — comandă online | Prynt",
      seoDescription: "Pliante personalizate pentru saloane: A5, A6, hârtie 115–170 g/mp. Configurator live pentru tiraj și finisaje.",
      images: ["/images/landing/pliante-frizerie-1.jpg"],
      contentHtml: `<h2>Pliante pentru frizerii</h2>
<p>Pliante optimizate pentru frizerii: oferte, pachete și cupoane. Formate A6/A5, hârtie 115-170 g/mp, imagini la 300 DPI...</p>`,
      productRouteSlug: "pliante-frizerie",
      metadata: { landing: true },
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Pliante pentru vulcanizări — promovare service auto",
      shortDescription: "Pliante și flyere pentru service auto: oferte sezoniere, schimb anvelope, verificări tehnice.",
      seoTitle: "Pliante pentru vulcanizări — tipărire rapidă | Prynt",
      seoDescription: "Pliante pentru vulcanizări: A5/A6, hârtie recomandată, livrare rapidă. Configurator pentru tiraj și finisaje.",
      images: ["/images/landing/pliante-vulcanizare-1.jpg"],
      contentHtml: `<h2>Pliante pentru vulcanizări</h2><p>Text SEO pentru vulcanizare...</p>`,
      productRouteSlug: "pliante-vulcanizare",
      metadata: { landing: true },
    },
    "fast-food": {
      key: "fast-food",
      title: "Pliante pentru fast food — meniuri și promoții",
      shortDescription: "Pliante promoționale pentru restaurante fast-food: meniuri, oferte și cupoane.",
      seoTitle: "Pliante fast food — tipărire meniuri & promoții | Prynt",
      seoDescription: "Pliante și flyere pentru restaurante fast-food. Configurator pentru formate și tiraj.",
      images: ["/images/landing/pliante-fastfood-1.jpg"],
      contentHtml: `<h2>Pliante pentru Fast Food</h2><p>Text SEO pentru fast-food...</p>`,
      productRouteSlug: "pliante-fastfood",
      metadata: { landing: true },
    },
  },

  bannere: {
    frizerie: {
      key: "frizerie",
      title: "Bannere pentru frizerii — vizibilitate pentru salon",
      shortDescription: "Bannere rezistente pentru exterior și interior. Alege dimensiunea și materialul.",
      seoTitle: "Bannere frizerie — tiv & capse | Prynt",
      seoDescription: "Bannere personalizate pentru frizerii — configurator online pentru dimensiuni și finisaje.",
      images: ["/images/landing/banner-frizerie-1.jpg"],
      contentHtml: `<h2>Bannere pentru frizerii</h2><p>Text SEO bannere...</p>`,
      productRouteSlug: "banner-frizerie",
      metadata: { landing: true },
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Bannere pentru vulcanizări — semnalistică și promoții",
      shortDescription: "Bannere outdoor pentru service auto și vulcanizări — material durabil și finisaje profesionale.",
      seoTitle: "Bannere vulcanizare — tiv & capse | Prynt",
      seoDescription: "Bannere personalizate pentru vulcanizări — configurator pentru dimensiuni și materiale rezistente.",
      images: ["/images/landing/banner-vulcanizare-1.jpg"],
      contentHtml: `<h2>Bannere pentru vulcanizări</h2><p>Text SEO bannere vulcanizare...</p>`,
      productRouteSlug: "banner-vulcanizare",
      metadata: { landing: true },
    },
  },

  canvas: {
    frizerie: {
      key: "frizerie",
      title: "Canvas pentru frizerii — decor elegant pentru salon",
      shortDescription: "Canvas‑uri decorative pentru salon, print Fine Art pe pânză și montaj pe șasiu.",
      seoTitle: "Canvas pentru frizerii — print pe pânză | Prynt",
      seoDescription: "Canvas‑uri custom pentru saloane: decorați spațiul cu lucrări unice. Configurator pentru dimensiuni.",
      images: ["/images/landing/canvas-frizerie-1.jpg"],
      contentHtml: `<h2>Canvas pentru frizerii</h2><p>Text SEO canvas...</p>`,
      productRouteSlug: "canvas-frizerie",
      metadata: { landing: true },
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Canvas pentru service auto — branding în interior",
      shortDescription: "Canvas cu branding service pentru sala de așteptare și reception.",
      seoTitle: "Canvas service auto — print Fine Art | Prynt",
      seoDescription: "Canvas‑uri personalizate pentru service auto și vulcanizări — configurare și comandă online.",
      images: ["/images/landing/canvas-vulcanizare-1.jpg"],
      contentHtml: `<h2>Canvas pentru vulcanizări</h2><p>Text SEO canvas vulcanizare...</p>`,
      productRouteSlug: "canvas-vulcanizare",
      metadata: { landing: true },
    },
  },

  afise: {
    frizerie: {
      key: "frizerie",
      title: "Afișe pentru frizerii — A2/A1 pentru vizibilitate",
      shortDescription: "Afișe A2/A1 pentru interior/exterior; opțiuni de laminare și hârtie rezistentă.",
      seoTitle: "Afișe frizerie — imprimare A2/A1 | Prynt",
      seoDescription: "Afișe pentru frizerii: materiale recomandate și finisaje. Configurează direct.",
      images: ["/images/landing/afise-frizerie-1.jpg"],
      contentHtml: `<h2>Afișe pentru frizerii</h2><p>Text SEO afise...</p>`,
      productRouteSlug: "afise-frizerie",
      metadata: { landing: true },
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Afișe pentru vulcanizări — formate A2/A1",
      shortDescription: "Afișe pentru service auto, ideale pentru oferte și anunțuri locale.",
      seoTitle: "Afișe vulcanizare — imprimare | Prynt",
      seoDescription: "Afișe pentru vulcanizări: materiale rezistente și idei de layout.",
      images: ["/images/landing/afise-vulcanizare-1.jpg"],
      contentHtml: `<h2>Afișe pentru vulcanizări</h2><p>Text SEO afise vulcanizare...</p>`,
      productRouteSlug: "afise-vulcanizare",
      metadata: { landing: true },
    },
  },
};

export function listAllLandingRoutes() {
  // returns array of { category, slug } for generateStaticParams
  const out: { category: string; slug: string }[] = [];
  Object.keys(LANDING_CATALOG).forEach((category) => {
    Object.keys(LANDING_CATALOG[category]).forEach((slug) => {
      out.push({ category, slug });
    });
  });
  return out;
}