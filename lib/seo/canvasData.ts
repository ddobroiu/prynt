// lib/seo/canvasData.ts
import type { LandingInfo } from "../landingData";

export const CANVAS_SEO_DATA: Record<string, LandingInfo> = {
  // --- CADOURI & OCAZII SPECIALE ---
  "cadou": {
    key: "cadou",
    title: "Tablou Canvas Personalizat — Cadoul Perfect",
    shortDescription: "Transformă o fotografie dragă într-un tablou pe pânză. Cadoul ideal pentru orice ocazie.",
    seoTitle: "Tablou Canvas Personalizat | Cadouri Foto | Prynt",
    seoDescription: "Oferă emoții în dar. Tablouri canvas personalizate cu pozele tale. Calitate premium, șasiu lemn.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Dăruiește amintiri, nu doar obiecte</h2><p>Un tablou canvas este mai mult decât un cadou; este o amintire vie pe perete. Perfect pentru zile de naștere, aniversări sau sărbători.</p>`
  },
  "nunta": {
    key: "nunta",
    title: "Tablouri Canvas Nuntă — Amintiri de la Eveniment",
    shortDescription: "Cele mai frumoase poze de la nuntă merită expuse pe pânză de calitate.",
    seoTitle: "Tablou Canvas Nunta | Print Foto Pe Panza | Prynt",
    seoDescription: "Păstrează vie amintirea nunții. Printează fotografia preferată pe canvas de mari dimensiuni.",
    images: ["/products/canvas/1.webp"], // Poți adăuga o imagine specifică gen /products/canvas/nunta.webp
    contentHtml: `<h2>Ziua nunții pe peretele tău</h2><p>Nu lăsa pozele de la nuntă uitate în calculator. Transformă-le în piese de artă pentru livingul vostru.</p>`
  },
  "botez": {
    key: "botez",
    title: "Tablou Canvas Botez — Amintiri cu Bebe",
    shortDescription: "Tablouri delicate cu bebelușul tău. Decor perfect pentru camera copilului sau cadou pentru nași.",
    seoTitle: "Tablou Canvas Botez & Bebe | Cadouri Nasi | Prynt",
    seoDescription: "Tablouri canvas cu bebeluși. Print ecologic, sigur pentru camera copilului.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Primul zâmbet, imortalizat</h2><p>Fotografiile de la botez sau ședințele foto newborn arată spectaculos pe textura de pânză canvas.</p>`
  },
  "cuplu": {
    key: "cuplu",
    title: "Tablouri Canvas Cuplu — Ziua Îndrăgostiților",
    shortDescription: "Cadou romantic de Valentine's Day sau aniversare. Colaj foto sau portret de cuplu.",
    seoTitle: "Tablou Canvas Cuplu | Cadou Valentines Day | Prynt",
    seoDescription: "Surprinde-ți jumătatea cu un tablou personalizat. Printează povestea voastră de dragoste.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Celebrează iubirea</h2><p>Un gest romantic care va decora casa voastră pentru totdeauna.</p>`
  },

  // --- DECOR HOME & LIVING ---
  "living": {
    key: "living",
    title: "Tablouri Canvas pentru Living Modern",
    shortDescription: "Tablouri de mari dimensiuni (panoramic sau set multicanvas) pentru sufragerie.",
    seoTitle: "Tablouri Living & Sufragerie | Decor Perete | Prynt",
    seoDescription: "Schimbă atmosfera în living cu un tablou statement. Peisaje, abstract sau artă urbană.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Piesa de rezistență din sufragerie</h2><p>Un perete gol este o oportunitate ratată. Alege un canvas panoramic sau un set triptic pentru impact maxim.</p>`
  },
  "dormitor": {
    key: "dormitor",
    title: "Tablouri Canvas Dormitor — Relaxare & Stil",
    shortDescription: "Imagini relaxante, culori calde sau fotografii de familie pentru dormitor.",
    seoTitle: "Tablouri Dormitor | Canvas Relaxant | Prynt",
    seoDescription: "Creează un sanctuar de liniște. Tablouri canvas cu teme naturale sau abstracte pentru dormitor.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Adormi cu zâmbetul pe buze</h2><p>Decorează dormitorul cu imagini care îți aduc liniște și stare de bine.</p>`
  },
  "bucatarie": {
    key: "bucatarie",
    title: "Tablouri Canvas Bucătărie — Coffee & Food",
    shortDescription: "Tablouri cu cafea, condimente, fructe sau citate despre gătit.",
    seoTitle: "Tablouri Bucatarie | Decor Perete Dining | Prynt",
    seoDescription: "Dă viață bucătăriei tale. Tablouri rezistente la aburi (vernisate) cu tematică culinară.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Inspiră-te la gătit</h2><p>Un set de tablouri cu cafea sau ingrediente proaspete completează perfect designul bucătăriei.</p>`
  },
  "camera-copii": {
    key: "camera-copii",
    title: "Tablouri Canvas Cameră Copii",
    shortDescription: "Personaje din desene, animale drăguțe sau numele copilului stilizat.",
    seoTitle: "Tablouri Camera Copii | Decor Perete | Prynt",
    seoDescription: "Decorează camera micuțului. Printuri sigure, culori vii, personaje îndrăgite.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Universul copilăriei</h2><p>Adaugă culoare și veselie în camera copilului cu tablouri educative sau decorative.</p>`
  },

  // --- BUSINESS & BIROU ---
  "birou": {
    key: "birou",
    title: "Tablouri Canvas Birou — Motivaționale & Peisaje",
    shortDescription: "Decorează pereții biroului. Citate motivaționale sau peisaje urbane.",
    seoTitle: "Tablouri Birou & Office | Decor Corporate | Prynt",
    seoDescription: "Crește productivitatea și moralul echipei cu un decor office profesionist.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Un mediu de lucru inspirat</h2><p>Pereții albi sunt plictisitori. Adaugă personalitate spațiului de lucru cu tablouri canvas profesionale.</p>`
  },
  "salon": {
    key: "salon",
    title: "Tablouri Canvas Salon Înfrumusețare",
    shortDescription: "Imagini fashion, beauty, makeup pentru decor salon.",
    seoTitle: "Tablouri Salon Infrumusetare & Spa | Decor | Prynt",
    seoDescription: "Creează o atmosferă chic în salonul tău. Tablouri cu modele, coafuri sau elemente zen.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Stil și eleganță pentru clienții tăi</h2><p>Completează designul interior al salonului cu tablouri care reflectă frumusețea.</p>`
  },
  "cabinet-medical": {
    key: "cabinet-medical",
    title: "Tablouri Canvas Cabinet Medical / Clinica",
    shortDescription: "Imagini liniștitoare, natură sau anatomie stilizată pentru clinici.",
    seoTitle: "Tablouri Cabinet Medical & Sala Asteptare | Prynt",
    seoDescription: "Relaxează pacienții în sala de așteptare cu tablouri canvas cu peisaje naturale.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>O atmosferă primitoare</h2><p>Reduce anxietatea pacienților printr-un decor cald și prietenos.</p>`
  },
  "hotel": {
    key: "hotel",
    title: "Tablouri Canvas Hotel & Pensiune",
    shortDescription: "Decor pereți pentru camere de hotel. Peisaje locale sau artă abstractă.",
    seoTitle: "Tablouri Hotel & Horeca | Decor Camere | Prynt",
    seoDescription: "Soluții de decor pentru hoteluri. Tablouri rezistente, prețuri de volum.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Ospitalitate prin detalii</h2><p>Tablourile sunt detaliul final care transformă o cameră de hotel într-un spațiu 'ca acasă'.</p>`
  },

  // --- STILURI ARTISTICE ---
  "abstract": {
    key: "abstract",
    title: "Tablouri Canvas Abstracte — Artă Modernă",
    shortDescription: "Forme, culori și texturi pentru interioare minimaliste sau moderne.",
    seoTitle: "Tablouri Abstracte | Arta Moderna Pe Canvas | Prynt",
    seoDescription: "Tablouri abstracte care se potrivesc în orice decor modern. Print digital de artă.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Artă modernă accesibilă</h2><p>Nu trebuie să fii colecționar pentru a avea artă în casă. Alege un canvas abstract care te reprezintă.</p>`
  },
  "alb-negru": {
    key: "alb-negru",
    title: "Tablouri Canvas Alb-Negru — Fotografie Artistică",
    shortDescription: "Eleganță atemporală. Portrete, arhitectură sau peisaje B&W.",
    seoTitle: "Tablouri Alb Negru | Fotografie Artistica | Prynt",
    seoDescription: "Decor minimalist și sofisticat. Tablouri alb-negru cu contrast puternic.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Clasic și elegant</h2><p>Fotografia alb-negru adaugă o notă de rafinament și dramatism oricărei încăperi.</p>`
  },
  "colaj": {
    key: "colaj",
    title: "Tablou Canvas Colaj Foto",
    shortDescription: "Mai multe poze pe același tablou. Perfect pentru vacanțe sau primul an al bebelușului.",
    seoTitle: "Tablou Colaj Foto | Multe Poze Pe Un Canvas | Prynt",
    seoDescription: "Nu te poți decide la o singură poză? Fă un colaj foto pe canvas. Design inclus.",
    images: ["/products/canvas/1.webp"],
    contentHtml: `<h2>Toate amintirile la un loc</h2><p>Ideal pentru a cuprinde momentele cheie dintr-o vacanță sau evoluția copilului într-un singur tablou.</p>`
  }
};