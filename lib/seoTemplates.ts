// lib/seoTemplates.ts
// Small helper to generate SEO title/description for products when not provided.
export type ProductForSeo = {
  slug?: string;
  routeSlug?: string;
  id?: string | number;
  title?: string;
  metadata?: { category?: string };
  tags?: string[];
};

export function generateSeoForProduct(p: ProductForSeo) {
  const slug = String(p.slug ?? p.routeSlug ?? p.id ?? "").replace(/-/g, " ");
  const title = String((p.title ?? slug) || "").trim();
  const category = String(p?.metadata?.category ?? "").toLowerCase();

  const seoTitle = `${title} | Prynt`;

  const tags = Array.isArray(p.tags) ? p.tags.join(", ") : "";

  if (category === "canvas") {
    const short = `Canvas ${title} – tablou canvas personalizat, print de calitate pe pânză canvas montată pe șasiu din lemn.`;
    const details = `Comandă online canvas personalizat pentru ${tags || "decor, cadouri și spații interioare"}. Oferim print la rezoluție înaltă, margini întinse, dimensiuni personalizabile. Prețuri începând de la 79 RON și livrare rapidă.`;
    return { title: seoTitle, description: `${short} ${details}` };
  }

  if (category === "afise") {
    const short = `Afișe ${title} – afișe personalizate, print de calitate pe hârtie couché pentru interior/exterior temporar.`;
    const details = `Comandă online afișe pentru ${tags || "promoții, evenimente și comunicare vizuală"}. Oferim opțiuni de gramaj, dimensiuni standard sau personalizate, print clar și culori vii. Prețuri începând de la 3 RON și livrare rapidă.`;
    return { title: seoTitle, description: `${short} ${details}` };
  }

  if (category === "flayere") {
    const short = `Flyere ${title} – tipărire flyere personalizate, pe hârtie couché cu finisaje la alegere.`;
    const details = `Comandă online flyere pentru ${tags || "promovare, campanii și evenimente"}. Oferim dimensiuni standard (A6, A5, A4), tiraje flexibile și print de calitate. Prețuri începând de la 50 RON și livrare rapidă.`;
    return { title: seoTitle, description: `${short} ${details}` };
  }

  if (category === "autocolante") {
    const short = `Autocolante și stickere ${title} – decupaj sau print la dimensiuni personalizate pentru pereți, vitrine, auto și device-uri.`;
    const details = `Comandă online autocolante pentru ${tags || "decor, semnalistică și branding"}. Oferim materiale diverse (monomeric, polimeric, perete, vitrină), tăiere pe contur și opțiuni de laminare. Prețuri începând de la 5 RON și livrare rapidă.`;
    return { title: seoTitle, description: `${short} ${details}` };
  }

  if (category === "tapet") {
    const short = `Tapet ${title} – print personalizat pe materiale de tapet pentru decor interior, montaj facil și aspect premium.`;
    const details = `Comandă online tapet personalizat pentru ${tags || "living, dormitor, birou sau spații comerciale"}. Oferim dimensiuni la comandă și print de calitate. Prețuri începând de la 45 RON și livrare rapidă.`;
    return { title: seoTitle, description: `${short} ${details}` };
  }

  // default: bannere (și alte categorii fără șablon dedicat)
  const short = `Banner ${title} – bannere personalizate, print full-color pe materiale rezistente pentru exterior și interior.`;
  const details = `Comandă online bannere personalizate pentru ${tags || "promovare, evenimente și semnalistică"}. Oferim material Frontlit de calitate, finisaje la cerere și tăiere la dimensiune. Prețuri începând de la 50 RON și livrare rapidă.`;
  return { title: seoTitle, description: `${short} ${details}` };
}

export default generateSeoForProduct;
