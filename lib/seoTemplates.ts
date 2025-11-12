// lib/seoTemplates.ts
// Small helper to generate SEO title/description for products when not provided.
export function generateSeoForProduct(p: any) {
  const slug = String(p.slug ?? p.routeSlug ?? p.id ?? "").replace(/-/g, ' ');
  const title = String((p.title ?? slug) || '').trim();

  const seoTitle = `${title} | Prynt`;

  // Generate a longer SEO description in Romanian focusing on relevance, materials and calls-to-action.
  const tags = Array.isArray(p.tags) ? p.tags.join(', ') : '';
  const short = `Banner ${title} – bannere personalizate, print full-color pe materiale rezistente pentru exterior și interior.`;
  const details = `Comandă online bannere personalizate pentru ${tags || 'promovare, evenimente și semnalistică'}. Oferim material Frontlit de calitate, finisaje la cerere și tăiere la dimensiune. Prețuri începând de la 50 RON și livrare rapidă.`;

  const description = `${short} ${details}`;

  return { title: seoTitle, description };
}

export default generateSeoForProduct;
