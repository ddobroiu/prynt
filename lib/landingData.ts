// lib/landingData.ts
// Catalog data-driven pentru landing pages. Add / extend entries here.
// category -> keyword -> LandingInfo
export type LandingInfo = {
  key: string; // keyword (ex: 'frizerie', 'vulcanizare')
  title: string; // H1
  shortDescription: string; // visible short intro
  seoTitle?: string;
  seoDescription?: string;
  images?: string[]; // paths under /public
  contentHtml?: string; // rich server-rendered HTML (SEO)
  productRouteSlug?: string; // optional link to PRODUCTS routeSlug
  metadata?: Record<string, any>;
};

// Allow either a direct LandingInfo or a grouped map of LandingInfo entries
export type LandingGroup = Record<string, LandingInfo>;
export type LandingCatalog = Record<string, Record<string, LandingInfo | LandingGroup>>;

export const LANDING_CATALOG: LandingCatalog = {
  pliante: {
      materiale_rigide: {
        plexiglass: {
          key: "plexiglass",
          title: "Configurator Plexiglass — print și debitare la comandă",
          shortDescription: "Configurează plexiglass alb, grosimi variate, print UV și debitare la dimensiuni personalizate.",
          seoTitle: "Plexiglass alb | print UV & debitare | Prynt",
          seoDescription: "Comandă plexiglass alb, grosimi 2–5 mm, print UV, debitare la dimensiuni personalizate. Preț instant în configurator.",
          images: ["/images/landing/plexiglass-1.jpg"],
          productRouteSlug: "plexiglass",
          contentHtml: `<h2>Plexiglass alb — configurare rapidă</h2><p>Alege grosimea, dimensiunea și opțiunile de print/debitare direct din configurator. Livrare rapidă, preț instant.</p>`
        },
        alucobond: {
          key: "alucobond",
          title: "Configurator Alucobond — panouri compozite la comandă",
          shortDescription: "Configurează panouri Alucobond (Visual Bond PE/PVDF), grosimi și dimensiuni personalizate, prelucrare la cerere.",
          seoTitle: "Alucobond | panouri compozite | Prynt",
          seoDescription: "Comandă panouri Alucobond, grosimi 3–4 mm, prelucrare la cerere, print UV. Preț instant în configurator.",
          images: ["/images/landing/alucobond-1.jpg"],
          productRouteSlug: "alucobond",
          contentHtml: `<h2>Alucobond — configurare și prelucrare</h2><p>Panouri compozite pentru exterior/interior, prelucrare la cerere (găurire, decupare). Configurează rapid și vezi prețul instant.</p>`
        },
        pvc_forex: {
          key: "pvc_forex",
          title: "Configurator PVC Forex — print și debitare la comandă",
          shortDescription: "Configurează PVC Forex alb, grosimi variate, print UV și debitare la dimensiuni personalizate.",
          seoTitle: "PVC Forex alb | print UV & debitare | Prynt",
          seoDescription: "Comandă PVC Forex alb, grosimi 2–10 mm, print UV, debitare la dimensiuni personalizate. Preț instant în configurator.",
          images: ["/images/landing/pvc-forex-1.jpg"],
          productRouteSlug: "pvc-forex",
          contentHtml: `<h2>PVC Forex alb — configurare rapidă</h2><p>Alege grosimea, dimensiunea și opțiunile de print/debitare direct din configurator. Livrare rapidă, preț instant.</p>`
        },
        polipropilena: {
          key: "polipropilena",
          title: "Configurator Polipropilenă — print și debitare la comandă",
          shortDescription: "Configurează polipropilenă albă, grosimi variate, print UV și debitare la dimensiuni personalizate.",
          seoTitle: "Polipropilenă albă | print UV & debitare | Prynt",
          seoDescription: "Comandă polipropilenă albă, grosimi 2–5 mm, print UV, debitare la dimensiuni personalizate. Preț instant în configurator.",
          images: ["/images/landing/polipropilena-1.jpg"],
          productRouteSlug: "polipropilena",
          contentHtml: `<h2>Polipropilenă albă — configurare rapidă</h2><p>Alege grosimea, dimensiunea și opțiunile de print/debitare direct din configurator. Livrare rapidă, preț instant.</p>`
        },
        carton: {
          key: "carton",
          title: "Configurator Carton — print și debitare la comandă",
          shortDescription: "Configurează carton alb, grosimi variate, print UV și debitare la dimensiuni personalizate.",
          seoTitle: "Carton alb | print UV & debitare | Prynt",
          seoDescription: "Comandă carton alb, grosimi 1–3 mm, print UV, debitare la dimensiuni personalizate. Preț instant în configurator.",
          images: ["/images/landing/carton-1.jpg"],
          productRouteSlug: "carton",
          contentHtml: `<h2>Carton alb — configurare rapidă</h2><p>Alege grosimea, dimensiunea și opțiunile de print/debitare direct din configurator. Livrare rapidă, preț instant.</p>`
        },
      },
    frizerie: {
      key: "frizerie",
      title: "Pliante pentru frizerii — modele, prețuri și configurator",
      shortDescription:
        "Pliante profesionale pentru saloane de frizerie: modele gata făcute, tiraje flexibile și configurator live pentru preț instant.",
      seoTitle: "Pliante pentru frizerii | tipărire rapidă & configurator | Prynt",
      seoDescription:
        "Comandă pliante pentru frizerii A5/A6, hârtie 115–170 g/mp. Configurează tirajul și finisajele în configuratorul nostru și primești preț instant.",
      images: ["/images/landing/pliante-frizerie-1.jpg"],
      productRouteSlug: "pliante-frizerie",
      contentHtml: `
<h2>Pliante pentru frizerii — atrage clienți local</h2>
<p>Pliantele rămân unul dintre cele mai eficiente instrumente de marketing pentru frizerii care vor să atragă clienți noi și să anunțe oferte. La Prynt oferim soluții complete: design optimizat, tipărire profesională și livrare rapidă.</p>

<h3>Beneficii</h3>
<ul>
  <li>Mesaj clar și Call-To-Action (programări, oferte) pentru conversii rapide</li>
  <li>Tiraje flexibile: de la câteva zeci la mii de bucăți</li>
  <li>Materiale premium: hârtie couché 115–170 g/mp, opțiuni de laminare</li>
  <li>Configurare ușoară: vezi prețul instant în configurator</li>
</ul>

<h3>Specificații recomandate</h3>
<p>Formate populare: A6 (105×148 mm), A5 (148×210 mm). Rezoluție: 300 DPI, culori CMYK, bleed 3 mm. Pentru text folosiți font 10–12 pt pentru lizibilitate.</p>

<h3>Exemple de utilizare</h3>
<p>Flyere promoționale, pliante cu pachete de servicii (tuns + spălat), cupoane de fidelizare și carduri cu discount integrate în materialul imprimat.</p>

<h3>Cum comanzi</h3>
<ol>
  <li>Alege formatul și tirajul în configurator.</li>
  <li>Încarcă fișierul tău (PDF recomandat) sau solicită design profesional.</li>
  <li>Confirmă și alege livrare sau ridicare din sediu.</li>
</ol>

<h3>Întrebări frecvente (FAQ)</h3>
<h4>Cât durează producția?</h4>
<p>După aprobare artwork: 2–4 zile lucrătoare, în funcție de tiraj și finisaje.</p>

<h4>Ce formate acceptați?</h4>
<p>PDF/X-1a, PDF standard, imagini la 300 DPI, culori CMYK. Putem verifica fișiere pentru tipar gratuit.</p>

<p><strong>Keywords:</strong> pliante frizerie, pliante salon, pliante A5 frizerie, imprimare pliante frizerie</p>
`,
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Pliante pentru vulcanizări — promoții și oferte sezoniere",
      shortDescription:
        "Pliante special create pentru service-uri auto și vulcanizări: oferte sezonale, pachete schimb anvelope și promoții rapide.",
      seoTitle: "Pliante pentru vulcanizări | tipărire rapidă | Prynt",
      seoDescription:
        "Pliante pentru vulcanizări: A5/A6, hârtie 115–170 g/mp. Configurează tirajul și vezi prețul instant în configurator.",
      images: ["/images/landing/pliante-vulcanizare-1.jpg"],
      productRouteSlug: "pliante-vulcanizare",
      contentHtml: `
<h2>Pliante pentru vulcanizări — atrage clienți la service</h2>
<p>Promovează serviciile de sezon (schimb de anvelope, verificări) cu pliante optimizate pentru distribuție locală. Mesaje clare și oferte cu termen limită cresc rata de conversie.</p>

<h3>Ce includ pliantele noastre</h3>
<ul>
  <li>Design orientat promoție (CTA vizibil)</li>
  <li>Materiale recomandate pentru distribuție outdoor/indoor</li>
  <li>Imprimare rapidă și verificare fișier inclusă</li>
</ul>

<h3>Specificații</h3>
<p>Format recomandat: A6/A5. Hârtie 115–170 g/mp, 300 DPI, CMYK. Bleed 3 mm.</p>

<h3>FAQ</h3>
<p><strong>Pot comanda tiraje mici?</strong> Da — acceptăm și tiraje mici cu prețuri competitive.</p>
`,
    },
    "fast-food": {
      key: "fast-food",
      title: "Pliante pentru fast-food — meniuri și promoții",
      shortDescription:
        "Pliante pentru restaurante fast-food: meniuri compacte, oferte combo și cupoane cu coduri promoționale.",
      seoTitle: "Pliante fast-food | meniuri & promoții | Prynt",
      seoDescription:
        "Pliante și flyere pentru fast-food: design de meniu, tiraj flexibil, configurator pentru preț instant.",
      images: ["/images/landing/pliante-fastfood-1.jpg"],
      productRouteSlug: "pliante-fastfood",
      contentHtml: `
<h2>Pliante pentru restaurante fast-food</h2>
<p>Transformă ofertele în comenzi: pliante concise cu meniuri, imagini apetisante și cod promo. Ideal pentru distribuție locală și promovări la pachet.</p>

<h3>Specificații & recomandări</h3>
<ul>
  <li>Format: A6 pentru distribuție, A5 pentru meniuri detaliate</li>
  <li>Hârtie: 115–170 g/mp, imagini la 300 DPI</li>
  <li>Include buton principal: "Comandă acum" sau cod promo vizibil</li>
</ul>

<h3>FAQ</h3>
<p><strong>Putem imprima meniuri personalizate?</strong> Da — încărcați designul sau cereți serviciul nostru de design.</p>
`,
    },
  },

  bannere: {
    frizerie: {
      key: "frizerie",
      title: "Bannere pentru frizerii — vizibilitate pentru salon",
      shortDescription:
        "Bannere rezistente pentru exterior și interior: dimensiuni custom, material frontlit și finisaje profesionale (tiv, capse).",
      seoTitle: "Bannere pentru frizerii | tiv & capse | Prynt",
      seoDescription:
        "Bannere personalizate pentru frizerii. Alege dimensiune, material și finisaje. Configurator online cu preț instant.",
      images: ["/images/landing/banner-frizerie-1.jpg"],
      productRouteSlug: "banner-frizerie",
      contentHtml: `
<h2>Bannere pentru frizerii — materiale și recomandări</h2>
<p>Bannerele promovează salonul de la distanță: anunțuri de deschidere, promoții sau branding. Oferim material durabil, finisaje profesionale și montaj opțional.</p>

<h3>Materiale recomandate</h3>
<ul>
  <li>Frontlit 440–510 g/mp pentru exterior</li>
  <li>Tiv și capse incluse; găuri pentru vânt disponibile</li>
</ul>

<h3>Specificații tehnice</h3>
<p>Setați dimensiunea în configurator; artwork la 72–150 DPI este ok pentru bannere mari, dar recomandăm 150 DPI pentru claritate.</p>

<h3>FAQ</h3>
<p><strong>Ce este tivul?</strong> Tivul întărește marginea pentru montaj și crește durabilitatea bannerului.</p>
`,
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Bannere pentru vulcanizări — semnalistică și promoții",
      shortDescription:
        "Bannere outdoor pentru service auto: anunțuri de promoții, oferte sezoniere și branding vizibil de pe stradă.",
      seoTitle: "Bannere vulcanizare | semnalistică outdoor | Prynt",
      seoDescription:
        "Bannere personalizate pentru service auto. Materiale rezistente, tiv & capse, configurator pentru dimensiuni și finisaje.",
      images: ["/images/landing/banner-vulcanizare-1.jpg"],
      productRouteSlug: "banner-vulcanizare",
      contentHtml: `
<h2>Bannere pentru vulcanizări — recomandări practice</h2>
<p>Amplasează bannere la intrare sau pe gard pentru a atrage clienți. Materialele rezistente și finisajele corecte asigură durabilitate în exterior.</p>

<h3>Specificații</h3>
<ul>
  <li>Material: frontlit 440–510 g/mp</li>
  <li>Finisaje: tiv, capse, găuri pentru vânt</li>
</ul>

<h3>FAQ</h3>
<p><strong>Se pot personaliza dimensiunile?</strong> Da — configuratorul permite dimensiuni custom și calculează prețul instant.</p>
`,
    },
  },

  canvas: {
    frizerie: {
      key: "frizerie",
      title: "Canvas pentru frizerii — decor elegant pentru salon",
      shortDescription:
        "Canvas-uri Fine Art pe șasiu din lemn: portofolii, imagini cu lucrări și elemente de branding pentru salon.",
      seoTitle: "Canvas pentru frizerii | print Fine Art | Prynt",
      seoDescription:
        "Canvas-uri personalizate pentru saloane: print Fine Art, șasiu din lemn, livrare și montaj opțional.",
      images: ["/images/landing/canvas-frizerie-1.jpg"],
      productRouteSlug: "canvas-frizerie",
      contentHtml: `
<h2>Canvas-uri pentru frizerii — decor premium</h2>
<p>Canvas-urile sunt ideale pentru decorul salonului, expunerea de portofoliu și crearea unei atmosfere premium. Imprimăm pe pânză Fine Art și montăm pe șasiu din lemn.</p>

<h3>Specificații</h3>
<p>Dimensiuni personalizate; recomandare finisaj: pânză Fine Art, șasiu 18–30 mm.</p>

<h3>FAQ</h3>
<p><strong>Pot comanda canvas cu dimensiuni personalizate?</strong> Da — configuratorul acceptă dimensiuni și calculează prețul.</p>
`,
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Canvas pentru service auto — branding în interior",
      shortDescription:
        "Canvas pentru service: afișează portofolii, imagini cu echipamente și oferte în sala de așteptare.",
      seoTitle: "Canvas service auto | print pe pânză | Prynt",
      seoDescription: "Canvas-uri personalizate pentru service-uri auto: decor, branding și prezentare servicii.",
      images: ["/images/landing/canvas-vulcanizare-1.jpg"],
      productRouteSlug: "canvas-vulcanizare",
      contentHtml: `
<h2>Canvas-uri pentru service auto</h2>
<p>Canvas-urile aduc branding profesionist în sala de așteptare sau pe pereți. Perfect pentru afișarea ofertelor și a portofoliului de lucrări.</p>

<h3>Specificații</h3>
<p>Print Fine Art, cadru din lemn, dimensiuni personalizate disponibile.</p>
`,
    },
  },

  afise: {
    frizerie: {
      key: "frizerie",
      title: "Afișe pentru frizerii — A2/A1 pentru vizibilitate",
      shortDescription:
        "Afișe A2/A1 pentru interior și exterior: materiale rezistente, laminare și opțiuni de finish pentru vizibilitate maximă.",
      seoTitle: "Afișe frizerie | imprimare A2/A1 | Prynt",
      seoDescription:
        "Afișe pentru frizerii: recomandări materiale, finisaje și configurator pentru dimensiuni și preț.",
      images: ["/images/landing/afise-frizerie-1.jpg"],
      productRouteSlug: "afise-frizerie",
      contentHtml: `
<h2>Afișe pentru frizerii — anunțuri și promoții</h2>
<p>Afișele A2/A1 sunt perfecte pentru anunțuri de oferte și semnalistică în interior. Recomandăm hârtie couché 150–250 g/mp și laminare pentru durabilitate.</p>

<h3>Specificații</h3>
<ul>
  <li>A2 (420×594 mm), A1 (594×841 mm)</li>
  <li>Hârtie 150–250 g/mp, laminare opțională</li>
</ul>
`,
    },
    vulcanizare: {
      key: "vulcanizare",
      title: "Afișe pentru vulcanizări — formate A2/A1",
      shortDescription:
        "Afișe vizibile pentru service-uri auto, ideale pentru oferte, anunțuri și informare clienți.",
      seoTitle: "Afișe vulcanizare | imprimare A2/A1 | Prynt",
      seoDescription:
        "Afișe și postere pentru vulcanizări: materiale rezistente, opțiuni de laminare și layout recomandat.",
      images: ["/images/landing/afise-vulcanizare-1.jpg"],
      productRouteSlug: "afise-vulcanizare",
      contentHtml: `
<h2>Afișe pentru vulcanizări — anunțuri și promoții locale</h2>
<p>Folosește afișe A2/A1 pentru a comunica oferte sau servicii speciale. Layout clar, text mare și imagini reprezentative îmbunătățesc vizibilitatea.</p>

<h3>Specificații</h3>
<ul>
  <li>Format: A2/A1</li>
  <li>Material: couché 150–250 g/mp, laminare</li>
</ul>
`,
    },
  },
};

// Helper: list all landing routes for generateStaticParams
export function listAllLandingRoutes() {
  const out: { category: string; slug: string }[] = [];
  Object.keys(LANDING_CATALOG).forEach((category) => {
    const entries = LANDING_CATALOG[category];
    Object.keys(entries).forEach((key) => {
      const val = entries[key];
      // If the value looks like a LandingInfo (has .key), push it directly
      if (val && typeof val === 'object' && 'key' in val) {
        out.push({ category, slug: key });
        return;
      }
      // Otherwise assume it's a grouped map and iterate its children
      if (val && typeof val === 'object') {
        Object.keys(val as LandingGroup).forEach((childSlug) => {
          out.push({ category, slug: childSlug });
        });
      }
    });
  });
  return out;
}