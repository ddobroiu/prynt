// lib/seo/plianteData.ts
import type { LandingInfo } from "../landingData";

export const PLIANTE_SEO_DATA: Record<string, LandingInfo> = {
  // --- HORECA & DELIVERY ---
  "pizzerie": {
    key: "pizzerie",
    title: "Pliante Pizzerie — Meniu Delivery & Oferte",
    shortDescription: "Pliante A4 împăturite (tri-fold) sau A5 cu meniul de pizza și oferte.",
    seoTitle: "Pliante Pizzerie | Meniuri Delivery | Prynt",
    seoDescription: "Tipărire meniuri pizza pentru livrare. Pliante lucioase, culori apetisante. Distribuție în cutiile de pizza.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Crește frecvența comenzilor</h2><p>Un pliant cu meniul complet pus în fiecare cutie de pizza livrată asigură comanda următoare. Include oferte gen '5+1 Gratis'.</p>`
  },
  "restaurant": {
    key: "restaurant",
    title: "Pliante Restaurant & Catering",
    shortDescription: "Meniuri catering, organizare evenimente, oferta zilei.",
    seoTitle: "Pliante Restaurant & Catering | Tipar Meniuri | Prynt",
    seoDescription: "Promovează serviciile de catering sau meniul de prânz cu pliante distribuite la birourile din zonă.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Meniul tău pe biroul clienților</h2><p>Distribuie pliante cu meniul săptămânal la clădirile de birouri din apropiere pentru a atrage clienți la prânz.</p>`
  },
  "fast-food": {
    key: "fast-food",
    title: "Flyere Fast Food — Shaorma & Burger",
    shortDescription: "Flyere A6/A5 ieftine pentru distribuție stradală. Cupoane de reducere.",
    seoTitle: "Flyere Fast Food & Shaormerie | Promotie Stradala | Prynt",
    seoDescription: "Flyere cu oferte de nerefuzat. Tiraje mari pentru împărțit pe stradă.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Atrage traficul pietonal</h2><p>Oferă un flyer cu un cupon de reducere (ex: 'Suc Gratis') trecătorilor pentru a-i convinge să intre.</p>`
  },

  // --- SERVICII & IMOBILIARE ---
  "imobiliare": {
    key: "imobiliare",
    title: "Flyere Imobiliare — Căutăm Apartamente",
    shortDescription: "Flyere mici 'Cumpărăm apartamente în acest bloc', distribuție cutii poștale.",
    seoTitle: "Flyere Imobiliare | Caut Apartamente | Prynt",
    seoDescription: "Instrumentul #1 pentru agenți imobiliari. Flyere pentru farming în zone rezidențiale.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Farming imobiliar eficient</h2><p>Distribuie flyere în cutiile poștale din zona țintă pentru a găsi proprietari care vor să vândă.</p>`
  },
  "curatenie": {
    key: "curatenie",
    title: "Pliante Firme Curățenie — Scări de Bloc",
    shortDescription: "Oferte curățenie pentru asociații de proprietari sau la domiciliu.",
    seoTitle: "Pliante Firma Curatenie | Marketing Local | Prynt",
    seoDescription: "Promovează serviciile de curățenie direct la ușa clientului. Pliante A5 sau DL.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Curățenie profesională la tine acasă</h2><p>Prezintă pachetele de abonamente pentru curățenie de întreținere sau generală.</p>`
  },
  "servicii-funerare": {
    key: "servicii-funerare",
    title: "Pliante Servicii Funerare",
    shortDescription: "Pliante discrete cu pachete de servicii și prețuri.",
    seoTitle: "Pliante Servicii Funerare | Pompe Funebre | Prynt",
    seoDescription: "Materiale informative clare și empatice pentru servicii funerare complete.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Informații utile în momente grele</h2><p>Prezintă pachetele de servicii (sicrie, transport, acte) într-un format ușor de parcurs.</p>`
  },

  // --- BEAUTY & MEDICAL ---
  "salon": {
    key: "salon",
    title: "Pliante Salon Înfrumusețare — Listă Prețuri",
    shortDescription: "Pliant cu lista de servicii și prețuri (tri-fold). Voucher cadou.",
    seoTitle: "Pliante Salon Infrumusetare | Lista Preturi | Prynt",
    seoDescription: "Un meniu de servicii elegant pentru salonul tău. Include poze și prețuri.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Ghidul frumuseții</h2><p>Oferă clientelor un pliant cu toate serviciile disponibile pentru a le încuraja să încerce proceduri noi.</p>`
  },
  "clinica": {
    key: "clinica",
    title: "Pliante Clinică Medicală & Stomatologie",
    shortDescription: "Pliante informative despre tratamente, implanturi sau analize.",
    seoTitle: "Pliante Clinica & Stomatologie | Brosuri Pacienti | Prynt",
    seoDescription: "Educă pacienții cu privire la procedurile medicale oferite. Pliante A4 împăturite.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Informare corectă a pacienților</h2><p>Broșurile explicative despre tratamente (ex: implant dentar, aparat dentar) cresc rata de acceptare a planului de tratament.</p>`
  },

  // --- EVENIMENTE & CAMPANII ---
  "electorale": {
    key: "electorale",
    title: "Flyere Electorale — Campanie Politică",
    shortDescription: "Flyere de campanie pentru distribuție stradală și door-to-door.",
    seoTitle: "Flyere Electorale | Pliante Campanie | Prynt",
    seoDescription: "Tiraje mari, livrare rapidă. Flyere cu programul politic și candidatul.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Mesajul tău în fiecare casă</h2><p>Flyerele electorale rămân cel mai direct mod de a comunica programul politic alegătorilor.</p>`
  },
  "evenimente": {
    key: "evenimente",
    title: "Flyere Evenimente & Cluburi",
    shortDescription: "Flyere pentru party-uri, concerte, deschideri de club.",
    seoTitle: "Flyere Evenimente & Party | Promovare Club | Prynt",
    seoDescription: "Flyere colorate, pe carton lucios. Design atractiv pentru viața de noapte.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Invitația la distracție</h2><p>Distribuie flyere în campusuri sau centrele orașelor pentru a umple clubul în weekend.</p>`
  },
  "scoala": {
    key: "scoala",
    title: "Pliante Școală Privată & Grădiniță",
    shortDescription: "Prezentarea ofertei educaționale, after-school, cursuri.",
    seoTitle: "Pliante Scoala & Gradinita | Oferta Educationala | Prynt",
    seoDescription: "Broșuri de prezentare pentru părinți. Detalii despre programă, tarife și facilități.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Viitorul începe aici</h2><p>O broșură detaliată oferă părinților încrederea necesară pentru a alege instituția ta.</p>`
  }
};