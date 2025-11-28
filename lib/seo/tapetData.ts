// lib/seo/tapetData.ts
import type { LandingInfo } from "../landingData";

export const TAPET_SEO_DATA: Record<string, LandingInfo> = {
  // --- HOME & DECO: CAMERE ---
  "living": {
    key: "living",
    title: "Tapet Living & Sufragerie — Modern & 3D",
    shortDescription: "Fototapet pentru peretele de accent din living. Modele 3D, peisaje sau texturi.",
    seoTitle: "Tapet Living Modern | Fototapet Sufragerie | Prynt",
    seoDescription: "Transformă livingul cu un tapet personalizat. Print lavabil, textură premium (Canvas sau Nisip).",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Inima casei tale merită un design unic</h2><p>Renunță la pereții albi. Un fototapet pe peretele din spatele canapelei sau al televizorului schimbă complet atmosfera camerei.</p>`
  },
  "dormitor": {
    key: "dormitor",
    title: "Tapet Dormitor — Relaxare & Romantism",
    shortDescription: "Tapet cu motive florale, peisaje zen sau texturi soft pentru dormitor.",
    seoTitle: "Tapet Dormitor Matrimonial | Decor Perete | Prynt",
    seoDescription: "Creează un sanctuar de liniște. Tapet dormitor personalizat, culori calde și relaxante.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Trezește-te într-un decor de vis</h2><p>Alege imagini care induc starea de relaxare: plaje pustii, păduri cețoase sau modele abstracte fluide.</p>`
  },
  "camera-copii": {
    key: "camera-copii",
    title: "Tapet Cameră Copii — Poveste pe Pereți",
    shortDescription: "Tapet cu animale, prințese, supereroi sau hărți educative.",
    seoTitle: "Tapet Camera Copii & Bebe | Fototapet | Prynt",
    seoDescription: "Decor de basm pentru cei mici. Tapet cu cerneală ecologică, sigur pentru copii.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O lume magică în camera lor</h2><p>De la jungle tropicale la spațiul cosmic, tapetul stimulează imaginația copilului tău.</p>`
  },
  "bucatarie": {
    key: "bucatarie",
    title: "Tapet Bucătărie — Lavabil & Rezistent",
    shortDescription: "Tapet cu texturi de cărămidă, piatră, cafea sau condimente.",
    seoTitle: "Tapet Bucatarie Lavabil | Decor Perete | Prynt",
    seoDescription: "Soluții de decor pentru bucătărie. Tapet rezistent la ștergere și aburi (material vinilic).",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Stil și funcționalitate</h2><p>Un tapet bine ales poate înlocui faianța în zonele mai puțin expuse la apă directă, oferind un look modern.</p>`
  },
  "hol": {
    key: "hol",
    title: "Tapet Hol & Coridor — Spațiu & Lumină",
    shortDescription: "Tapet care mărește vizual spațiul. Perspective 3D, tuneluri, ferestre false.",
    seoTitle: "Tapet Hol & Intrare | Fototapet 3D | Prynt",
    seoDescription: "Mărește vizual holurile înguste cu tapet 3D. Iluzie optică de spațiu.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Prima impresie contează</h2><p>Transformă un hol anost într-o galerie de artă sau o fereastră către natură.</p>`
  },

  // --- STILURI & TEMATICI ---
  "harta-lumii": {
    key: "harta-lumii",
    title: "Tapet Hartă Lumii — Educativ & Decorativ",
    shortDescription: "Hărți politice, fizice sau stilizate (vintage, acuarelă) pentru copii și birouri.",
    seoTitle: "Tapet Harta Lumii | Fototapet Harta | Prynt",
    seoDescription: "Cel mai popular model de tapet. Harta lumii pentru camera copilului sau birou.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Explorator în propria casă</h2><p>O hartă a lumii pe tot peretele este atât un element decorativ superb, cât și o sursă de învățare.</p>`
  },
  "3d": {
    key: "3d",
    title: "Tapet 3D & Iluzii Optice",
    shortDescription: "Forme geometrice, tuneluri, sfere care par să iasă din perete.",
    seoTitle: "Tapet 3D Living & Dormitor | Efect Adancime | Prynt",
    seoDescription: "Dă adâncime camerei cu fototapet 3D. Design modern și spectaculos.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Adaugă dimensiune spațiului</h2><p>Ideal pentru camere mici sau pentru a crea un punct focal futurist.</p>`
  },
  "texturi": {
    key: "texturi",
    title: "Tapet Imitație Materiale — Cărămidă, Beton, Lemn",
    shortDescription: "Texturi realiste de beton aparent, cărămidă roșie/albă, scânduri vechi.",
    seoTitle: "Tapet Caramida & Beton | Stil Industrial | Prynt",
    seoDescription: "Obține look-ul industrial sau rustic fără șantier. Tapet imitație materiale naturale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Design industrial la preț mic</h2><p>Nu e nevoie să decopertezi pereții. Tapetul nostru imită perfect textura betonului sau a cărămizii.</p>`
  },
  "peisaje": {
    key: "peisaje",
    title: "Tapet Peisaje Natură — Pădure, Mare, Munte",
    shortDescription: "Adu natura în casă. Păduri cețoase, plaje tropicale, munți înzăpeziți.",
    seoTitle: "Tapet Peisaje Natura | Fototapet Padure & Mare | Prynt",
    seoDescription: "Relaxează-te cu o priveliște superbă. Tapet natură la rezoluție înaltă.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O fereastră către natură</h2><p>Transformă un perete într-o panoramă spectaculoasă care îți taie respirația.</p>`
  },

  // --- BUSINESS & SPAȚII PUBLICE ---
  "birou": {
    key: "birou",
    title: "Tapet Birou & Sală de Ședințe",
    shortDescription: "Hărți, citate motivaționale, skyline orașe sau branding subtil.",
    seoTitle: "Tapet Birou & Office | Branding Pereti | Prynt",
    seoDescription: "Amenajează un birou modern. Tapet personalizat cu valorile companiei sau design abstract.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Inspiră echipa și clienții</h2><p>Un mediu de lucru creativ stimulează productivitatea. Renunță la pereții gri.</p>`
  },
  "cafenea": {
    key: "cafenea",
    title: "Tapet Cafenea & Restaurant",
    shortDescription: "Design tematic: boabe de cafea, străzi din Paris, artă urbană.",
    seoTitle: "Tapet Horeca | Cafenea & Restaurant | Prynt",
    seoDescription: "Creează o atmosferă unică în locația ta. Tapet rezistent la trafic și curățare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Atmosferă instagramabilă</h2><p>Clienții adoră să facă poze în locații cu design unic. Oferă-le un fundal perfect.</p>`
  },
  "salon": {
    key: "salon",
    title: "Tapet Salon Înfrumusețare & Spa",
    shortDescription: "Imagini zen, orhidee, pietre, bambus sau figuri fashion.",
    seoTitle: "Tapet Salon & Spa | Decor Relaxant | Prynt",
    seoDescription: "Transformă salonul într-o oază de relaxare cu un tapet tematic.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lux și rafinament</h2><p>Completează experiența clienților cu un decor vizual care inspiră frumusețe.</p>`
  },
  "gradinita": {
    key: "gradinita",
    title: "Tapet Grădiniță & Loc de Joacă",
    shortDescription: "Desene vectoriale, animale, alfabet, numere. Culori vii.",
    seoTitle: "Tapet Gradinita & Loc de Joaca | Prynt",
    seoDescription: "Amenajează spații de joacă vesele. Tapet lavabil, rezistent la micii artiști.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Educație prin joc și culoare</h2><p>Pereții pot fi o sursă de învățare. Alege hărți, litere sau scene din povești.</p>`
  }
};