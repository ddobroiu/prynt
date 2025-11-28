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
  },

  // --- HORECA SUPLIMENTARE ---
  "braserie": {
    key: "braserie",
    title: "Pliante Brasserie & Pub",
    shortDescription: "Meniuri pentru bere artizanală și gustări.",
    seoTitle: "Pliante Brasserie | Meniu Bere | Prynt",
    seoDescription: "Prezintă sortimentul de beri și mâncăruri.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Experiență culinară</h2><p>Pliante cu meniul de beri și gustări pentru o seară perfectă.</p><ul><li>Meniu complet</li><li>Poze apetisante</li><li>Oferte speciale</li></ul>`
  },
  "cafenea": {
    key: "cafenea",
    title: "Pliante Cafenea & Patiserie",
    shortDescription: "Meniuri pentru cafea, prăjituri și deserturi.",
    seoTitle: "Pliante Cafenea | Meniu Deserturi | Prynt",
    seoDescription: "Atrage clienți cu pliante colorate pentru patiserie.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Dulce tentație</h2><p>Prezintă prăjiturile și cafelele speciale.</p><ul><li>Sortiment variat</li><li>Poze delicioase</li><li>Prețuri atractive</li></ul>`
  },
  "gelaterie": {
    key: "gelaterie",
    title: "Flyere Gelaterie & Înghețată",
    shortDescription: "Flyere cu sortimentul de înghețată artizanală.",
    seoTitle: "Flyere Gelaterie | Inghetata Artizanala | Prynt",
    seoDescription: "Promovează înghețata naturală în sezonul cald.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Răcorire dulce</h2><p>Flyere cu arome și prețuri pentru gelaterie.</p><ul><li>Arome naturale</li><li>Prețuri mici</li><li>Distribuție stradală</li></ul>`
  },
  "catering": {
    key: "catering",
    title: "Pliante Catering Evenimente",
    shortDescription: "Oferte pentru nunți, botezuri și evenimente corporate.",
    seoTitle: "Pliante Catering | Evenimente | Prynt",
    seoDescription: "Broșuri cu meniuri pentru evenimente speciale.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Evenimente memorabile</h2><p>Prezintă pachetele de catering pentru orice ocazie.</p><ul><li>Meniuri variate</li><li>Servire profesională</li><li>Prețuri competitive</li></ul>`
  },
  "food-truck": {
    key: "food-truck",
    title: "Flyere Food Truck",
    shortDescription: "Flyere pentru camioane alimentare mobile.",
    seoTitle: "Flyere Food Truck | Mancare Strada | Prynt",
    seoDescription: "Promovează locațiile și meniul food truck-ului.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Mâncare pe roți</h2><p>Flyere cu programul și meniul food truck-ului.</p><ul><li>Locații mobile</li><li>Meniu rapid</li><li>Oferte zilnice</li></ul>`
  },

  // --- SERVICII SUPLIMENTARE ---
  "reparatii-auto": {
    key: "reparatii-auto",
    title: "Pliante Service Auto",
    shortDescription: "Oferte pentru reparații și întreținere mașini.",
    seoTitle: "Pliante Service Auto | Reparatii | Prynt",
    seoDescription: "Broșuri cu servicii de service auto.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Mașina ta în siguranță</h2><p>Prezintă serviciile de reparații și mentenanță.</p><ul><li>Reparații complete</li><li>Piese originale</li><li>Garanție</li></ul>`
  },
  "it-service": {
    key: "it-service",
    title: "Flyere IT & Programare",
    shortDescription: "Flyere pentru servicii IT și dezvoltare software.",
    seoTitle: "Flyere IT Service | Programare | Prynt",
    seoDescription: "Promovează serviciile de IT pentru afaceri.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Tehnologie avansată</h2><p>Flyere cu servicii de programare și suport IT.</p><ul><li>Dezvoltare web</li><li>Suport tehnic</li><li>Consultanță</li></ul>`
  },
  "constructii": {
    key: "constructii",
    title: "Pliante Construcții & Renovări",
    shortDescription: "Oferte pentru construcții și reparații locuințe.",
    seoTitle: "Pliante Constructii | Renovari | Prynt",
    seoDescription: "Broșuri cu servicii de construcții.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Casă nouă sau renovată</h2><p>Prezintă proiectele și serviciile de construcții.</p><ul><li>Construcții noi</li><li>Renovări</li><li>Finisaje</li></ul>`
  },
  "transport": {
    key: "transport",
    title: "Flyere Transport & Logistică",
    shortDescription: "Flyere pentru servicii de transport.",
    seoTitle: "Flyere Transport | Logistica | Prynt",
    seoDescription: "Promovează serviciile de transport și curierat.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Transport rapid</h2><p>Flyere cu tarife și rute de transport.</p><ul><li>Livrare rapidă</li><li>Tarife mici</li><li>Copertină națională</li></ul>`
  },
  "consultanta": {
    key: "consultanta",
    title: "Pliante Consultanță Financiară",
    shortDescription: "Broșuri pentru servicii de consultanță.",
    seoTitle: "Pliante Consultanta | Finante | Prynt",
    seoDescription: "Prezintă serviciile de consultanță financiară.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Expertiză financiară</h2><p>Pliante cu sfaturi și servicii de consultanță.</p><ul><li>Planificare financiară</li><li>Investiții</li><li>Consultanță</li></ul>`
  },

  // --- BEAUTY & MEDICAL SUPLIMENTARE ---
  "coafura": {
    key: "coafura",
    title: "Pliante Coafor & Frizerie",
    shortDescription: "Meniuri pentru servicii de coafură.",
    seoTitle: "Pliante Coafor | Frizerie | Prynt",
    seoDescription: "Broșuri cu stiluri și prețuri pentru coafură.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Stil impecabil</h2><p>Prezintă serviciile de coafură și styling.</p><ul><li>Tunsori moderne</li><li>Vopsire</li><li>Tratament păr</li></ul>`
  },
  "spa": {
    key: "spa",
    title: "Pliante SPA & Wellness",
    shortDescription: "Oferte pentru centre SPA.",
    seoTitle: "Pliante SPA | Relaxare | Prynt",
    seoDescription: "Broșuri cu tratamente de relaxare.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Relaxare totală</h2><p>Pliante cu masaje și tratamente SPA.</p><ul><li>Masaje</li><li>Tratament facial</li><li>Relaxare</li></ul>`
  },
  "farmacie": {
    key: "farmacie",
    title: "Flyere Farmacie & Sănătate",
    shortDescription: "Flyere cu oferte pentru produse farmaceutice.",
    seoTitle: "Flyere Farmacie | Produse Sanatate | Prynt",
    seoDescription: "Promovează suplimente și produse de sănătate.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Sănătate preventivă</h2><p>Flyere cu vitamine și produse naturale.</p><ul><li>Suplimente</li><li>Cosmetice</li><li>Consultanță</li></ul>`
  },
  "dentist": {
    key: "dentist",
    title: "Pliante Cabinet Stomatologic",
    shortDescription: "Broșuri pentru servicii dentare.",
    seoTitle: "Pliante Dentist | Stomatologie | Prynt",
    seoDescription: "Prezintă tratamentele dentare disponibile.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Zâmbet sănătos</h2><p>Pliante cu servicii de stomatologie.</p><ul><li>Implanturi</li><li>Albire</li><li>Ortodonție</li></ul>`
  },
  "optician": {
    key: "optician",
    title: "Flyere Optică Medicală",
    shortDescription: "Flyere pentru ochelari și lentile.",
    seoTitle: "Flyere Optica | Ochelari | Prynt",
    seoDescription: "Promovează servicii de optică.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Vedere clară</h2><p>Flyere cu ochelari și lentile de contact.</p><ul><li>Ochelari</li><li>Lentile</li><li>Consult medical</li></ul>`
  },

  // --- EVENIMENTE & CAMPANII SUPLIMENTARE ---
  "nunta": {
    key: "nunta",
    title: "Flyere Nunți & Evenimente",
    shortDescription: "Flyere pentru organizatori de nunți.",
    seoTitle: "Flyere Nunti | Organizatori | Prynt",
    seoDescription: "Promovează servicii pentru evenimente de nuntă.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Ziua cea mai frumoasă</h2><p>Flyere cu pachete pentru nunți.</p><ul><li>Organizare</li><li>Decorare</li><li>Catering</li></ul>`
  },
  "botez": {
    key: "botez",
    title: "Pliante Botezuri",
    shortDescription: "Broșuri pentru evenimente de botez.",
    seoTitle: "Pliante Botezuri | Evenimente | Prynt",
    seoDescription: "Prezintă servicii pentru botezuri.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Celebrare familială</h2><p>Pliante cu idei pentru botezuri.</p><ul><li>Invitații</li><li>Decor</li><li>Meniu</li></ul>`
  },
  "corporate": {
    key: "corporate",
    title: "Flyere Evenimente Corporate",
    shortDescription: "Flyere pentru evenimente de afaceri.",
    seoTitle: "Flyere Corporate | Evenimente Afaceri | Prynt",
    seoDescription: "Promovează evenimente pentru companii.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Networking profesional</h2><p>Flyere cu conferințe și training-uri.</p><ul><li>Conferințe</li><li>Team building</li><li>Seminare</li></ul>`
  },
  "festival": {
    key: "festival",
    title: "Flyere Festivaluri Muzicale",
    shortDescription: "Flyere pentru festivaluri și concerte.",
    seoTitle: "Flyere Festivaluri | Concerte | Prynt",
    seoDescription: "Atrage publicul la evenimente muzicale.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Muzică și distracție</h2><p>Flyere cu lineup și bilete pentru festivaluri.</p><ul><li>Artisti</li><li>Bilete</li><li>Locație</li></ul>`
  },
  "sport": {
    key: "sport",
    title: "Pliante Evenimente Sportive",
    shortDescription: "Broșuri pentru evenimente sportive.",
    seoTitle: "Pliante Sport | Evenimente | Prynt",
    seoDescription: "Promovează competiții și evenimente sportive.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Spirit sportiv</h2><p>Pliante cu informații despre evenimente sportive.</p><ul><li>Competiții</li><li>Antrenamente</li><li>Echipamente</li></ul>`
  },

  // --- EDUCAȚIE ȘI CULTURĂ ---
  "cursuri": {
    key: "cursuri",
    title: "Pliante Cursuri & Training",
    shortDescription: "Broșuri pentru cursuri profesionale.",
    seoTitle: "Pliante Cursuri | Training | Prynt",
    seoDescription: "Prezintă programe de formare profesională.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Dezvoltare profesională</h2><p>Pliante cu cursuri și certificări.</p><ul><li>Cursuri IT</li><li>Limbi străine</li><li>Management</li></ul>`
  },
  "universitate": {
    key: "universitate",
    title: "Flyere Universitate & Admitere",
    shortDescription: "Flyere pentru promovarea universităților.",
    seoTitle: "Flyere Universitate | Admitere | Prynt",
    seoDescription: "Atrage studenți cu informații despre facultăți.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Educație superioară</h2><p>Flyere cu specializări și admitere.</p><ul><li>Facultăți</li><li>Burse</li><li>Cazare</li></ul>`
  },
  "muzeu": {
    key: "muzeu",
    title: "Pliante Muzee & Expoziții",
    shortDescription: "Broșuri pentru muzee și evenimente culturale.",
    seoTitle: "Pliante Muzee | Cultura | Prynt",
    seoDescription: "Prezintă expoziții și evenimente culturale.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Moștenire culturală</h2><p>Pliante cu informații despre artefacte și evenimente.</p><ul><li>Expoziții</li><li>Tururi</li><li>Educație</li></ul>`
  },
  "teatru": {
    key: "teatru",
    title: "Flyere Teatru & Spectacole",
    shortDescription: "Flyere pentru reprezentații teatrale.",
    seoTitle: "Flyere Teatru | Spectacole | Prynt",
    seoDescription: "Promovează piese de teatru și bilete.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Artă scenică</h2><p>Flyere cu programul spectacolelor.</p><ul><li>Repertoriu</li><li>Bilete</li><li>Actori</li></ul>`
  },
  "librarie": {
    key: "librarie",
    title: "Pliante Librărie & Carte",
    shortDescription: "Broșuri pentru evenimente literare.",
    seoTitle: "Pliante Librarie | Carte | Prynt",
    seoDescription: "Promovează cărți și evenimente literare.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Lumea cărților</h2><p>Pliante cu lansări și evenimente literare.</p><ul><li>Cărți noi</li><li>Autori</li><li>Dezbateri</li></ul>`
  },

  // --- TURISM ȘI DIVERTISMENT ---
  "hotel": {
    key: "hotel",
    title: "Pliante Hotel & Cazare",
    shortDescription: "Broșuri pentru hoteluri și pensiuni.",
    seoTitle: "Pliante Hotel | Cazare | Prynt",
    seoDescription: "Prezintă facilitățile și tarifele hotelurilor.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Cazare confortabilă</h2><p>Pliante cu camere și servicii hoteliere.</p><ul><li>Camere</li><li>Facilități</li><li>Tarife</li></ul>`
  },
  "agentie-turism": {
    key: "agentie-turism",
    title: "Flyere Agenție Turism",
    shortDescription: "Flyere pentru pachete turistice.",
    seoTitle: "Flyere Agentie Turism | Vacante | Prynt",
    seoDescription: "Promovează destinații și oferte turistice.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Aventuri turistice</h2><p>Flyere cu circuite și vacanțe.</p><ul><li>Destinații</li><li>Pachete</li><li>Oferte</li></ul>`
  },
  "parc": {
    key: "parc",
    title: "Pliante Parcuri de Distracții",
    shortDescription: "Broșuri pentru parcuri tematice.",
    seoTitle: "Pliante Parcuri | Distractie | Prynt",
    seoDescription: "Atrage familii cu informații despre atracții.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Distracție pentru toți</h2><p>Pliante cu hărți și atracții ale parcului.</p><ul><li>Atracții</li><li>Bilete</li><li>Facilități</li></ul>`
  },
  "zoo": {
    key: "zoo",
    title: "Flyere Zoo & Grădini Zoologice",
    shortDescription: "Flyere pentru vizitarea grădinilor zoologice.",
    seoTitle: "Flyere Zoo | Animale | Prynt",
    seoDescription: "Promovează animale și evenimente la zoo.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Lumea animalelor</h2><p>Flyere cu specii și programe educaționale.</p><ul><li>Animale</li><li>Educație</li><li>Evenimente</li></ul>`
  },
  "cinema": {
    key: "cinema",
    title: "Pliante Cinema & Filme",
    shortDescription: "Broșuri pentru programele cinematografelor.",
    seoTitle: "Pliante Cinema | Filme | Prynt",
    seoDescription: "Prezintă filme și programul sălilor.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Magie cinematografică</h2><p>Pliante cu trailere și orare.</p><ul><li>Filme</li><li>Orare</li><li>Bilete</li></ul>`
  },

  // --- ALTE SERVICII ---
  "avocat": {
    key: "avocat",
    title: "Pliante Cabinet Avocat",
    shortDescription: "Broșuri pentru servicii juridice.",
    seoTitle: "Pliante Avocat | Drept | Prynt",
    seoDescription: "Prezintă specializări și servicii juridice.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Asistență juridică</h2><p>Pliante cu domenii de drept și contact.</p><ul><li>Drept civil</li><li>Penal</li><li>Consultanță</li></ul>`
  },
  "contabil": {
    key: "contabil",
    title: "Flyere Expert Contabil",
    shortDescription: "Flyere pentru servicii contabile.",
    seoTitle: "Flyere Contabil | Finante | Prynt",
    seoDescription: "Promovează servicii de contabilitate.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Finanțe în ordine</h2><p>Flyere cu servicii de contabilitate și fiscalitate.</p><ul><li>Declarații</li><li>Consultanță</li><li>Audite</li></ul>`
  },
  "asigurari": {
    key: "asigurari",
    title: "Pliante Asigurări",
    shortDescription: "Broșuri pentru companii de asigurări.",
    seoTitle: "Pliante Asigurari | Protectie | Prynt",
    seoDescription: "Prezintă polițe și acoperiri de asigurare.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Protecție financiară</h2><p>Pliante cu tipuri de asigurări.</p><ul><li>Auto</li><li>Casă</li><li>Sănătate</li></ul>`
  },
  "banca": {
    key: "banca",
    title: "Flyere Servicii Bancare",
    shortDescription: "Flyere pentru bănci și credite.",
    seoTitle: "Flyere Banca | Credite | Prynt",
    seoDescription: "Promovează produse bancare.",
    images: ["/products/flayere/1.webp"],
    contentHtml: `<h2>Servicii financiare</h2><p>Flyere cu conturi și împrumuturi.</p><ul><li>Conturi</li><li>Credite</li><li>Investiții</li></ul>`
  },
  "fitness": {
    key: "fitness",
    title: "Pliante Sală Fitness",
    shortDescription: "Broșuri pentru centre de fitness.",
    seoTitle: "Pliante Fitness | Sport | Prynt",
    seoDescription: "Prezintă abonamente și echipamente.",
    images: ["/products/pliante/1.webp"],
    contentHtml: `<h2>Sănătate și formă</h2><p>Pliante cu programe de antrenament.</p><ul><li>Abonamente</li><li>Antrenori</li><li>Echipamente</li></ul>`
  }
};