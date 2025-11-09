// lib/landingData.ts
// Extended landing catalog (pliante) for 30 business keywords / niches.
// Each entry contains SEO fields and server-rendered contentHtml (draft).
// Add images under /public/images/landing/ (filenames suggested below).
//
// NOTE:
// - Keys are URL-safe (lowercase, hyphens).
// - This file focuses on "pliante" category for the 30 keywords requested.
// - You can later duplicate/extend entries into other categories (bannere, canvas, afise).

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

export type LandingCatalog = Record<string, Record<string, LandingInfo>>;

// Utility to make simple consistent seoTitle and seoDescription (small helper within file)
function makeSeoTitle(noun: string, product = "Pliante") {
  return `${product} pentru ${noun} | tipărire rapidă & configurator | Prynt`;
}
function makeSeoDescription(noun: string, product = "Pliante") {
  return `${product} pentru ${noun}: modele, tiraj flexibil și configurator live. Alege format, hârtie și finisaje — preț instant.`;
}

// The 30 keywords (url-safe keys are used)
export const LANDING_CATALOG: LandingCatalog = {
  pliante: {
    "frizerie": {
      key: "frizerie",
      title: "Pliante pentru frizerii — modele, prețuri și configurator",
      shortDescription:
        "Pliante profesionale pentru saloane de frizerie: layout optimizat, tiraje flexibile și preț instant în configurator.",
      seoTitle: makeSeoTitle("frizerii"),
      seoDescription: makeSeoDescription("frizerii"),
      images: ["/images/landing/pliante-frizerie-1.jpg"],
      productRouteSlug: "pliante-frizerie",
      contentHtml: `
<h2>Pliante pentru frizerii — atrage clienți local</h2>
<p>Pliantele pentru frizerii sunt proiectate să capteze atenția locală: un layout clar, CTA pentru programări și oferte speciale. Ideal pentru distribuție în zonele cu trafic pietonal sau în vecinătatea salonului.</p>

<h3>Beneficii</h3>
<ul>
  <li>Promovare locală eficientă — atrage clienți noi</li>
  <li>Design optimizat pentru servicii (tuns, styling, vopsit)</li>
  <li>Tiraje flexibile — de la zeci la mii de bucăți</li>
</ul>

<h3>Specificații recomandate</h3>
<p>Formate: A6/A5. Hârtie 115–170 g/mp. Imagini 300 DPI, CMYK, bleed 3 mm.</p>

<h3>Cum comanzi</h3>
<ol>
  <li>Alege formatul și tirajul în configurator.</li>
  <li>Încarcă grafica sau solicită design.</li>
  <li>Confirmă și alege livrare sau ridicare.</li>
</ol>

<h3>FAQ</h3>
<p><strong>Pot comanda tiraje mici?</strong> Da — avem opțiuni pentru tiraje de la câteva zeci de bucăți la producție industrială.</p>
`,
    },

    "salon-coafura": {
      key: "salon-coafura",
      title: "Pliante pentru salon de coafură — oferte și portofoliu",
      shortDescription:
        "Pliante pentru saloane de coafură: afișează pachete, portofoliu și coduri promo pentru fidelizare.",
      seoTitle: makeSeoTitle("salon de coafură"),
      seoDescription: makeSeoDescription("salon de coafură"),
      images: ["/images/landing/pliante-salon-coafura-1.jpg"],
      productRouteSlug: "pliante-salon-coafura",
      contentHtml: `
<h2>Pliante pentru salon de coafură — construiește-ți portofoliul local</h2>
<p>Folosește pliante pentru a promova pachete (ex: tuns + tratament), exemple de lucrări și coduri promo. Un pliant atractiv crește increderea și încurajează programările.</p>

<h3>Sfaturi de design</h3>
<ul>
  <li>Folosește fotografii înainte/după</li>
  <li>CTA clar: "Programează online" sau "Sună acum"</li>
  <li>Include un mic harta/locație pentru orientare</li>
</ul>

<h3>Specificații</h3>
<p>PDF la 300 DPI, culori CMYK, bleed 3mm.</p>
`,
    },

    "barbershop": {
      key: "barbershop",
      title: "Pliante pentru barbershop — pachete și oferte",
      shortDescription:
        "Pliante pentru barbershop: pachete bărbierit+tuns, abonamente și oferte speciale pentru clienți fideli.",
      seoTitle: makeSeoTitle("barbershop"),
      seoDescription: makeSeoDescription("barbershop"),
      images: ["/images/landing/pliante-barbershop-1.jpg"],
      productRouteSlug: "pliante-barbershop",
      contentHtml: `
<h2>Pliante pentru barbershop — fidelizare și oferte</h2>
<p>Pliantul potrivit îți prezintă serviciile, prețurile și abonamentele într‑un mod compact. Ideal pentru distribuție în proximitatea locației sau în evenimente locale.</p>

<h3>Beneficii</h3>
<ul>
  <li>Promovare directă a pachetelor</li>
  <li>Conținut scurt și vizual orientat</li>
  <li>Ușor de distribuit în zone țintă</li>
</ul>
`,
    },

    "salon-manichiura": {
      key: "salon-manichiura",
      title: "Pliante pentru salon de manichiură — pachete și promoții",
      shortDescription:
        "Pliante elegante pentru saloanele de manichiură: pachete spa, oferte combo și carduri de fidelitate integrate.",
      seoTitle: makeSeoTitle("salon manichiură"),
      seoDescription: makeSeoDescription("salon manichiură"),
      images: ["/images/landing/pliante-salon-manichiura-1.jpg"],
      productRouteSlug: "pliante-salon-manichiura",
      contentHtml: `
<h2>Pliante pentru salon de manichiură — aspect profesional</h2>
<p>Materialele și designul contează: alege hârtie fină, imagini de calitate și un layout curat care scoate în evidență oferte și pachete.</p>

<h3>Specificații recomandate</h3>
<p>Formate A6/A5, hârtie 170 g/mp pentru un look premium, 300 DPI imagini.</p>
`,
    },

    "salon-cosmetica": {
      key: "salon-cosmetica",
      title: "Pliante pentru salon cosmetic — tratamente și abonamente",
      shortDescription:
        "Pliante pentru centre cosmetice: pachete de tratamente, abonamente și oferte introductive pentru clienți noi.",
      seoTitle: makeSeoTitle("salon cosmetic"),
      seoDescription: makeSeoDescription("salon cosmetic"),
      images: ["/images/landing/pliante-salon-cosmetica-1.jpg"],
      productRouteSlug: "pliante-salon-cosmetica",
      contentHtml: `
<h2>Pliante pentru salon cosmetic — comunică profesional</h2>
<p>Prezintă serviciile, beneficiile și rezultatele tratamentelor. Folosește imagini clare, texte scurte și un CTA pentru programări.</p>

<h3>FAQ</h3>
<p><strong>Pot include prețuri în pliant?</strong> Da — afișează pachete și oferte pentru a facilita decizia clientului.</p>
`,
    },

    "vulcanizare": {
      key: "vulcanizare",
      title: "Pliante pentru vulcanizări — oferte sezoniere și pachete",
      shortDescription:
        "Pliante pentru vulcanizări: anunță schimburi de anvelope, verificări de sezon și promoții speciale.",
      seoTitle: makeSeoTitle("vulcanizări"),
      seoDescription: makeSeoDescription("vulcanizări"),
      images: ["/images/landing/pliante-vulcanizare-1.jpg"],
      productRouteSlug: "pliante-vulcanizare",
      contentHtml: `
<h2>Pliante pentru vulcanizări — reclame practice</h2>
<p>Pliantele sunt ideale pentru campanii sezoniere: promovări la schimbul de anvelope, verificări sau oferte de service. Mesajul trebuie să fie direct și clar.</p>

<h3>Specificații</h3>
<p>Formate A6/A5, imagini cu echipamente și servicii, text clar cu oferta.</p>
`,
    },

    "service-auto": {
      key: "service-auto",
      title: "Pliante pentru service auto — pachete de întreținere",
      shortDescription:
        "Pliante pentru service auto: pachete de întreținere, diagnostice, oferte pentru clienți noi.",
      seoTitle: makeSeoTitle("service auto"),
      seoDescription: makeSeoDescription("service auto"),
      images: ["/images/landing/pliante-service-auto-1.jpg"],
      productRouteSlug: "pliante-service-auto",
      contentHtml: `
<h2>Pliante pentru service auto — promovează pachetele de întreținere</h2>
<p>Informații despre pachete, tarife orientative și modalitățile de programare cresc încrederea clientului. Pliantele sunt ușor de distribuit în cartier și la parteneri locali.</p>

<h3>Cum construim un pliant eficient</h3>
<ul>
  <li>Afișează pachetele și beneficiile</li>
  <li>Include informații de contact și locație</li>
  <li>Adaugă o ofertă limitată pentru motivare</li>
</ul>
`,
    },

    "spalatorie-auto": {
      key: "spalatorie-auto",
      title: "Pliante pentru spălătorie auto — abonamente și oferte",
      shortDescription:
        "Pliante pentru spălătorii auto: abonamente lunare, pachete de curățare și oferte pentru flote.",
      seoTitle: makeSeoTitle("spălătorie auto"),
      seoDescription: makeSeoDescription("spălătorie auto"),
      images: ["/images/landing/pliante-spalatorie-auto-1.jpg"],
      productRouteSlug: "pliante-spalatorie-auto",
      contentHtml: `
<h2>Pliante pentru spălătorie auto — abonamente și pachete</h2>
<p>Promovează abonamentele lunare și pachetele pentru mașini de serviciu. Folosește un design practicat care pune accent pe prețuri și facilități.</p>

<h3>FAQ</h3>
<p><strong>Se pot adăuga cupoane?</strong> Da — include cod promo în pliant pentru următoarea vizită.</p>
`,
    },

    "pizzerie": {
      key: "pizzerie",
      title: "Pliante pentru pizzerie — meniuri și oferte la domiciliu",
      shortDescription:
        "Pliante pentru pizzerii: meniuri compacte, cu ofertele zilei și coduri promo pentru comenzile la telefon sau online.",
      seoTitle: makeSeoTitle("pizzerie"),
      seoDescription: makeSeoDescription("pizzerie"),
      images: ["/images/landing/pliante-pizzerie-1.jpg"],
      productRouteSlug: "pliante-pizzerie",
      contentHtml: `
<h2>Pliante pentru pizzerie — crește comenzile la domiciliu</h2>
<p>Include meniul principal, promoțiile săptămânale și un cod promo vizibil. Distribuie în zone rezidențiale pentru rezultate bune.</p>

<h3>Specificații</h3>
<p>Alege A5 pentru meniuri detaliate sau A6 pentru flyere promoționale.</p>
`,
    },

    "fast-food": {
      key: "fast-food",
      title: "Pliante pentru fast-food — meniuri și promoții rapide",
      shortDescription:
        "Pliante pentru fast-food: meniuri scurte, oferte combo și cupoane pentru comenzi online sau takeaway.",
      seoTitle: makeSeoTitle("fast-food"),
      seoDescription: makeSeoDescription("fast-food"),
      images: ["/images/landing/pliante-fastfood-1.jpg"],
      productRouteSlug: "pliante-fastfood",
      contentHtml: `
<h2>Pliante pentru fast-food — impulsați comenzile</h2>
<p>Meniuri clare și imagini apetisante sunt cheia. Codurile promo și ofertele combo cresc valoarea medie a comenzii.</p>

<h3>Recomandări</h3>
<ul>
  <li>Format A6 pentru distribuție stradală</li>
  <li>CTA clar: "Comandă acum" și număr/QR pentru comenzi rapide</li>
</ul>
`,
    },

    "shaormerie": {
      key: "shaormerie",
      title: "Pliante pentru shaormerie — meniuri și oferte la pachet",
      shortDescription:
        "Pliante pentru shaormerii: meniuri, combo-uri și oferte pentru livrare sau takeaway.",
      seoTitle: makeSeoTitle("shaormerie"),
      seoDescription: makeSeoDescription("shaormerie"),
      images: ["/images/landing/pliante-shaormerie-1.jpg"],
      productRouteSlug: "pliante-shaormerie",
      contentHtml: `
<h2>Pliante pentru shaormerie — meniuri eficiente</h2>
<p>Pliantele trebuie să prezinte clar meniul, prețurile și oferte combo. Folosește imagini clare și un CTA simplu pentru comenzi.</p>
`,
    },

    "cafenea": {
      key: "cafenea",
      title: "Pliante pentru cafenea — meniuri de cafenea și oferte",
      shortDescription:
        "Pliante pentru cafenele: meniuri sezoniere, oferte de mic dejun și carduri de fidelitate.",
      seoTitle: makeSeoTitle("cafenea"),
      seoDescription: makeSeoDescription("cafenea"),
      images: ["/images/landing/pliante-cafenea-1.jpg"],
      productRouteSlug: "pliante-cafenea",
      contentHtml: `
<h2>Pliante pentru cafenea — meniuri și oferte</h2>
<p>Include meniuri de sezon, oferte la cafea + patiserie și un CTA pentru abonament sau fidelizare. Pliantul poate fi folosit în hoteluri, birouri și zone comerciale.</p>
`,
    },

    "cofetarie": {
      key: "cofetarie",
      title: "Pliante pentru cofetărie — meniuri și torturi personalizate",
      shortDescription:
        "Pliante pentru cofetării: portofoliu de torturi, prețuri orientative și oferte pentru comenzi speciale.",
      seoTitle: makeSeoTitle("cofetărie"),
      seoDescription: makeSeoDescription("cofetărie"),
      images: ["/images/landing/pliante-cofetarie-1.jpg"],
      productRouteSlug: "pliante-cofetarie",
      contentHtml: `
<h2>Pliante pentru cofetărie — transformă vizitatorii în comenzi</h2>
<p>Include imagini cu produsele, dimensiuni și prețuri orientative. Ofertele pentru evenimente speciale (botez, nuntă) pot fi evidențiate.</p>

<h3>Specificații</h3>
<p>Foloseste A5 pentru cataloage scurte sau A6 pentru flyere promoționale.</p>
`,
    },

    "brutarie": {
      key: "brutarie",
      title: "Pliante pentru brutărie — oferte de dimineață și promoții",
      shortDescription:
        "Pliante pentru brutării: oferte la produse de patiserie, meniuri rapide pentru mic dejun și abonamente pentru clienți fideli.",
      seoTitle: makeSeoTitle("brutărie"),
      seoDescription: makeSeoDescription("brutărie"),
      images: ["/images/landing/pliante-brutarie-1.jpg"],
      productRouteSlug: "pliante-brutarie",
      contentHtml: `
<h2>Pliante pentru brutărie — atrage clienți matinali</h2>
<p>Promovează produsele proaspete de dimineață și ofertele combo pentru cafea + produse de patiserie. Include o hartă mică cu locația pentru vizitatorii noi.</p>
`,
    },

    "restaurant": {
      key: "restaurant",
      title: "Pliante pentru restaurant — meniuri și evenimente private",
      shortDescription:
        "Pliante pentru restaurante: meniuri speciale, meniuri de eveniment și oferte pentru grupuri.",
      seoTitle: makeSeoTitle("restaurant"),
      seoDescription: makeSeoDescription("restaurant"),
      images: ["/images/landing/pliante-restaurant-1.jpg"],
      productRouteSlug: "pliante-restaurant",
      contentHtml: `
<h2>Pliante pentru restaurant — prezentare meniuri și evenimente</h2>
<p>Foloseste un pliant pentru meniuri speciale sau oferte de evenimente private. Pliantul poate include pagini cu preparate recomandate și informații de rezervare.</p>
`,
    },

    "bar-bistro": {
      key: "bar-bistro",
      title: "Pliante pentru bar / bistro — meniuri și promoții de seară",
      shortDescription:
        "Pliante pentru baruri și bistro-uri: meniuri de cocktail, promoții de happy hour și evenimente tematice.",
      seoTitle: makeSeoTitle("bar / bistro"),
      seoDescription: makeSeoDescription("bar / bistro"),
      images: ["/images/landing/pliante-bar-bistro-1.jpg"],
      productRouteSlug: "pliante-bar-bistro",
      contentHtml: `
<h2>Pliante pentru bar / bistro — evidențiază evenimentele</h2>
<p>Promovează seri tematice, cockteiluri speciale și meniuri pentru grupuri. Pliantul este ideal pentru distribuție în cartier și la parteneri.</p>
`,
    },

    "hotel-pensiune": {
      key: "hotel-pensiune",
      title: "Pliante pentru hotel / pensiune — servicii și oferte de cazare",
      shortDescription:
        "Pliante pentru hoteluri și pensiuni: pachete de cazare, oferte de sezon și facilități incluse.",
      seoTitle: makeSeoTitle("hotel / pensiune"),
      seoDescription: makeSeoDescription("hotel / pensiune"),
      images: ["/images/landing/pliante-hotel-pensiune-1.jpg"],
      productRouteSlug: "pliante-hotel-pensiune",
      contentHtml: `
<h2>Pliante pentru hotel / pensiune — pachete și facilități</h2>
<p>Prezintă pachetele de cazare, facilitățile incluse (mic dejun, spa, transfer) și informații de rezervare. Include imagini atractive pentru conversii mai bune.</p>
`,
    },

    "showroom-auto": {
      key: "showroom-auto",
      title: "Pliante pentru showroom auto — oferte și promoții modele",
      shortDescription:
        "Pliante pentru showroom-uri auto: prezentări de modele, oferte de leasing și accesoriile disponibile.",
      seoTitle: makeSeoTitle("showroom auto"),
      seoDescription: makeSeoDescription("showroom auto"),
      images: ["/images/landing/pliante-showroom-auto-1.jpg"],
      productRouteSlug: "pliante-showroom-auto",
      contentHtml: `
<h2>Pliante pentru showroom auto — catalog produse</h2>
<p>Prezintă modelele, specificațiile cheie și ofertele de finanțare. Un pliant bine structurat poate susține vânzările la evenimente sau întâlniri cu clienții.</p>
`,
    },

    "agentie-imobiliara": {
      key: "agentie-imobiliara",
      title: "Pliante pentru agenție imobiliară — oferte și prezentări proprietăți",
      shortDescription:
        "Pliante pentru imobiliare: listări proprietăți, date tehnice și contacte pentru programări de vizionare.",
      seoTitle: makeSeoTitle("agenție imobiliară"),
      seoDescription: makeSeoDescription("agenție imobiliară"),
      images: ["/images/landing/pliante-agentie-imobiliara-1.jpg"],
      productRouteSlug: "pliante-agentie-imobiliara",
      contentHtml: `
<h2>Pliante pentru agenție imobiliară — prezintă proprietățile</h2>
<p>Include imagini, schițe și detalii esențiale. Pliantul este util la târguri imobiliare și pentru distribuție locală în zone țintă.</p>
`,
    },

    "florarie": {
      key: "florarie",
      title: "Pliante pentru florărie — buchete și aranjamente",
      shortDescription:
        "Pliante pentru florării: cataloage de buchete, oferte pentru evenimente și promotii de sezon.",
      seoTitle: makeSeoTitle("florărie"),
      seoDescription: makeSeoDescription("florărie"),
      images: ["/images/landing/pliante-florarie-1.jpg"],
      productRouteSlug: "pliante-florarie",
      contentHtml: `
<h2>Pliante pentru florărie — cataloage și oferte</h2>
<p>Include imagini cu buchetele cele mai cerute, oferte pentru evenimente și informații de contact. Folosește culori vii și imagini clare.</p>
`,
    },

    "farmacie": {
      key: "farmacie",
      title: "Pliante pentru farmacie — leaflete informative și oferte",
      shortDescription:
        "Pliante pentru farmacii: leaflete informative, oferte la produse de îngrijire și campanii promoționale.",
      seoTitle: makeSeoTitle("farmacie"),
      seoDescription: makeSeoDescription("farmacie"),
      images: ["/images/landing/pliante-farmacie-1.jpg"],
      productRouteSlug: "pliante-farmacie",
      contentHtml: `
<h2>Pliante pentru farmacie — informare și promoții</h2>
<p>Folosește pliante pentru a informa clienții despre oferte, produse recomandate și programe de fidelitate. Include secțiuni scurte și clare.</p>
`,
    },

    "cabinet-stomatologic": {
      key: "cabinet-stomatologic",
      title: "Pliante pentru cabinet stomatologic — servicii și promoții",
      shortDescription:
        "Pliante pentru cabinete stomatologice: servicii, pachete pentru implantologie și ofertele de igienizare.",
      seoTitle: makeSeoTitle("cabinet stomatologic"),
      seoDescription: makeSeoDescription("cabinet stomatologic"),
      images: ["/images/landing/pliante-cabinet-stomatologic-1.jpg"],
      productRouteSlug: "pliante-cabinet-stomatologic",
      contentHtml: `
<h2>Pliante pentru cabinet stomatologic — încredere și informare</h2>
<p>Prezintă serviciile, echipa și pachetele promoționale. Include date de contact și pași pentru programare.</p>
`,
    },

    "cabinet-medical": {
      key: "cabinet-medical",
      title: "Pliante pentru cabinet medical — servicii și informare pacient",
      shortDescription:
        "Pliante informative pentru cabinete medicale: servicii, programări și instrucțiuni pentru pacienți.",
      seoTitle: makeSeoTitle("cabinet medical"),
      seoDescription: makeSeoDescription("cabinet medical"),
      images: ["/images/landing/pliante-cabinet-medical-1.jpg"],
      productRouteSlug: "pliante-cabinet-medical",
      contentHtml: `
<h2>Pliante pentru cabinet medical — informare pentru pacienți</h2>
<p>Include listă de servicii, indicații pre/post-tratament și date de contact. Pliantul poate conține și o hartă mică cu locația clinicii.</p>
`,
    },

    "sala-fitness": {
      key: "sala-fitness",
      title: "Pliante pentru sală fitness — abonamente și clase",
      shortDescription:
        "Pliante pentru săli de fitness: abonamente, orar clase și oferte de trial pentru noi membri.",
      seoTitle: makeSeoTitle("sală de fitness"),
      seoDescription: makeSeoDescription("sală de fitness"),
      images: ["/images/landing/pliante-sala-fitness-1.jpg"],
      productRouteSlug: "pliante-sala-fitness",
      contentHtml: `
<h2>Pliante pentru sală fitness — crește înscrierile</h2>
<p>Promovează abonamentele, clasele populare (yoga, HIIT) și ofertele de înscriere. Include testimoniale scurte pentru încredere.</p>
`,
    },

    "salon-tatuaje": {
      key: "salon-tatuaje",
      title: "Pliante pentru salon tatuaje — portofoliu și reguli",
      shortDescription:
        "Pliante pentru studiouri de tatuaje: portofoliu, reguli de îngrijire și oferte speciale.",
      seoTitle: makeSeoTitle("salon tatuaje"),
      seoDescription: makeSeoDescription("salon tatuaje"),
      images: ["/images/landing/pliante-salon-tatuaje-1.jpg"],
      productRouteSlug: "pliante-salon-tatuaje",
      contentHtml: `
<h2>Pliante pentru salon tatuaje — portofoliu compact</h2>
<p>Prezintă lucrările, stilurile disponibile și indicații de îngrijire după tatuaj. Pliantul e util la evenimente și expoziții locale.</p>
`,
    },

    "curatatorie": {
      key: "curatatorie",
      title: "Pliante pentru curățătorie — servicii și prețuri",
      shortDescription:
        "Pliante pentru curățătorii: listă de servicii, timp de procesare și opțiuni de preluare/livrare.",
      seoTitle: makeSeoTitle("curățătorie"),
      seoDescription: makeSeoDescription("curățătorie"),
      images: ["/images/landing/pliante-curatatorie-1.jpg"],
      productRouteSlug: "pliante-curatatorie",
      contentHtml: `
<h2>Pliante pentru curățătorie — servicii clare</h2>
<p>Include gama de servicii, timpi estimați și tarife orientative. Adaugă o ofertă specială pentru prima comandă sau pentru clienții fideli.</p>
`,
    },

    "magazin-haine": {
      key: "magazin-haine",
      title: "Pliante pentru magazin de haine — catalog și promoții",
      shortDescription:
        "Pliante pentru retail local: colecții, reduceri sezoniere și oferte pentru membri.",
      seoTitle: makeSeoTitle("magazin haine"),
      seoDescription: makeSeoDescription("magazin haine"),
      images: ["/images/landing/pliante-magazin-haine-1.jpg"],
      productRouteSlug: "pliante-magazin-haine",
      contentHtml: `
<h2>Pliante pentru magazin de haine — colecții și oferte</h2>
<p>Prezintă colecțiile sezonului, reducerile și modalitățile de comandă. Un pliant bine structurat poate genera trafic în magazinul fizic.</p>
`,
    },

    "evenimente": {
      key: "evenimente",
      title: "Pliante pentru evenimente — invitații și programe",
      shortDescription:
        "Pliante pentru evenimente: invitații, programe de desfășurare și informații logistice.",
      seoTitle: makeSeoTitle("evenimente"),
      seoDescription: makeSeoDescription("evenimente"),
      images: ["/images/landing/pliante-evenimente-1.jpg"],
      productRouteSlug: "pliante-evenimente",
      contentHtml: `
<h2>Pliante pentru evenimente — invitații și programe</h2>
<p>Folosește pliante pentru a distribui programe, invitații sau hărți de acces la evenimente. Sunt utile la conferințe, târguri și nunți.</p>
`,
    },

    "catering-foodtruck": {
      key: "catering-foodtruck",
      title: "Pliante pentru catering / food truck — meniuri și oferte",
      shortDescription:
        "Pliante pentru servicii de catering și food truck-uri: meniuri de eveniment, pachete și opțiuni pentru grupuri.",
      seoTitle: makeSeoTitle("catering / food truck"),
      seoDescription: makeSeoDescription("catering / food truck"),
      images: ["/images/landing/pliante-catering-foodtruck-1.jpg"],
      productRouteSlug: "pliante-catering-foodtruck",
      contentHtml: `
<h2>Pliante pentru catering și food truck — meniuri pentru evenimente</h2>
<p>Prezintă pachetele disponibile, porțiile și opțiunile pentru meniuri speciale. Pliantul este util la târguri, festivaluri sau evenimente corporate.</p>
`,
    },

    "service-electrocasnice": {
      key: "service-electrocasnice",
      title: "Pliante pentru service electrocasnice — reparații și oferte",
      shortDescription:
        "Pliante pentru service-uri electrocasnice: servicii de reparații, garanții și prețuri orientative.",
      seoTitle: makeSeoTitle("service electrocasnice"),
      seoDescription: makeSeoDescription("service electrocasnice"),
      images: ["/images/landing/pliante-service-electrocasnice-1.jpg"],
      productRouteSlug: "pliante-service-electrocasnice",
      contentHtml: `
<h2>Pliante pentru service electrocasnice — informare rapidă</h2>
<p>Prezintă tipurile de reparații, timpi de intervenție și informații de contact. Ideal pentru distribuție locală și la parteneri de service.</p>
`,
    },
  },
};

// Helper: list all landing routes for generateStaticParams
export function listAllLandingRoutes() {
  const out: { category: string; slug: string }[] = [];
  Object.keys(LANDING_CATALOG).forEach((category) => {
    Object.keys(LANDING_CATALOG[category]).forEach((slug) => {
      out.push({ category, slug });
    });
  });
  return out;
}