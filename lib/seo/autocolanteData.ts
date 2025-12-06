// lib/seo/autocolanteData.ts
import type { LandingInfo } from "../landingData";

export const AUTOCOLANTE_SEO_DATA: Record<string, LandingInfo> = {
  // --- AUTO & MOTO ---
  "auto": {
    key: "auto",
    title: "Autocolante Auto — Branding & Colantare",
    shortDescription: "Stickere auto rezistente la spălare și UV. De la logo-uri mici la colantare parțială.",
    seoTitle: "Autocolante Auto | Branding Masini & Flote | Prynt",
    seoDescription: "Comandă autocolante auto personalizate. Folie polimerică premium, rezistentă la exterior. Livrare rapidă.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Transformă mașina în reclamă mobilă</h2><p>Cel mai ieftin spațiu publicitar este propria ta mașină. Aplică logo-ul, telefonul și site-ul pe portiere sau lunetă.</p>`
  },
  "taxi": {
    key: "taxi",
    title: "Autocolante TAXI — Tarife & Legislație",
    shortDescription: "Set complet autocolante taxi: tarife, buline, șah, numere autorizație.",
    seoTitle: "Autocolante Taxi | Tarife & Ecusoane | Prynt",
    seoDescription: "Seturi complete de colantare pentru taxi conform legislației locale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Kit complet pentru Taxi</h2><p>Tot ce ai nevoie pentru a intra în legalitate: tarife portiere, numere, indicativ.</p>`
  },
  "uber-bolt": {
    key: "uber-bolt",
    title: "Autocolante Ridesharing — Uber / Bolt / Ecusoane",
    shortDescription: "Ecusoane magnetice sau autocolante 'Conform', 'Copie Conformă' pentru ridesharing.",
    seoTitle: "Autocolante Uber & Bolt | Ridesharing | Prynt",
    seoDescription: "Semnalistică obligatorie pentru mașini de ridesharing. Ecusoane vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Fii vizibil pentru pasageri</h2><p>Ecusoane standardizate pentru platformele de ridesharing.</p>`
  },
  "baby-on-board": {
    key: "baby-on-board",
    title: "Sticker Baby on Board Personalizat",
    shortDescription: "Sticker 'Bebe la Bord' cu numele copilului sau grafică simpatică.",
    seoTitle: "Sticker Baby on Board Personalizat | Prynt",
    seoDescription: "Alege un model unic de Baby on Board. Protejează-ți familia în trafic.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Siguranță cu personalitate</h2><p>Nu folosi un sticker banal. Personalizează-l cu numele micuțului tău.</p>`
  },
  "scoala-soferi": {
    key: "scoala-soferi",
    title: "Autocolante Școala de Șoferi — Casetă & Branding",
    shortDescription: "Branding complet pentru mașini de școală. 'ȘCOALA', telefon, logo.",
    seoTitle: "Autocolante Scoala de Soferi | Casete Taxi | Prynt",
    seoDescription: "Echipează mașinile școlii cu autocolante vizibile și rezistente.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Atrage cursanți din trafic</h2><p>O mașină de școală vizibilă este cea mai bună reclamă pentru instructor.</p>`
  },
  "moto": {
    key: "moto",
    title: "Stickere Moto & ATV — Tuning & Sponsori",
    shortDescription: "Kit-uri de stickere pentru motociclete, căști și ATV-uri. Rezistente la noroi și spălare.",
    seoTitle: "Stickere Moto & ATV | Grafica Personalizata | Prynt",
    seoDescription: "Personalizează-ți motocicleta sau ATV-ul cu stickere de calitate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Stil unic pe 2 sau 4 roți</h2><p>Stickere rezistente la condiții extreme (apă, noroi, soare).</p>`
  },

  // --- VITRINE & SPAȚII COMERCIALE ---
  "vitrina": {
    key: "vitrina",
    title: "Autocolant Vitrină — Decorare & Branding",
    shortDescription: "Colantare integrală sau parțială pentru vitrine. 'Window Graphics' sau decupaj.",
    seoTitle: "Autocolant Vitrina Magazin | Window Graphics | Prynt",
    seoDescription: "Decorează vitrina magazinului. Atrage clienții cu oferte vizibile de la distanță.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Vitrina ta, vânzătorul tău tăcut</h2><p>Folosește vitrina pentru a comunica ofertele și identitatea brandului.</p>`
  },
  "program": {
    key: "program",
    title: "Sticker Program de Funcționare",
    shortDescription: "Sticker obligatoriu cu orarul de funcționare pentru ușa de la intrare.",
    seoTitle: "Sticker Program Functionare | Orar Magazin | Prynt",
    seoDescription: "Comandă sticker cu programul tău. Litere decupate (cut-out) sau print pe fundal alb/transparent.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Informează clienții clar</h2><p>Un program lizibil pe ușa de la intrare este esențial și obligatoriu.</p>`
  },
  "reduceri": {
    key: "reduceri",
    title: "Stickere Reduceri — Sales & Oferte",
    shortDescription: "Stickere temporare: '-50%', 'Lichidare Stoc', 'Black Friday'.",
    seoTitle: "Stickere Reduceri & Soldari | Decor Vitrina | Prynt",
    seoDescription: "Semnalizează campaniile de reduceri. Stickere ușor de aplicat și de dat jos.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Crește traficul în magazin</h2><p>Nimic nu atrage mai bine decât un sticker mare cu '% REDUCERE'.</p>`
  },
  "sarbatori": {
    key: "sarbatori",
    title: "Stickere Decorative Sărbători — Crăciun & Paște",
    shortDescription: "Decor vitrină sezonier: brazi, fulgi, iepurași, ouă.",
    seoTitle: "Stickere Craciun & Paste | Decor Vitrine | Prynt",
    seoDescription: "Pregătește magazinul de sărbătoare cu stickere tematice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Atmosferă festivă</h2><p>Decorează vitrina pentru a intra în spiritul sărbătorilor și a atrage cumpărătorii de cadouri.</p>`
  },
  "floor-graphics": {
    key: "floor-graphics",
    title: "Autocolant Podea (Floor Graphics)",
    shortDescription: "Stickere antiderapante pentru podea. Săgeți, distanțare, reclame.",
    seoTitle: "Autocolant Podea | Floor Graphics Antiderapant | Prynt",
    seoDescription: "Ghidează clienții prin magazin cu stickere de podea rezistente la trafic.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Ghidează pașii clienților</h2><p>Ideal pentru direcționare în supermarketuri, farmacii sau clinici.</p>`
  },

  // --- ETICHETE PRODUSE (HORECA & PRODUCĂTORI) ---
  "etichete-produse": {
    key: "etichete-produse",
    title: "Etichete Produse — Rola sau Coală",
    shortDescription: "Etichete personalizate pentru ambalaje. Orice formă și dimensiune.",
    seoTitle: "Etichete Produse Personalizate | Rola & Coala | Prynt",
    seoDescription: "Etichete autoadezive pentru producători. Print de calitate, decupaj pe contur.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Ambalajul vinde produsul</h2><p>O etichetă profesională crește valoarea percepută a produsului tău artizanal.</p>`
  },
  "etichete-borcane": {
    key: "etichete-borcane",
    title: "Etichete Borcane — Miere, Dulceață, Zacuscă",
    shortDescription: "Etichete rezistente pentru borcane. Design rustic sau modern.",
    seoTitle: "Etichete Borcane Miere & Dulceata | Autocolante | Prynt",
    seoDescription: "Etichete pentru apicultori și producători locali. Rezistente la frigider și manipulare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Pentru bunătăți din cămară</h2><p>Etichete care spun povestea produsului tău natural.</p>`
  },
  "etichete-sticle": {
    key: "etichete-sticle",
    title: "Etichete Sticle — Vin, Suc, Sirop",
    shortDescription: "Etichete pentru sticle de vin, nuntă, sucuri naturale.",
    seoTitle: "Etichete Sticle Vin & Bauturi | Personalizate | Prynt",
    seoDescription: "Personalizează sticlele pentru evenimente sau vânzare. Autocolant rezistent la condens.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Etichete premium pentru băuturi</h2><p>Fie că e vorba de un vin de colecție sau un suc fresh, eticheta contează.</p>`
  },
  "delivery": {
    key: "delivery",
    title: "Etichete Delivery & Sigiliu",
    shortDescription: "Etichete 'Sigiliu de Siguranță' pentru pungi delivery, cutii pizza.",
    seoTitle: "Etichete Delivery & Sigiliu Mancare | Prynt",
    seoDescription: "Asigură clienții că mâncarea a ajuns intactă. Etichete sigiliu personalizate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Siguranța alimentară contează</h2><p>Sigilează pungile de livrare cu un sticker personalizat cu brandul tău.</p>`
  },
  "marturii": {
    key: "marturii",
    title: "Etichete Mărturii Nuntă & Botez",
    shortDescription: "Stickere mici rotunde/pătrate cu numele mirilor și data.",
    seoTitle: "Etichete Marturii Nunta & Botez | Sticker Rotund | Prynt",
    seoDescription: "Personalizează mărturiile dulci sau cadourile pentru invitați.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Un detaliu mic, o amintire plăcută</h2><p>Etichetează borcănelele cu miere sau cutiile de prăjituri.</p>`
  },

  // --- SEMNALISTICĂ & PROTECȚIA MUNCII ---
  "ssm": {
    key: "ssm",
    title: "Autocolante SSM & Protecția Muncii",
    shortDescription: "Semne obligatorii: 'Stingător', 'Ieșire Urgență', 'Pericol Electrocutare'.",
    seoTitle: "Autocolante SSM & Protectia Muncii | Semne Obligatorii | Prynt",
    seoDescription: "Intră în legalitate cu setul complet de etichete SSM. Rezistente și vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Semnalizare obligatorie conform legii</h2><p>Nu risca amenzi. Marchează corect stingătoarele, ieșirile și pericolele.</p>`
  },
  "supraveghere-video": {
    key: "supraveghere-video",
    title: "Sticker Supraveghere Video (CCTV)",
    shortDescription: "Sticker 'Atenție! Obiectiv supravegheat video' conform GDPR.",
    seoTitle: "Sticker Supraveghere Video & CCTV | GDPR | Prynt",
    seoDescription: "Obligatoriu pentru spațiile monitorizate. Sticker rezistent exterior.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Respectă normele GDPR</h2><p>Semnalizează camerele de supraveghere la intrarea în incintă.</p>`
  },
  "interzis-fumatul": {
    key: "interzis-fumatul",
    title: "Sticker Fumatul Interzis",
    shortDescription: "Semn internațional 'Fumatul Interzis' sau loc pentru fumat.",
    seoTitle: "Sticker Interzis Fumatul | Semnalistica | Prynt",
    seoDescription: "Semnalizează zonele non-smoking din instituții și restaurante.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Reguli clare</h2><p>Evită neînțelegerile cu un semn clar de interzicere.</p>`
  },
  "toaleta": {
    key: "toaleta",
    title: "Stickere Toaletă — WC Femei/Bărbați",
    shortDescription: "Semnalizare uși toaletă. Pictograme clasice sau amuzante.",
    seoTitle: "Stickere Toaleta & WC | Semnalistica Usi | Prynt",
    seoDescription: "Ghidează clienții către grupurile sanitare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Semnalizare esențială</h2><p>Pentru restaurante, birouri și spații publice.</p>`
  },
  "reciclare": {
    key: "reciclare",
    title: "Etichete Colectare Selectivă — Reciclare",
    shortDescription: "Stickere pentru coșuri de gunoi: Hârtie, Plastic, Sticlă, Menajer.",
    seoTitle: "Etichete Reciclare & Colectare Selectiva | Prynt",
    seoDescription: "Organizează reciclarea la birou sau acasă cu etichete colorate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Protejează mediul</h2><p>Etichetează clar recipientele pentru o colectare eficientă.</p>`
  },

  // --- DECORATIV & HOME ---
  "perete": {
    key: "perete",
    title: "Stickere Perete & Tapet Autocolant",
    shortDescription: "Autocolante decorative pentru living, dormitor sau birou. Citate, forme, modele.",
    seoTitle: "Stickere Perete Decorative | Wall Art | Prynt",
    seoDescription: "Schimbă aspectul camerei rapid cu stickere de perete. Ușor de aplicat.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Design interior DIY</h2><p>Adaugă un accent de culoare sau un mesaj motivațional pe perete.</p>`
  },
  "mobila": {
    key: "mobila",
    title: "Autocolant Mobilă — Recondiționare",
    shortDescription: "Folie autocolantă pentru uși, dulapuri, bucătărie. Imitație lemn, marmură, uni.",
    seoTitle: "Autocolant Mobila & Usi | Reconditionare | Prynt",
    seoDescription: "Dă o viață nouă mobilei vechi. Autocolant gros, lavabil.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Renovare fără praf</h2><p>Colantează fronturile de la bucătărie sau ușile vechi pentru un look modern.</p>`
  },
  "camera-copii": {
    key: "camera-copii",
    title: "Stickere Cameră Copii — Personaje & Animale",
    shortDescription: "Decor vesel pentru cei mici. Animăluțe, stele, metru de perete.",
    seoTitle: "Stickere Camera Copii & Bebe | Decor | Prynt",
    seoDescription: "Transformă camera copilului într-o lume de poveste.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>O lume de basm</h2><p>Stickere sigure, non-toxice, care nu strică peretele.</p>`
  },
  "laptop": {
    key: "laptop",
    title: "Stickere Laptop & Gadgets",
    shortDescription: "Stickere mici, cool, pentru laptopuri, telefoane, căști. Skin-uri complete.",
    seoTitle: "Stickere Laptop & Skinuri | Personalizate | Prynt",
    seoDescription: "Personalizează-ți gadgeturile. Stickere rezistente la uzură.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Tech cu stil</h2><p>Arată-ți personalitatea prin stickerele de pe laptop.</p>`
  },

  // --- MAI MULTE AUTO & MOTO ---
  "bmw": {
    key: "bmw",
    title: "Stickere BMW — Logo & Branding",
    shortDescription: "Autocolante oficiale sau personalizate pentru BMW. Rezistente la spălare.",
    seoTitle: "Stickere BMW | Logo Masina | Prynt",
    seoDescription: "Arată-ți pasiunea pentru BMW cu stickere de calitate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>BMW-ul tău strălucește</h2><p>Stickere pentru iubitorii de BMW.</p><p>Culori oficiale. Print de înaltă rezoluție.</p><ul><li>Rezistente la vreme</li><li>Design premium</li><li>Livrare rapidă</li></ul>`
  },
  "audi": {
    key: "audi",
    title: "Autocolante Audi — Embleme & Personalizare",
    shortDescription: "Stickere pentru Audi: logo, numere, grafică custom.",
    seoTitle: "Stickere Audi | Embleme Masina | Prynt",
    seoDescription: "Personalizează Audi-ul tău cu stickere elegante.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Eleganță pe 4 roți</h2><p>Stickere pentru Audi.</p><p>Culori argintii. Rezistente la spălare.</p><ul><li>Design elegant</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "mercedes": {
    key: "mercedes",
    title: "Stickere Mercedes — Stea & Branding",
    shortDescription: "Autocolante cu steaua Mercedes pentru portiere sau lunetă.",
    seoTitle: "Stickere Mercedes | Stea Masina | Prynt",
    seoDescription: "Arată clasa Mercedes cu stickere de lux.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Lux pe șosea</h2><p>Stickere pentru Mercedes.</p><p>Culori clasice. Rezistente la UV.</p><ul><li>Design luxos</li><li>Hârtie rezistentă</li><li>Livrare premium</li></ul>`
  },
  "volkswagen": {
    key: "volkswagen",
    title: "Autocolante Volkswagen — Beetle & Logo",
    shortDescription: "Stickere pentru VW: gândac, logo, personalizare.",
    seoTitle: "Stickere Volkswagen | Logo VW | Prynt",
    seoDescription: "Personalizează VW-ul tău cu stickere distractive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Spirit VW</h2><p>Stickere pentru Volkswagen.</p><p>Culori vii. Print de calitate.</p><ul><li>Design distractiv</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "ford": {
    key: "ford",
    title: "Stickere Ford — Oval & Branding",
    shortDescription: "Autocolante cu ovalul Ford pentru mașini.",
    seoTitle: "Stickere Ford | Oval Masina | Prynt",
    seoDescription: "Arată puterea Ford cu stickere robuste.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Putere americană</h2><p>Stickere pentru Ford.</p><p>Culori albastre. Rezistente la vreme.</p><ul><li>Design puternic</li><li>Hârtie durabilă</li><li>Print de calitate</li></ul>`
  },
  "renault": {
    key: "renault",
    title: "Autocolante Renault — Diamant & Logo",
    shortDescription: "Stickere cu diamantul Renault pentru portiere.",
    seoTitle: "Stickere Renault | Diamant Masina | Prynt",
    seoDescription: "Personalizează Renault-ul tău cu stickere moderne.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Modernitate franceză</h2><p>Stickere pentru Renault.</p><p>Culori moderne. Rezistente la spălare.</p><ul><li>Design modern</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "dacia": {
    key: "dacia",
    title: "Stickere Dacia — Logo Românesc",
    shortDescription: "Autocolante pentru Dacia: logo, personalizare românească.",
    seoTitle: "Stickere Dacia | Logo Romanesc | Prynt",
    seoDescription: "Arată mândria românească cu stickere Dacia.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Mândrie românească</h2><p>Stickere pentru Dacia.</p><p>Culori naționale. Rezistente la vreme.</p><ul><li>Design patriotic</li><li>Hârtie rezistentă</li><li>Print de calitate</li></ul>`
  },
  "opel": {
    key: "opel",
    title: "Autocolante Opel — Fulger & Branding",
    shortDescription: "Stickere cu fulgerul Opel pentru mașini.",
    seoTitle: "Stickere Opel | Fulger Masina | Prynt",
    seoDescription: "Personalizează Opel-ul tău cu stickere dinamice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Dinamic pe șosea</h2><p>Stickere pentru Opel.</p><p>Culori dinamice. Rezistente la UV.</p><ul><li>Design energetic</li><li>Hârtie durabilă</li><li>Livrare rapidă</li></ul>`
  },
  "peugeot": {
    key: "peugeot",
    title: "Stickere Peugeot — Leu & Logo",
    shortDescription: "Autocolante cu leul Peugeot pentru portiere.",
    seoTitle: "Stickere Peugeot | Leu Masina | Prynt",
    seoDescription: "Arată forța Peugeot cu stickere elegante.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Forță franceză</h2><p>Stickere pentru Peugeot.</p><p>Culori elegante. Rezistente la spălare.</p><ul><li>Design puternic</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "citroen": {
    key: "citroen",
    title: "Autocolante Citroën — Chevron & Branding",
    shortDescription: "Stickere cu chevronul Citroën pentru mașini.",
    seoTitle: "Stickere Citroen | Chevron Masina | Prynt",
    seoDescription: "Personalizează Citroën-ul tău cu stickere inovative.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Inovație pe roți</h2><p>Stickere pentru Citroën.</p><p>Culori inovative. Rezistente la vreme.</p><ul><li>Design creativ</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "fiat": {
    key: "fiat",
    title: "Stickere Fiat — Logo Italian",
    shortDescription: "Autocolante pentru Fiat: logo, personalizare italiană.",
    seoTitle: "Stickere Fiat | Logo Italian | Prynt",
    seoDescription: "Arată stilul italian cu stickere Fiat.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Stil italian</h2><p>Stickere pentru Fiat.</p><p>Culori vii. Rezistente la spălare.</p><ul><li>Design italian</li><li>Hârtie premium</li><li>Print de calitate</li></ul>`
  },
  "skoda": {
    key: "skoda",
    title: "Autocolante Škoda — Săgeată & Branding",
    shortDescription: "Stickere cu săgeata Škoda pentru portiere.",
    seoTitle: "Stickere Skoda | Sageata Masina | Prynt",
    seoDescription: "Personalizează Škoda-ul tău cu stickere precise.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Precizie cehă</h2><p>Stickere pentru Škoda.</p><p>Culori precise. Rezistente la UV.</p><ul><li>Design precis</li><li>Hârtie durabilă</li><li>Livrare rapidă</li></ul>`
  },
  "toyota": {
    key: "toyota",
    title: "Stickere Toyota — Logo Japonez",
    shortDescription: "Autocolante pentru Toyota: logo, personalizare japoneză.",
    seoTitle: "Stickere Toyota | Logo Japonez | Prynt",
    seoDescription: "Arată fiabilitatea Toyota cu stickere de calitate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Fiabilitate japoneză</h2><p>Stickere pentru Toyota.</p><p>Culori fiabile. Rezistente la vreme.</p><ul><li>Design fiabil</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "honda": {
    key: "honda",
    title: "Autocolante Honda — H & Branding",
    shortDescription: "Stickere cu H-ul Honda pentru mașini.",
    seoTitle: "Stickere Honda | H Masina | Prynt",
    seoDescription: "Personalizează Honda-ul tău cu stickere atletice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Atletism japonez</h2><p>Stickere pentru Honda.</p><p>Culori atletice. Rezistente la spălare.</p><ul><li>Design sportiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "nissan": {
    key: "nissan",
    title: "Stickere Nissan — Logo Japonez",
    shortDescription: "Autocolante pentru Nissan: logo, personalizare inovativă.",
    seoTitle: "Stickere Nissan | Logo Japonez | Prynt",
    seoDescription: "Arată inovația Nissan cu stickere moderne.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Inovație japoneză</h2><p>Stickere pentru Nissan.</p><p>Culori moderne. Rezistente la UV.</p><ul><li>Design inovativ</li><li>Hârtie durabilă</li><li>Print de calitate</li></ul>`
  },
  "hyundai": {
    key: "hyundai",
    title: "Autocolante Hyundai — H & Branding",
    shortDescription: "Stickere cu H-ul Hyundai pentru portiere.",
    seoTitle: "Stickere Hyundai | H Masina | Prynt",
    seoDescription: "Personalizează Hyundai-ul tău cu stickere coreene.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Spirit coreean</h2><p>Stickere pentru Hyundai.</p><p>Culori coreene. Rezistente la vreme.</p><ul><li>Design modern</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "kia": {
    key: "kia",
    title: "Stickere Kia — Logo Coreean",
    shortDescription: "Autocolante pentru Kia: logo, personalizare coreeană.",
    seoTitle: "Stickere Kia | Logo Coreean | Prynt",
    seoDescription: "Arată designul Kia cu stickere elegante.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Design coreean</h2><p>Stickere pentru Kia.</p><p>Culori elegante. Rezistente la spălare.</p><ul><li>Design elegant</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "volvo": {
    key: "volvo",
    title: "Autocolante Volvo — Grilă & Branding",
    shortDescription: "Stickere cu grila Volvo pentru mașini sigure.",
    seoTitle: "Stickere Volvo | Grila Masina | Prynt",
    seoDescription: "Arată siguranța Volvo cu stickere robuste.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Siguranță suedeză</h2><p>Stickere pentru Volvo.</p><p>Culori sigure. Rezistente la UV.</p><ul><li>Design sigur</li><li>Hârtie durabilă</li><li>Livrare premium</li></ul>`
  },
  "tesla": {
    key: "tesla",
    title: "Stickere Tesla — Logo Electric",
    shortDescription: "Autocolante pentru Tesla: logo, personalizare electrică.",
    seoTitle: "Stickere Tesla | Logo Electric | Prynt",
    seoDescription: "Arată viitorul cu stickere Tesla inovative.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Viitor electric</h2><p>Stickere pentru Tesla.</p><p>Culori futuriste. Rezistente la vreme.</p><ul><li>Design inovativ</li><li>Hârtie premium</li><li>Print de calitate</li></ul>`
  },
  "custom-auto": {
    key: "custom-auto",
    title: "Stickere Auto Personalizate — Design Unic",
    shortDescription: "Autocolante custom pentru mașini: nume, grafică, logo personal.",
    seoTitle: "Stickere Auto Personalizate | Design Unic | Prynt",
    seoDescription: "Creează stickere unice pentru mașina ta.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Unic pe șosea</h2><p>Stickere personalizate pentru auto.</p><p>Design unic. Rezistente la spălare.</p><ul><li>Personalizare completă</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "numere-auto": {
    key: "numere-auto",
    title: "Stickere Numere Auto — Plăcuțe Personalizate",
    shortDescription: "Autocolante cu numere personalizate pentru mașini.",
    seoTitle: "Stickere Numere Auto | Placute Personalizate | Prynt",
    seoDescription: "Adaugă numere cool pe mașina ta.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Numere cool</h2><p>Stickere pentru numere auto.</p><p>Culori vii. Rezistente la vreme.</p><ul><li>Design distractiv</li><li>Hârtie durabilă</li><li>Print profesional</li></ul>`
  },
  "parcare": {
    key: "parcare",
    title: "Stickere Parcare — Rezervat & Handicap",
    shortDescription: "Autocolante pentru locuri de parcare: rezervat, handicap.",
    seoTitle: "Stickere Parcare | Rezervat Handicap | Prynt",
    seoDescription: "Semnalizează parcarea cu stickere oficiale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Parcare sigură</h2><p>Stickere pentru locuri rezervate.</p><p>Culori vizibile. Rezistente la vreme.</p><ul><li>Design oficial</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "ecusoane-politie": {
    key: "ecusoane-politie",
    title: "Ecusoane Poliție — Autocolante Oficiale",
    shortDescription: "Stickere pentru mașini de poliție: logo, numere.",
    seoTitle: "Ecusoane Politie | Autocolante Oficiale | Prynt",
    seoDescription: "Echipează mașinile de poliție cu ecusoane vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Autoritate vizibilă</h2><p>Ecusoane pentru poliție.</p><p>Culori oficiale. Rezistente la vreme.</p><ul><li>Design oficial</li><li>Hârtie durabilă</li><li>Print profesional</li></ul>`
  },
  "ambulanta": {
    key: "ambulanta",
    title: "Stickere Ambulanță — Semnalizare Medicală",
    shortDescription: "Autocolante pentru ambulanțe: cruci roșii, logo.",
    seoTitle: "Stickere Ambulanta | Semnalizare Medicala | Prynt",
    seoDescription: "Semnalizează ambulanțele cu stickere vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Urgență medicală</h2><p>Stickere pentru ambulanțe.</p><p>Culori roșii. Rezistente la vreme.</p><ul><li>Design urgent</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "pompieri": {
    key: "pompieri",
    title: "Autocolante Pompieri — Logo & Branding",
    shortDescription: "Stickere pentru mașini de pompieri: logo, numere.",
    seoTitle: "Autocolante Pompieri | Logo Masina | Prynt",
    seoDescription: "Echipează mașinile de pompieri cu stickere vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Eroi vizibili</h2><p>Stickere pentru pompieri.</p><p>Culori roșii. Rezistente la vreme.</p><ul><li>Design eroic</li><li>Hârtie durabilă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE BUSINESS & BRANDING ---
  "logo-firma": {
    key: "logo-firma",
    title: "Stickere Logo Firmă — Branding Corporate",
    shortDescription: "Autocolante cu logo-ul firmei pentru mașini, uși, produse.",
    seoTitle: "Stickere Logo Firma | Branding Corporate | Prynt",
    seoDescription: "Promovează firma cu stickere de logo vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Logo vizibil</h2><p>Stickere pentru branding firmă.</p><p>Culori corporate. Rezistente la vreme.</p><ul><li>Design profesional</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "qr-code": {
    key: "qr-code",
    title: "Stickere QR Code — Digital Marketing",
    shortDescription: "Autocolante cu coduri QR pentru site, meniu, contact.",
    seoTitle: "Stickere QR Code | Marketing Digital | Prynt",
    seoDescription: "Conectează offline cu online prin QR codes.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Conectare digitală</h2><p>Stickere cu QR codes.</p><p>Culori contrastante. Rezistente la uzură.</p><ul><li>Design scanabil</li><li>Hârtie durabilă</li><li>Print de calitate</li></ul>`
  },
  "slogan": {
    key: "slogan",
    title: "Stickere Slogan — Mesaje Motivante",
    shortDescription: "Autocolante cu slogane pentru mașini sau birouri.",
    seoTitle: "Stickere Slogan | Mesaje Motivante | Prynt",
    seoDescription: "Transmite mesaje cu stickere catchy.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Mesaje puternice</h2><p>Stickere cu slogane.</p><p>Culori vii. Rezistente la vreme.</p><ul><li>Design motivant</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "nume-firma": {
    key: "nume-firma",
    title: "Stickere Nume Firmă — Identitate Vizuală",
    shortDescription: "Autocolante cu numele firmei pentru branding.",
    seoTitle: "Stickere Nume Firma | Identitate Vizuala | Prynt",
    seoDescription: "Arată numele firmei cu stickere clare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Nume vizibil</h2><p>Stickere pentru nume firmă.</p><p>Culori corporate. Rezistente la uzură.</p><ul><li>Design clar</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "contact": {
    key: "contact",
    title: "Stickere Contact — Telefon & Email",
    shortDescription: "Autocolante cu date de contact pentru mașini sau produse.",
    seoTitle: "Stickere Contact | Telefon Email | Prynt",
    seoDescription: "Facilitează contactul cu stickere informative.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Contact ușor</h2><p>Stickere cu date de contact.</p><p>Culori vizibile. Rezistente la vreme.</p><ul><li>Design informativ</li><li>Hârtie durabilă</li><li>Livrare rapidă</li></ul>`
  },
  "preturi": {
    key: "preturi",
    title: "Stickere Prețuri — Etichete Promoționale",
    shortDescription: "Autocolante cu prețuri pentru rafturi sau vitrine.",
    seoTitle: "Stickere Preturi | Etichete Promotionale | Prynt",
    seoDescription: "Afișează prețuri cu stickere clare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Prețuri vizibile</h2><p>Stickere pentru prețuri.</p><p>Culori contrastante. Rezistente la manipulare.</p><ul><li>Design clar</li><li>Hârtie rezistentă</li><li>Print economic</li></ul>`
  },
  "reclama": {
    key: "reclama",
    title: "Stickere Reclamă — Promovare Produse",
    shortDescription: "Autocolante pentru promovarea produselor sau serviciilor.",
    seoTitle: "Stickere Reclama | Promovare Produse | Prynt",
    seoDescription: "Promovează cu stickere atractive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Reclamă vizibilă</h2><p>Stickere pentru promovare.</p><p>Culori vii. Rezistente la vreme.</p><ul><li>Design atractiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },

  // --- MAI MULTE EVENIMENTE ---
  "petrecere": {
    key: "petrecere",
    title: "Stickere Petrecere — Invitații & Decor",
    shortDescription: "Autocolante pentru petreceri: invitații, decor mese.",
    seoTitle: "Stickere Petrecere | Invitatii Decor | Prynt",
    seoDescription: "Decorează petrecerea cu stickere distractive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Petrecere distractivă</h2><p>Stickere pentru evenimente.</p><p>Culori festive. Rezistente la apă.</p><ul><li>Design vesel</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "nunta": {
    key: "nunta",
    title: "Stickere Nuntă — Decor & Personalizare",
    shortDescription: "Autocolante pentru nunți: mese, cadouri, invitații.",
    seoTitle: "Stickere Nunta | Decor Personalizare | Prynt",
    seoDescription: "Personalizează nunta cu stickere romantice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Nuntă romantică</h2><p>Stickere pentru evenimente speciale.</p><p>Culori pastel. Rezistente la uzură.</p><ul><li>Design romantic</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "botez": {
    key: "botez",
    title: "Stickere Botez — Decor Religios",
    shortDescription: "Autocolante pentru botezuri: mese, cadouri.",
    seoTitle: "Stickere Botez | Decor Religios | Prynt",
    seoDescription: "Decorează botezul cu stickere spirituale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Botez spiritual</h2><p>Stickere pentru evenimente religioase.</p><p>Culori calde. Rezistente la apă.</p><ul><li>Design spiritual</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "aniversare": {
    key: "aniversare",
    title: "Stickere Aniversare — Decor & Cadouri",
    shortDescription: "Autocolante pentru aniversări: mese, torturi.",
    seoTitle: "Stickere Aniversare | Decor Cadouri | Prynt",
    seoDescription: "Sărbătorește aniversarea cu stickere colorate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Aniversare fericită</h2><p>Stickere pentru sărbători personale.</p><p>Culori vii. Rezistente la manipulare.</p><ul><li>Design vesel</li><li>Hârtie premium</li><li>Print rapid</li></ul>`
  },
  "ziua-copiilor": {
    key: "ziua-copiilor",
    title: "Stickere Ziua Copiilor — Decor & Activități",
    shortDescription: "Autocolante pentru evenimente dedicate copiilor.",
    seoTitle: "Stickere Ziua Copiilor | Decor Activitati | Prynt",
    seoDescription: "Distrați copiii cu stickere colorate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Copii fericiți</h2><p>Stickere pentru evenimente familiale.</p><p>Culori primare. Rezistente la apă.</p><ul><li>Design distractiv</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "halloween": {
    key: "halloween",
    title: "Stickere Halloween — Decor Înfricoșător",
    shortDescription: "Autocolante pentru Halloween: fantome, dovleci.",
    seoTitle: "Stickere Halloween | Decor Infricosator | Prynt",
    seoDescription: "Sperie cu stickere de Halloween.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Halloween înfricoșător</h2><p>Stickere pentru sărbători de groază.</p><p>Culori întunecate. Rezistente la vreme.</p><ul><li>Design horror</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "craciun": {
    key: "craciun",
    title: "Stickere Crăciun — Decor Festiv",
    shortDescription: "Autocolante pentru Crăciun: brazi, fulgi.",
    seoTitle: "Stickere Craciun | Decor Festiv | Prynt",
    seoDescription: "Decorează Crăciunul cu stickere festive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Crăciun magic</h2><p>Stickere pentru sărbători de iarnă.</p><p>Culori festive. Rezistente la frig.</p><ul><li>Design magic</li><li>Hârtie rezistentă</li><li>Livrare sezonieră</li></ul>`
  },
  "paste": {
    key: "paste",
    title: "Stickere Paște — Decor Tradițional",
    shortDescription: "Autocolante pentru Paște: ouă, iepurași.",
    seoTitle: "Stickere Paste | Decor Traditional | Prynt",
    seoDescription: "Sărbătorește Paștele cu stickere tradiționale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Paște tradițional</h2><p>Stickere pentru sărbători religioase.</p><p>Culori pastel. Rezistente la apă.</p><ul><li>Design tradițional</li><li>Hârtie premium</li><li>Print rapid</li></ul>`
  },
  "revelion": {
    key: "revelion",
    title: "Stickere Revelion — Decor An Nou",
    shortDescription: "Autocolante pentru Revelion: confetti, stele.",
    seoTitle: "Stickere Revelion | Decor An Nou | Prynt",
    seoDescription: "Bucură-te de Anul Nou cu stickere festive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Revelion strălucitor</h2><p>Stickere pentru sărbători de sfârșit de an.</p><p>Culori aurii. Rezistente la frig.</p><ul><li>Design strălucitor</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "valentine": {
    key: "valentine",
    title: "Stickere Valentine — Decor Romantic",
    shortDescription: "Autocolante pentru Ziua Îndrăgostiților: inimi, trandafiri.",
    seoTitle: "Stickere Valentine | Decor Romantic | Prynt",
    seoDescription: "Exprimă iubirea cu stickere romantice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Iubire eternă</h2><p>Stickere pentru sărbători romantice.</p><p>Culori roșii. Rezistente la uzură.</p><ul><li>Design romantic</li><li>Hârtie premium</li><li>Print profesional</li></ul>`
  },
  "martisor": {
    key: "martisor",
    title: "Stickere Mărțișor — Decor Tradițional",
    shortDescription: "Autocolante pentru Mărțișor: alb și roșu.",
    seoTitle: "Stickere Martisor | Decor Traditional | Prynt",
    seoDescription: "Sărbătorește tradiția cu stickere colorate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Mărțișor tradițional</h2><p>Stickere pentru sărbători populare.</p><p>Culori tradiționale. Rezistente la vreme.</p><ul><li>Design cultural</li><li>Hârtie rezistentă</li><li>Livrare rapidă</li></ul>`
  },
  "ziua-mamei": {
    key: "ziua-mamei",
    title: "Stickere Ziua Mamei — Decor Afectuos",
    shortDescription: "Autocolante pentru Ziua Mamei: flori, inimi.",
    seoTitle: "Stickere Ziua Mamei | Decor Afectuos | Prynt",
    seoDescription: "Cinstește mamele cu stickere afectuoase.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Mamă iubită</h2><p>Stickere pentru sărbători familiale.</p><p>Culori pastel. Rezistente la apă.</p><ul><li>Design afectuos</li><li>Hârtie premium</li><li>Print rapid</li></ul>`
  },
  "ziua-tatalui": {
    key: "ziua-tatalui",
    title: "Stickere Ziua Tatălui — Decor Puternic",
    shortDescription: "Autocolante pentru Ziua Tatălui: unelte, mașini.",
    seoTitle: "Stickere Ziua Tatalui | Decor Puternic | Prynt",
    seoDescription: "Sărbătorește tații cu stickere puternice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Tată puternic</h2><p>Stickere pentru sărbători masculine.</p><p>Culori închise. Rezistente la uzură.</p><ul><li>Design puternic</li><li>Hârtie durabilă</li><li>Livrare rapidă</li></ul>`
  },
  "ziua-nationala": {
    key: "ziua-nationala",
    title: "Stickere Ziua Națională — Decor Patriotic",
    shortDescription: "Autocolante pentru Ziua Națională: tricolor, simboluri.",
    seoTitle: "Stickere Ziua Nationala | Decor Patriotic | Prynt",
    seoDescription: "Cinstește țara cu stickere naționale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Ziua națională</h2><p>Stickere pentru sărbători oficiale.</p><p>Culori naționale. Rezistente la vreme.</p><ul><li>Design patriotic</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE EDUCAȚIE ---
  "scoala": {
    key: "scoala",
    title: "Stickere Școală — Etichete & Decor",
    shortDescription: "Autocolante pentru școli: nume, clase, decor.",
    seoTitle: "Stickere Scoala | Etichete Decor | Prynt",
    seoDescription: "Organizează școala cu stickere utile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Școală organizată</h2><p>Stickere pentru educație.</p><p>Culori vii. Rezistente la manipulare.</p><ul><li>Design educativ</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "universitate": {
    key: "universitate",
    title: "Stickere Universitate — Branding Academic",
    shortDescription: "Autocolante pentru universități: logo, facultăți.",
    seoTitle: "Stickere Universitate | Branding Academic | Prynt",
    seoDescription: "Promovează universitatea cu stickere prestigioase.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Universitate prestigioasă</h2><p>Stickere pentru instituții academice.</p><p>Culori instituționale. Rezistente la uzură.</p><ul><li>Design academic</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "meditatii": {
    key: "meditatii",
    title: "Stickere Meditații — Etichete Materii",
    shortDescription: "Autocolante pentru centre de meditații: materii, prețuri.",
    seoTitle: "Stickere Meditatii | Etichete Materii | Prynt",
    seoDescription: "Atrage elevi cu stickere informative.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Meditații eficiente</h2><p>Stickere pentru ajutor școlar.</p><p>Culori motivate. Rezistente la apă.</p><ul><li>Design motivant</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "cursuri": {
    key: "cursuri",
    title: "Stickere Cursuri — Branding Educațional",
    shortDescription: "Autocolante pentru cursuri: nume, date, logo.",
    seoTitle: "Stickere Cursuri | Branding Educational | Prynt",
    seoDescription: "Promovează cursurile cu stickere atractive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Cursuri populare</h2><p>Stickere pentru educație continuă.</p><p>Culori vii. Rezistente la uzură.</p><ul><li>Design atractiv</li><li>Hârtie rezistentă</li><li>Print rapid</li></ul>`
  },
  "examene": {
    key: "examene",
    title: "Stickere Examene — Etichete Motivante",
    shortDescription: "Autocolante pentru pregătire examene: citate, planuri.",
    seoTitle: "Stickere Examene | Etichete Motivante | Prynt",
    seoDescription: "Motivați studenții cu stickere pozitive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Examene de succes</h2><p>Stickere pentru studiu.</p><p>Culori motivate. Rezistente la manipulare.</p><ul><li>Design pozitiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },

  // --- MAI MULTE SĂNĂTATE ---
  "medic": {
    key: "medic",
    title: "Stickere Medic — Etichete Medicale",
    shortDescription: "Autocolante pentru cabinete medicale: logo, specializări.",
    seoTitle: "Stickere Medic | Etichete Medicale | Prynt",
    seoDescription: "Promovează serviciile medicale cu stickere de încredere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Sănătate de încredere</h2><p>Stickere pentru medici.</p><p>Culori calmante. Rezistente la igienă.</p><ul><li>Design medical</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "vaccin": {
    key: "vaccin",
    title: "Stickere Vaccin — Etichete Prevenție",
    shortDescription: "Autocolante pentru campanii de vaccinare.",
    seoTitle: "Stickere Vaccin | Etichete Preventie | Prynt",
    seoDescription: "Informare despre vaccinare cu stickere clare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Vaccinare protectoare</h2><p>Stickere pentru sănătate publică.</p><p>Culori pozitive. Rezistente la vreme.</p><ul><li>Design informativ</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "donare-sange": {
    key: "donare-sange",
    title: "Stickere Donare Sânge — Campanii Umanitare",
    shortDescription: "Autocolante pentru centre de donare sânge.",
    seoTitle: "Stickere Donare Sange | Campanii Umanitare | Prynt",
    seoDescription: "Încurajează donarea cu stickere motivate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Donare vitală</h2><p>Stickere pentru salvare vieți.</p><p>Culori roșii. Rezistente la uzură.</p><ul><li>Design emoțional</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "fitness": {
    key: "fitness",
    title: "Stickere Fitness — Branding Sălă",
    shortDescription: "Autocolante pentru săli de fitness: logo, oferte.",
    seoTitle: "Stickere Fitness | Branding Sala | Prynt",
    seoDescription: "Promovează fitness-ul cu stickere atletice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Fitness energic</h2><p>Stickere pentru sănătate fizică.</p><p>Culori vii. Rezistente la transpirație.</p><ul><li>Design sportiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "yoga": {
    key: "yoga",
    title: "Stickere Yoga — Etichete Calmante",
    shortDescription: "Autocolante pentru centre de yoga: poziții, citate.",
    seoTitle: "Stickere Yoga | Etichete Calmante | Prynt",
    seoDescription: "Relaxare cu stickere zen.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Yoga liniștit</h2><p>Stickere pentru wellness.</p><p>Culori calmante. Rezistente la apă.</p><ul><li>Design zen</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE SPORT ---
  "fotbal": {
    key: "fotbal",
    title: "Stickere Fotbal — Logo Echipă",
    shortDescription: "Autocolante pentru fani de fotbal: logo, jucători.",
    seoTitle: "Stickere Fotbal | Logo Echipa | Prynt",
    seoDescription: "Arată pasiunea pentru fotbal cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Fotbal pasiune</h2><p>Stickere pentru suporteri.</p><p>Culori echipă. Rezistente la vreme.</p><ul><li>Design sportiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "baschet": {
    key: "baschet",
    title: "Stickere Baschet — Branding Sportiv",
    shortDescription: "Autocolante pentru baschet: logo, coșuri.",
    seoTitle: "Stickere Baschet | Branding Sportiv | Prynt",
    seoDescription: "Promovează baschetul cu stickere dinamice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Baschet dinamic</h2><p>Stickere pentru sporturi de echipă.</p><p>Culori vii. Rezistente la uzură.</p><ul><li>Design energetic</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "tenis": {
    key: "tenis",
    title: "Stickere Tenis — Logo & Branding",
    shortDescription: "Autocolante pentru tenis: rachete, mingi.",
    seoTitle: "Stickere Tenis | Logo Branding | Prynt",
    seoDescription: "Arată eleganța tenisului cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Tenis elegant</h2><p>Stickere pentru sporturi individuale.</p><p>Culori albe. Rezistente la vreme.</p><ul><li>Design elegant</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "atletism": {
    key: "atletism",
    title: "Stickere Atletism — Simboluri Olimpice",
    shortDescription: "Autocolante pentru atletism: torțe, medalii.",
    seoTitle: "Stickere Atletism | Simboluri Olimpice | Prynt",
    seoDescription: "Motivați sportivi cu stickere inspirate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Atletism motivant</h2><p>Stickere pentru performanță.</p><p>Culori aurii. Rezistente la transpirație.</p><ul><li>Design inspirat</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE MUZICĂ ---
  "rock": {
    key: "rock",
    title: "Stickere Rock — Chitări & Logo",
    shortDescription: "Autocolante pentru rock: chitare, steaguri.",
    seoTitle: "Stickere Rock | Chitari Logo | Prynt",
    seoDescription: "Arată spiritul rock cu stickere rebeli.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Rock rebel</h2><p>Stickere pentru muzică puternică.</p><p>Culori întunecate. Rezistente la vreme.</p><ul><li>Design rebel</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "pop": {
    key: "pop",
    title: "Stickere Pop — Stele & Culori",
    shortDescription: "Autocolante pentru pop: stele, inimi.",
    seoTitle: "Stickere Pop | Stele Culori | Prynt",
    seoDescription: "Distrați cu stickere pop colorate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Pop distractiv</h2><p>Stickere pentru muzică populară.</p><p>Culori vii. Rezistente la uzură.</p><ul><li>Design catchy</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "jazz": {
    key: "jazz",
    title: "Stickere Jazz — Note Muzicale",
    shortDescription: "Autocolante pentru jazz: instrumente, note.",
    seoTitle: "Stickere Jazz | Note Muzicale | Prynt",
    seoDescription: "Relaxare cu stickere jazz sofisticate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Jazz sofisticat</h2><p>Stickere pentru muzică instrumentală.</p><p>Culori calde. Rezistente la vreme.</p><ul><li>Design muzical</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "folk": {
    key: "folk",
    title: "Stickere Folk — Instrumente Tradiționale",
    shortDescription: "Autocolante pentru folk: cobze, fluierașe.",
    seoTitle: "Stickere Folk | Instrumente Traditionale | Prynt",
    seoDescription: "Cinstește tradiția cu stickere folclorice.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Folk autentic</h2><p>Stickere pentru muzică tradițională.</p><p>Culori naturale. Rezistente la uzură.</p><ul><li>Design tradițional</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE TECH ---
  "apple": {
    key: "apple",
    title: "Stickere Apple — Logo & Branding",
    shortDescription: "Autocolante pentru Apple: măr mușcat, logo.",
    seoTitle: "Stickere Apple | Logo Branding | Prynt",
    seoDescription: "Arată iubirea pentru Apple cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Apple inovativ</h2><p>Stickere pentru tech lovers.</p><p>Culori argintii. Rezistente la uzură.</p><ul><li>Design minimalist</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "samsung": {
    key: "samsung",
    title: "Stickere Samsung — Logo Coreean",
    shortDescription: "Autocolante pentru Samsung: logo, personalizare.",
    seoTitle: "Stickere Samsung | Logo Coreean | Prynt",
    seoDescription: "Promovează Samsung cu stickere moderne.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Samsung modern</h2><p>Stickere pentru gadgeturi.</p><p>Culori vii. Rezistente la vreme.</p><ul><li>Design modern</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "gaming": {
    key: "gaming",
    title: "Stickere Gaming — Logo Jocuri",
    shortDescription: "Autocolante pentru gaming: console, personaje.",
    seoTitle: "Stickere Gaming | Logo Jocuri | Prynt",
    seoDescription: "Arată pasiunea pentru gaming cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Gaming distractiv</h2><p>Stickere pentru jucători.</p><p>Culori vii. Rezistente la uzură.</p><ul><li>Design gamer</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "programare": {
    key: "programare",
    title: "Stickere Programare — Cod & Logo",
    shortDescription: "Autocolante pentru programatori: cod, logo limbaje.",
    seoTitle: "Stickere Programare | Cod Logo | Prynt",
    seoDescription: "Arată skill-urile cu stickere tech.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Programare cool</h2><p>Stickere pentru developeri.</p><p>Culori digitale. Rezistente la vreme.</p><ul><li>Design tech</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE HOME & DECOR ---
  "citate": {
    key: "citate",
    title: "Stickere Citate — Motivante & Inspirante",
    shortDescription: "Autocolante cu citate pentru perete sau laptop.",
    seoTitle: "Stickere Citate | Motivante Inspirante | Prynt",
    seoDescription: "Inspiră cu stickere cu mesaje pozitive.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Citate inspirate</h2><p>Stickere pentru motivație.</p><p>Culori calde. Rezistente la apă.</p><ul><li>Design pozitiv</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "animale": {
    key: "animale",
    title: "Stickere Animale — Personaje Drăguțe",
    shortDescription: "Autocolante cu animale pentru copii sau decor.",
    seoTitle: "Stickere Animale | Personaje Dragute | Prynt",
    seoDescription: "Adaugă drăgălășenie cu stickere animale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Animale drăguțe</h2><p>Stickere pentru decor.</p><p>Culori vii. Rezistente la uzură.</p><ul><li>Design cute</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "flori": {
    key: "flori",
    title: "Stickere Flori — Decor Natural",
    shortDescription: "Autocolante cu flori pentru perete sau mobilă.",
    seoTitle: "Stickere Flori | Decor Natural | Prynt",
    seoDescription: "Înfrumusețează cu stickere florale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Flori frumoase</h2><p>Stickere pentru natură.</p><p>Culori naturale. Rezistente la apă.</p><ul><li>Design floral</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "stelute": {
    key: "stelute",
    title: "Stickere Stelute — Decor Astral",
    shortDescription: "Autocolante cu stele pentru tavan sau perete.",
    seoTitle: "Stickere Stelute | Decor Astral | Prynt",
    seoDescription: "Creează magie cu stickere stelate.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Stele magice</h2><p>Stickere pentru decor.</p><p>Culori aurii. Rezistente la lumină.</p><ul><li>Design astral</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE SIGURANȚĂ ---
  "pericol": {
    key: "pericol",
    title: "Stickere Pericol — Semnalizare SSM",
    shortDescription: "Autocolante pentru pericole: electricitate, chimicale.",
    seoTitle: "Stickere Pericol | Semnalizare SSM | Prynt",
    seoDescription: "Semnalizează pericole cu stickere oficiale.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Pericol semnalizat</h2><p>Stickere pentru siguranță.</p><p>Culori avertizoare. Rezistente la vreme.</p><ul><li>Design avertizor</li><li>Hârtie durabilă</li><li>Livrare rapidă</li></ul>`
  },
  "iesire": {
    key: "iesire",
    title: "Stickere Ieșire Urgență — Semnalizare",
    shortDescription: "Autocolante pentru ieșiri de urgență.",
    seoTitle: "Stickere Iesire Urgenta | Semnalizare | Prynt",
    seoDescription: "Ghidează evacuarea cu stickere vizibile.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Ieșire sigură</h2><p>Stickere pentru urgențe.</p><p>Culori verzi. Rezistente la fum.</p><ul><li>Design clar</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "prim-ajutor": {
    key: "prim-ajutor",
    title: "Stickere Prim Ajutor — Truse Medicale",
    shortDescription: "Autocolante pentru truse de prim ajutor.",
    seoTitle: "Stickere Prim Ajutor | Truse Medicale | Prynt",
    seoDescription: "Semnalizează ajutorul medical cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Ajutor rapid</h2><p>Stickere pentru sănătate.</p><p>Culori roșii. Rezistente la uzură.</p><ul><li>Design medical</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },

  // --- MAI MULTE ALIMENTE ---
  "organic": {
    key: "organic",
    title: "Stickere Organic — Etichete Produse",
    shortDescription: "Autocolante pentru produse organice: logo, certificări.",
    seoTitle: "Stickere Organic | Etichete Produse | Prynt",
    seoDescription: "Promovează organic cu stickere verzi.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Organic sănătos</h2><p>Stickere pentru alimente naturale.</p><p>Culori verzi. Rezistente la frig.</p><ul><li>Design natural</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "vegan": {
    key: "vegan",
    title: "Stickere Vegan — Etichete Alimentare",
    shortDescription: "Autocolante pentru produse vegane.",
    seoTitle: "Stickere Vegan | Etichete Alimentare | Prynt",
    seoDescription: "Semnalizează vegan cu stickere clare.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Vegan prietenos</h2><p>Stickere pentru alimentație sănătoasă.</p><p>Culori verzi. Rezistente la apă.</p><ul><li>Design eco</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "fara-gluten": {
    key: "fara-gluten",
    title: "Stickere Fără Gluten — Etichete Speciale",
    shortDescription: "Autocolante pentru produse fără gluten.",
    seoTitle: "Stickere Fara Gluten | Etichete Speciale | Prynt",
    seoDescription: "Informare pentru intoleranțe cu stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Fără gluten sigur</h2><p>Stickere pentru dietă specială.</p><p>Culori distinctive. Rezistente la umiditate.</p><ul><li>Design clar</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },

  // --- MAI MULTE PERSONAL ---
  "nume": {
    key: "nume",
    title: "Stickere Nume Personalizate — Branding",
    shortDescription: "Autocolante cu nume pentru mașini sau obiecte.",
    seoTitle: "Stickere Nume Personalizate | Branding | Prynt",
    seoDescription: "Personalizează cu numele tău.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Nume unic</h2><p>Stickere personalizate.</p><p>Culori alese. Rezistente la vreme.</p><ul><li>Design personal</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  },
  "initiale": {
    key: "initiale",
    title: "Stickere Inițiale — Monograme",
    shortDescription: "Autocolante cu inițiale pentru stil.",
    seoTitle: "Stickere Initiale | Monograme | Prynt",
    seoDescription: "Arată inițialele cu stickere elegante.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Inițiale elegante</h2><p>Stickere pentru monograme.</p><p>Culori aurii. Rezistente la uzură.</p><ul><li>Design sofisticat</li><li>Hârtie rezistentă</li><li>Print profesional</li></ul>`
  },
  "emoji": {
    key: "emoji",
    title: "Stickere Emoji — Expresii Veselé",
    shortDescription: "Autocolante cu emoji pentru decor.",
    seoTitle: "Stickere Emoji | Expresii Veselé | Prynt",
    seoDescription: "Adaugă veselie cu emoji stickere.",
    images: ["/products/autocolante/autocolante-1.webp"],
    contentHtml: `<h2>Emoji distractive</h2><p>Stickere pentru expresii.</p><p>Culori vii. Rezistente la apă.</p><ul><li>Design funny</li><li>Hârtie premium</li><li>Livrare rapidă</li></ul>`
  }
};