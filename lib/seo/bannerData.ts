// lib/seo/bannerData.ts
import type { LandingInfo } from "../landingData";

export const BANNER_SEO_DATA: Record<string, LandingInfo> = {
  // --- IMOBILIARE (Cuvinte cheie de top) ---
  "de-vanzare": {
    key: "de-vanzare",
    title: "Banner DE VÂNZARE — Vizibilitate Maximă",
    shortDescription: "Banner clasic 'DE VÂNZARE' cu spațiu pentru telefon. Culori stridente (Roșu/Alb, Galben/Negru).",
    seoTitle: "Banner De Vânzare | Apartamente & Terenuri | Prynt",
    seoDescription: "Comandă banner 'De Vânzare' personalizat. Rezistent outdoor, capse incluse. Livrare rapidă.",
    images: ["/products/banner/vanzare.jpg"],
    contentHtml: `<h2>Vinde rapid proprietatea</h2><p>Cel mai simplu și eficient mod de a vinde. Include numărul tău de telefon mare și vizibil.</p>`
  },
  "de-inchiriat": {
    key: "de-inchiriat",
    title: "Banner DE ÎNCHIRIAT — Găsește Chiriași",
    shortDescription: "Banner 'DE ÎNCHIRIAT' vizibil de la distanță pentru apartamente și spații comerciale.",
    seoTitle: "Banner De Închiriat | Imobiliare | Prynt",
    seoDescription: "Semnalizează spațiul disponibil cu un banner rezistent. Livrare oriunde în țară.",
    images: ["/products/banner/de-inchiriat.jpg"],
    contentHtml: `<h2>Închiriază rapid spațiul</h2><p>Ideal pentru balcoane, garduri sau geamuri. Material rezistent la intemperii.</p>`
  },
  "vand-teren": {
    key: "vand-teren",
    title: "Banner VÂND TEREN — Semnalizare Loturi",
    shortDescription: "Banner specific pentru terenuri intravilane/extravilane. Rezistent la vânt și soare.",
    seoTitle: "Banner Vand Teren | Intravilan & Extravilan | Prynt",
    seoDescription: "Bannere mari pentru vânzare terenuri. Se pot monta pe țăruși sau garduri.",
    images: ["/products/banner/teren-de-vanzare.jpg"],
    contentHtml: `<h2>Semnalizează terenul direct la locație</h2><p>Cumpărătorii de terenuri vizitează zona. Asigură-te că văd numărul tău.</p>`
  },
  "spatiu-comercial": {
    key: "spatiu-comercial",
    title: "Banner SPAȚIU COMERCIAL — Vânzare/Închiriere",
    shortDescription: "Banner pentru vitrine spații comerciale. 'De Închiriat' sau 'De Vânzare'.",
    seoTitle: "Banner Spatiu Comercial | Vitrine & Fatade | Prynt",
    seoDescription: "Atrage afaceri în spațiul tău. Banner printat la rezoluție mare pentru impact vizual.",
    images: ["/products/banner/spatiu-de-inchiriat.jpg"],
    contentHtml: `<h2>Valorifică spațiul comercial</h2><p>Un banner profesional crește valoarea percepută a spațiului.</p>`
  },
  "dezvoltator-imobiliar": {
    key: "dezvoltator-imobiliar",
    title: "Bannere Dezvoltatori Imobiliari — Ansambluri Rezidențiale",
    shortDescription: "Mesh-uri și bannere gigant pentru șantiere și blocuri în construcție.",
    seoTitle: "Print Outdoor Dezvoltatori Imobiliari | Mesh & Banner | Prynt",
    seoDescription: "Soluții complete pentru dezvoltatori: bannere gard, mesh fațadă, panouri investiție.",
    images: ["/products/banner/Vila-de-vanzare.jpg"],
    contentHtml: `<h2>Branding de șantier</h2><p>Transformă șantierul în cel mai bun agent de vânzări cu randări fotorealiste pe mesh.</p>`
  },

  // --- AUTO & MOTO ---
  "service-auto": {
    key: "service-auto",
    title: "Banner Service Auto — Mecanică & Diagnoză",
    shortDescription: "Semnalizează atelierul tău. 'Mecanică', 'Electrică', 'Diagnoză'.",
    seoTitle: "Banner Service Auto | Reclama Atelier Mecanic | Prynt",
    seoDescription: "Banner service auto rezistent la ulei și exterior. Atrage clienți din trafic.",
    images: ["/products/banner/service-auto.jpg"],
    contentHtml: `<h2>Vizibilitate pentru Service-ul tău</h2><p>Listează serviciile principale pentru a atrage șoferii care trec prin zonă.</p>`
  },
  "vulcanizare": {
    key: "vulcanizare",
    title: "Banner Vulcanizare — Schimb Anvelope",
    shortDescription: "Banner 'VULCANIZARE', 'SCHIMB ROȚI', 'ECHILIBRARE'.",
    seoTitle: "Banner Vulcanizare & Roti | Semnalistica Auto | Prynt",
    seoDescription: "Pregătește-te de sezon. Banner vulcanizare vizibil de la mare distanță.",
    images: ["/products/banner/Vulcanizare.jpg"],
    contentHtml: `<h2>Nu rata sezonul de schimb anvelope</h2><p>Un banner mare cu 'DESCHIS' aduce clienți imediat.</p>`
  },
  "itp": {
    key: "itp",
    title: "Banner Stație ITP — Inspecție Tehnică",
    shortDescription: "Semnalizează stația ITP. 'ITP Fără Programare', 'ITP Rapid'.",
    seoTitle: "Banner ITP | Reclama Statie Inspectie Tehnica | Prynt",
    seoDescription: "Banner ITP autorizat. Text mare și clar pentru șoferi.",
    images: ["/products/banner/service-auto.jpg"],
    contentHtml: `<h2>Atrage clienți la ITP</h2><p>Șoferii caută stații ITP vizibile și accesibile.</p>`
  },
  "spalatorie-auto": {
    key: "spalatorie-auto",
    title: "Banner Spălătorie Auto — Self Wash & Detailing",
    shortDescription: "Banner rezistent la apă pentru spălătorii. 'Jetoane', 'Spumă Activă'.",
    seoTitle: "Banner Spalatorie Auto | Self Service | Prynt",
    seoDescription: "Reclame outdoor pentru spălătorii. Rezistente la umezeală și aburi.",
    images: ["/products/banner/spalatorie-haine.jpg"], // Fallback image
    contentHtml: `<h2>Semnalizare Spălătorie</h2><p>Afișează prețurile și programele de spălare clar.</p>`
  },
  "piese-auto": {
    key: "piese-auto",
    title: "Banner Piese Auto — Magazin & Dezmembrări",
    shortDescription: "Banner pentru magazine de piese sau parcuri de dezmembrări.",
    seoTitle: "Banner Piese Auto & Dezmembrari | Prynt",
    seoDescription: "Promovează magazinul de piese auto cu un banner stradal.",
    images: ["/products/banner/PIESE-AUTO.jpg"],
    contentHtml: `<h2>Piese auto disponibile imediat</h2><p>Semnalizează stocul de piese sau serviciul de comandă rapidă.</p>`
  },
  "tractari-auto": {
    key: "tractari-auto",
    title: "Banner Tractări Auto — Non Stop",
    shortDescription: "Banner cu număr de telefon pentru servicii de tractare și asistență rutieră.",
    seoTitle: "Banner Tractari Auto Non Stop | Prynt",
    seoDescription: "Banner simplu și eficient: TRACTĂRI + Telefon. Vizibil zi și noapte (dacă e iluminat).",
    images: ["/products/banner/service-auto.jpg"],
    contentHtml: `<h2>Servicii de urgență</h2><p>Pentru parcuri auto sau locația sediului.</p>`
  },

  // --- CONSTRUCȚII & MESERIAȘI ---
  "constructii": {
    key: "constructii",
    title: "Banner Construcții — Echipă & Servicii",
    shortDescription: "Promovează echipa ta: 'Executăm Case', 'Renovări', 'Acoperișuri'.",
    seoTitle: "Banner Firma Constructii & Renovari | Prynt",
    seoDescription: "Banner de gard pentru șantiere sau sedii firme construcții.",
    images: ["/products/banner/perete.jpg"],
    contentHtml: `<h2>Arată ce poți construi</h2><p>Listează tipurile de lucrări: la roșu, la cheie, instalații.</p>`
  },
  "santier-in-lucru": {
    key: "santier-in-lucru",
    title: "Panou/Banner Șantier în Lucru — Avertizare",
    shortDescription: "Semnalizare obligatorie și de protecție. 'Atenție cad obiecte', 'Acces Interzis'.",
    seoTitle: "Banner Santier in Lucru | Protectia Muncii | Prynt",
    seoDescription: "Bannere de avertizare pentru șantiere. Rezistente și vizibile.",
    images: ["/products/banner/nu-blocati.jpg"],
    contentHtml: `<h2>Siguranța pe primul loc</h2><p>Delimitează zona de lucru și previne accidentele.</p>`
  },
  "materiale-constructii": {
    key: "materiale-constructii",
    title: "Banner Depozit Materiale Construcții",
    shortDescription: "Banner pentru depozite. 'Ciment', 'Fier', 'Lemn', 'Transport Gratuit'.",
    seoTitle: "Banner Depozit Materiale Constructii | Prynt",
    seoDescription: "Reclame mari pentru depozite. Listează produsele principale.",
    images: ["/products/banner/perete.jpg"],
    contentHtml: `<h2>Totul pentru casa ta</h2><p>Atrage constructorii și beneficiarii la depozitul tău.</p>`
  },
  "amenajari-interioare": {
    key: "amenajari-interioare",
    title: "Banner Amenajări Interioare — Design & Finisaje",
    shortDescription: "Banner pentru firme de design, gresie, faianță, parchet.",
    seoTitle: "Banner Amenajari Interioare & Design | Prynt",
    seoDescription: "Promovează showroom-ul de amenajări cu imagini de calitate.",
    images: ["/products/banner/MAGAZIN-DECORATIUNI.jpg"],
    contentHtml: `<h2>Inspiră clienții</h2><p>Folosește imagini cu interioare renovate pentru a convinge.</p>`
  },

  // --- HORECA (Hoteluri, Restaurante, Cafenele) ---
  "restaurant": {
    key: "restaurant",
    title: "Banner Restaurant — Meniul Zilei & Evenimente",
    shortDescription: "Banner apetisant pentru restaurante. 'Deschis', 'Livrări', 'Nunta/Botez'.",
    seoTitle: "Banner Restaurant & Terasa | Outdoor Horeca | Prynt",
    seoDescription: "Printuri culinare de înaltă rezoluție. Rezistente la exterior.",
    images: ["/products/banner/RESTAURANT.jpg"],
    contentHtml: `<h2>Gustul care atrage</h2><p>O imagine cu mâncare face cât 1000 de cuvinte. Folosește poze reale.</p>`
  },
  "pizzerie": {
    key: "pizzerie",
    title: "Banner Pizzerie — Oferta 1+1 & Livrare",
    shortDescription: "Banner 'Pizza pe Vatră', 'Livrare Gratuită', 'Oferte Family'.",
    seoTitle: "Banner Pizzerie | Livrare Pizza | Prynt",
    seoDescription: "Crește comenzile la pizzerie cu un banner vizibil în cartier.",
    images: ["/products/banner/PIZZERIE.jpg"],
    contentHtml: `<h2>Cea mai bună pizza din oraș</h2><p>Promovează numărul de telefon pentru comenzi rapide.</p>`
  },
  "fast-food": {
    key: "fast-food",
    title: "Banner Fast Food — Shaorma & Burger",
    shortDescription: "Banner stradal pentru fast-food. Culori vii, poze cu produse.",
    seoTitle: "Banner Fast Food & Shaormerie | Prynt",
    seoDescription: "Atrage clienții înfometați cu bannere luminoase și clare.",
    images: ["/products/banner/FastFood.jpg"],
    contentHtml: `<h2>Mâncare rapidă și bună</h2><p>Ideal pentru locații stradale cu trafic pietonal intens.</p>`
  },
  "cafenea": {
    key: "cafenea",
    title: "Banner Cafenea & Coffe To Go",
    shortDescription: "Banner elegant pentru cafenele. 'Coffee To Go', 'Specialty Coffee'.",
    seoTitle: "Banner Cafenea & Coffe Shop | Prynt",
    seoDescription: "Semnalizează locația ta de cafea. Design modern și atractiv.",
    images: ["/products/banner/TERASA.jpg"],
    contentHtml: `<h2>Energie pentru toată ziua</h2><p>Semnalizează prezența unei cafele bune în zonă.</p>`
  },
  "nunti-botezuri": {
    key: "nunti-botezuri",
    title: "Banner Organizare Evenimente — Săli & Corturi",
    shortDescription: "Banner pentru săli de evenimente. 'Organizam Nunți, Botezuri, Mese Festive'.",
    seoTitle: "Banner Sala Evenimente & Nunti | Prynt",
    seoDescription: "Promovează sala de evenimente pentru sezonul nunților.",
    images: ["/products/banner/RESTAURANT.jpg"],
    contentHtml: `<h2>Locația ideală pentru evenimente</h2><p>Prezintă capacitatea sălii și facilitățile oferite.</p>`
  },
  "cazare": {
    key: "cazare",
    title: "Banner Cazare / Pensiune / Hotel",
    shortDescription: "Banner 'CAZARE', 'CAMERE LIBERE', 'RECEȚIE'.",
    seoTitle: "Banner Cazare & Pensiuni | Turism | Prynt",
    seoDescription: "Esențial pentru pensiuni în zone turistice. Atrage turiștii de la stradă.",
    images: ["/products/banner/Vila-de-inchiriat.jpg"],
    contentHtml: `<h2>Bine ați venit!</h2><p>Semnalizează intrarea și disponibilitatea camerelor.</p>`
  },

  // --- BEAUTY & MEDICAL ---
  "salon-infrumusetare": {
    key: "salon-infrumusetare",
    title: "Banner Salon Înfrumusețare — Coafor & Cosmetică",
    shortDescription: "Banner elegant pentru saloane. Listează servicii: tuns, vopsit, manichiură.",
    seoTitle: "Banner Salon Infrumusetare & Coafor | Prynt",
    seoDescription: "Reclame outdoor pentru saloane de beauty. Design feminin și atrăgător.",
    images: ["/products/banner/BARBERSHOP.jpg"], // Fallback visual
    contentHtml: `<h2>Frumusețe și stil</h2><p>Atrage doamnele din cartier la salonul tău.</p>`
  },
  "frizerie": {
    key: "frizerie",
    title: "Banner Frizerie / Barber Shop",
    shortDescription: "Banner masculin, stil Barber Shop. 'Tuns', 'Barbi', 'Fără Programare'.",
    seoTitle: "Banner Frizerie & Barber Shop | Prynt",
    seoDescription: "Semnalistică pentru frizerii. Stil clasic sau modern.",
    images: ["/products/banner/BARBERSHOP.jpg"],
    contentHtml: `<h2>Stil masculin desăvârșit</h2><p>Semnalizează barber shop-ul cu un design puternic.</p>`
  },
  "stomatologie": {
    key: "stomatologie",
    title: "Banner Cabinet Stomatologic — Urgențe Dentare",
    shortDescription: "Banner curat, medical. 'Stomatologie', 'Implanturi', 'Radiologie'.",
    seoTitle: "Banner Cabinet Stomatologic & Dentist | Prynt",
    seoDescription: "Inspira încredere pacienților cu un banner profesional pentru clinică.",
    images: ["/products/banner/Cabinet-Stomatologic.jpg"],
    contentHtml: `<h2>Zâmbetul tău contează</h2><p>Promovează serviciile stomatologice și urgențele.</p>`
  },
  "farmacie": {
    key: "farmacie",
    title: "Banner Farmacie / Plafar",
    shortDescription: "Banner cu cruce verde sau specific farmaceutic. 'Farmacie Non-Stop'.",
    seoTitle: "Banner Farmacie & Plafar | Semnalistica Medicala | Prynt",
    seoDescription: "Semnalizează farmacia pentru vizibilitate stradală.",
    images: ["/products/banner/servicii-medicale.jpg"],
    contentHtml: `<h2>Sănătate aproape de tine</h2><p>Esențial pentru farmacii noi sau relocate.</p>`
  },
  "veterinar": {
    key: "veterinar",
    title: "Banner Cabinet Veterinar & Pet Shop",
    shortDescription: "Banner cu animale. 'Veterinar', 'Urgențe', 'Hrană Animale'.",
    seoTitle: "Banner Cabinet Veterinar | Pet Shop | Prynt",
    seoDescription: "Atrage iubitorii de animale la cabinetul tău.",
    images: ["/products/banner/PET-SHOP.jpg"],
    contentHtml: `<h2>Grija pentru prietenii necuvântători</h2><p>Semnalizează cabinetul și farmacia veterinară.</p>`
  },

  // --- RETAIL & MAGAZINE ---
  "magazin-alimentar": {
    key: "magazin-alimentar",
    title: "Banner Magazin Alimentar / Mixt",
    shortDescription: "Banner 'DESCHIS', 'PÂINE PROASPĂTĂ', 'LEGUME FRUCTE'.",
    seoTitle: "Banner Magazin Alimentar & Supermarket | Prynt",
    seoDescription: "Crește vânzările magazinului de cartier cu oferte vizibile.",
    images: ["/products/banner/magazin-alimentar.jpg"],
    contentHtml: `<h2>Produse proaspete zilnic</h2><p>Anunță clienții despre produsele de bază disponibile.</p>`
  },
  "haine": {
    key: "haine",
    title: "Banner Magazin Haine & Încălțăminte",
    shortDescription: "Banner fashion. 'Noua Colecție', 'Haine Copii', 'Outlet'.",
    seoTitle: "Banner Magazin Haine & Fashion | Prynt",
    seoDescription: "Promovează magazinul de haine cu imagini de lifestyle.",
    images: ["/products/banner/MAGAZIN-INCALTAMINTE.jpg"],
    contentHtml: `<h2>Stil și eleganță</h2><p>Atrage pasionații de modă în magazin.</p>`
  },
  "second-hand": {
    key: "second-hand",
    title: "Banner Magazin Second Hand / Outlet",
    shortDescription: "Banner 'Marfă Nouă', 'Prețuri Mici', 'Haine la Kilogram'.",
    seoTitle: "Banner Second Hand & Outlet | Prynt",
    seoDescription: "Semnalizează zilele cu marfă nouă și reducerile.",
    images: ["/products/banner/MAGAZIN-SECOND-HAND.jpg"],
    contentHtml: `<h2>Calitate la prețuri mici</h2><p>Anunță ziua de marfă și reducerile finale.</p>`
  },
  "florarie": {
    key: "florarie",
    title: "Banner Florărie — Buchete & Aranjamente",
    shortDescription: "Banner colorat cu flori. 'Buchete', 'Lumânări', 'Evenimente'.",
    seoTitle: "Banner Florarie & Aranjamente Florale | Prynt",
    seoDescription: "Atrage atenția cu imagini florale vibrante.",
    images: ["/products/banner/CADOURI-PERSONALIZATE.jpg"], // Fallback
    contentHtml: `<h2>Emoții prin flori</h2><p>Semnalizează florăria pentru clienții grăbiți.</p>`
  },

  // --- SERVICII DIVERSE ---
  "reparatii-telefoane": {
    key: "reparatii-telefoane",
    title: "Banner Service GSM / Reparații Telefoane",
    shortDescription: "Banner 'Service GSM', 'Schimb Display', 'Accesorii'.",
    seoTitle: "Banner Service GSM & Reparatii Telefoane | Prynt",
    seoDescription: "Semnalizează service-ul GSM într-o zonă aglomerată.",
    images: ["/products/banner/REPARAM-TELEFOANE.jpg"],
    contentHtml: `<h2>Reparații rapide pe loc</h2><p>Lumea are nevoie de telefoane funcționale. Fii vizibil!</p>`
  },
  "amanet": {
    key: "amanet",
    title: "Banner Amanet / Exchange",
    shortDescription: "Banner 'AMANET', 'AUR', 'SCHIMB VALUTAR', 'NON-STOP'.",
    seoTitle: "Banner Amanet & Schimb Valutar | Prynt",
    seoDescription: "Culori galbene specifice pentru vizibilitate maximă amanet.",
    images: ["/products/banner/IN-STOC.jpg"], // Fallback generic
    contentHtml: `<h2>Servicii financiare rapide</h2><p>Semnalizare stradală puternică pentru case de amanet.</p>`
  },
  "croitorie": {
    key: "croitorie",
    title: "Banner Croitorie & Retușuri",
    shortDescription: "Banner 'Croitorie Rapidă', 'Scurtat Pantaloni', 'Perdele'.",
    seoTitle: "Banner Croitorie & Retusuri Haine | Prynt",
    seoDescription: "Promovează atelierul de croitorie în cartier.",
    images: ["/products/banner/CROITORIE-RETUSARI.jpg"],
    contentHtml: `<h2>Haine pe măsura ta</h2><p>Servicii de croitorie la îndemâna clienților din zonă.</p>`
  },
  "chei": {
    key: "chei",
    title: "Banner Copiat Chei & Yale",
    shortDescription: "Banner 'Copiat Chei', 'Carcase Auto', 'Ascuțit Cuțite'.",
    seoTitle: "Banner Copiat Chei & Lacatus | Prynt",
    seoDescription: "Semnalizare pentru ateliere mici de chei.",
    images: ["/products/banner/CIZMARIE.jpg"], // Fallback similar craft
    contentHtml: `<h2>Chei duplicate pe loc</h2><p>Nu lăsa clienții să te caute, fii vizibil!</p>`
  },

  // --- EVENIMENTE & SĂRBĂTORI ---
  "la-multi-ani": {
    key: "la-multi-ani",
    title: "Banner La Mulți Ani — Aniversări & Petreceri",
    shortDescription: "Banner festiv personalizat cu nume și poză pentru zile de naștere.",
    seoTitle: "Banner La Multi Ani Personalizat | Aniversare | Prynt",
    seoDescription: "Surprinde sărbătoritul cu un banner uriaș 'La Mulți Ani'.",
    images: ["/products/banner/la-multi-ani.jpg"],
    contentHtml: `<h2>O surpriză de neuitat</h2><p>Perfect pentru petreceri surpriză, majorate sau aniversări de firmă.</p>`
  },
  "botez": {
    key: "botez",
    title: "Banner Botez — Bun Venit & Decor",
    shortDescription: "Banner 'Bine ați venit la Botezul meu', cu poza bebelușului.",
    seoTitle: "Banner Botez Personalizat | Decor Sala | Prynt",
    seoDescription: "Decor personalizat pentru sala de botez. Tematici diverse (Disney, culori pastel).",
    images: ["/products/banner/CADOURI-PERSONALIZATE.jpg"],
    contentHtml: `<h2>Primul eveniment important</h2><p>Un photo-corner personalizat pentru botez.</p>`
  },
  "nunta": {
    key: "nunta",
    title: "Banner Nuntă — Welcome & Photo Corner",
    shortDescription: "Banner 'Casa de Piatră' sau fundal pentru poze la nuntă.",
    seoTitle: "Banner Nunta & Photo Corner | Prynt",
    seoDescription: "Bannere elegante pentru nunți. Numele mirilor și data evenimentului.",
    images: ["/products/banner/vrei-sa-fii-sotia-mea.jpg"],
    contentHtml: `<h2>Eleganță și amintiri</h2><p>Creează un fundal perfect pentru fotografiile invitaților.</p>`
  },
  "black-friday": {
    key: "black-friday",
    title: "Banner Black Friday — Reduceri Explozive",
    shortDescription: "Banner negru/roșu pentru campanii de reduceri.",
    seoTitle: "Banner Black Friday | Afise Reduceri | Prynt",
    seoDescription: "Pregătește magazinul pentru cele mai mari reduceri din an.",
    images: ["/products/banner/BLACK-FRIDAY.jpg"],
    contentHtml: `<h2>Cele mai mari reduceri</h2><p>Semnalizează campania clar și vizibil.</p>`
  },
  "sarbatori": {
    key: "sarbatori",
    title: "Banner Sărbători — Crăciun & Paște",
    shortDescription: "Banner 'Sărbători Fericite', decorativ pentru firme și primării.",
    seoTitle: "Banner Sarbatori Fericite | Craciun & Paste | Prynt",
    seoDescription: "Bannere stradale cu urări de sărbători.",
    images: ["/products/banner/WINTER-SALE.jpg"],
    contentHtml: `<h2>Atmosferă de sărbătoare</h2><p>Decorează fațada sau interiorul cu mesaje festive.</p>`
  },

  // --- INSTITUȚII & COMUNITATE ---
  "primarie": {
    key: "primarie",
    title: "Banner Primărie — Informări & Evenimente",
    shortDescription: "Bannere pentru 'Zilele Comunei', informări publice, proiecte.",
    seoTitle: "Banner Primarie & Institutii Publice | Prynt",
    seoDescription: "Print outdoor pentru instituții. Bannere stradale transversale sau panouri.",
    images: ["/products/banner/produs-in-romania.jpg"],
    contentHtml: `<h2>Comunicare cu cetățenii</h2><p>Anunță evenimentele locale și proiectele de investiții.</p>`
  },
  "biserica": {
    key: "biserica",
    title: "Banner Biserică — Hram & Sărbători",
    shortDescription: "Banner 'Hramul Bisericii', 'La Mulți Ani', 'Sfintele Paști'.",
    seoTitle: "Banner Biserica & Parohie | Religios | Prynt",
    seoDescription: "Bannere rezistente pentru lăcașuri de cult.",
    images: ["/products/banner/la-multi-ani.jpg"],
    contentHtml: `<h2>Mesaje pentru comunitate</h2><p>Semnalizează sărbătorile importante ale parohiei.</p>`
  },
  "scoala": {
    key: "scoala",
    title: "Banner Școală & Grădiniță — Înscrieri",
    shortDescription: "Banner 'Înscrieri Deschise', 'Bun Venit', 'Serbare'.",
    seoTitle: "Banner Scoala & Gradinita | Inscrieri | Prynt",
    seoDescription: "Promovează oferta educațională a școlii sau grădiniței.",
    images: ["/products/banner/RECRUTAM-PERSONAL.jpg"], // Fallback contextual
    contentHtml: `<h2>Educație de calitate</h2><p>Anunță perioada de înscrieri pentru părinți.</p>`
  },

  // --- AGRICULTURĂ ---
  "agricol": {
    key: "agricol",
    title: "Banner Agricol — Produse & Utilaje",
    shortDescription: "Banner 'Vând Cereale', 'Vând Fân', 'Utilaje Agricole'.",
    seoTitle: "Banner Agricol & Produse Locale | Prynt",
    seoDescription: "Bannere pentru fermieri și producători locali.",
    images: ["/products/banner/FRUCTE-SI-LEGUME.jpg"],
    contentHtml: `<h2>Susține producătorii locali</h2><p>Vinde recolta direct de la poartă cu un banner vizibil.</p>`
  },
  "apicol": {
    key: "apicol",
    title: "Banner Miere de Albine & Produse Apicole",
    shortDescription: "Banner 'Vând Miere Naturală', 'Polen', 'Propolis'.",
    seoTitle: "Banner Miere & Apicultor | Prynt",
    seoDescription: "Semnalizează stupina sau punctul de vânzare miere.",
    images: ["/products/banner/Produse-bio-eco.jpg"],
    contentHtml: `<h2>Miere 100% Naturală</h2><p>Atrage clienții care caută produse sănătoase.</p>`
  },

  // --- ALTELE ---
  "angajam": {
    key: "angajam",
    title: "Banner ANGAJĂM — Recrutare Personal",
    shortDescription: "Cel mai eficient mod de a găsi personal local. 'Angajăm Vânzătoare', 'Șofer', 'Personal'.",
    seoTitle: "Banner Angajam Personal | Recrutare | Prynt",
    seoDescription: "Găsește angajați rapid. Pune un banner 'ANGAJĂM' la intrare.",
    images: ["/products/banner/ANGAJAM-PERSONAL.jpg"],
    contentHtml: `<h2>Recrutare directă</h2><p>Oamenii care locuiesc în zonă sunt cei mai buni angajați. Anunță-i că ai nevoie de ei.</p>`
  },
  "deschidere": {
    key: "deschidere",
    title: "Banner DESCHIDERE — Open Soon",
    shortDescription: "Banner 'Deschidem în curând', 'Marea Deschidere'.",
    seoTitle: "Banner Deschidere Magazin | Grand Opening | Prynt",
    seoDescription: "Creează suspans înainte de lansare.",
    images: ["/products/banner/DESCHIS-ACUM.jpg"],
    contentHtml: `<h2>Lansare de succes</h2><p>Nu deschide în liniște. Fă gălăgie vizuală!</p>`
  },

  // --- AFACERI ȘI PROMOȚII ---
  "discount": {
    key: "discount",
    title: "Banner DISCOUNT — Reduceri Mari",
    shortDescription: "Banner '50% Reducere', 'Solduri', 'Promoții'.",
    seoTitle: "Banner Discount | Reduceri & Promotii | Prynt",
    seoDescription: "Atrage clienți cu oferte irezistibile.",
    images: ["/products/banner/discount.jpg"],
    contentHtml: `<h2>Economie mare</h2><p>Reducerile atrag cumpărători. Detaliază procentele și produsele.</p><ul><li>Produse la reducere</li><li>Perioada promoției</li><li>Condiții speciale</li><li>Contact pentru detalii</li></ul>`
  },
  "promotie": {
    key: "promotie",
    title: "Banner Promoție — Ofertă Specială",
    shortDescription: "Banner pentru campanii promoționale și lansări.",
    seoTitle: "Banner Promotie | Campanii Marketing | Prynt",
    seoDescription: "Lansează promoția cu impact vizual maxim.",
    images: ["/products/banner/promotie.jpg"],
    contentHtml: `<h2>Ofertă limitată</h2><p>Promoțiile cresc vânzările. Un banner clar comunică beneficiile.</p><ul><li>Produsul vedetă</li><li>Preț promoțional</li><li>Stoc limitat</li><li>Valabilitate</li></ul>`
  },
  "publicitate": {
    key: "publicitate",
    title: "Banner Publicitate — Branding Exterior",
    shortDescription: "Banner pentru reclamă firme, produse sau servicii.",
    seoTitle: "Banner Publicitate | Reclama Outdoor | Prynt",
    seoDescription: "Crește vizibilitatea brandului tău cu bannere profesionale.",
    images: ["/products/banner/publicitate.jpg"],
    contentHtml: `<h2>Brand puternic</h2><p>Publicitatea outdoor construiește imaginea. Alege culori și mesaje impactante.</p><ul><li>Logo și slogan</li><li>Mesaj cheie</li><li>Contact și website</li><li>Apel la acțiune</li></ul>`
  },
  "firma": {
    key: "firma",
    title: "Banner Firmă — Prezentare Companie",
    shortDescription: "Banner cu logo, servicii și contact pentru afaceri.",
    seoTitle: "Banner Firma | Prezentare Companie | Prynt",
    seoDescription: "Prezintă firma cu un banner reprezentativ.",
    images: ["/products/banner/firma.jpg"],
    contentHtml: `<h2>Compania ta</h2><p>Un banner la intrare impresionează clienții. Include serviciile principale.</p><ul><li>Istoric scurt</li><li>Servicii oferite</li><li>Echipa și valori</li><li>Contact direct</li></ul>`
  },
  "startup": {
    key: "startup",
    title: "Banner Startup — Inovare și Creștere",
    shortDescription: "Banner pentru startup-uri tech sau afaceri noi.",
    seoTitle: "Banner Startup | Afaceri Inovatoare | Prynt",
    seoDescription: "Anunță lansarea startup-ului cu entuziasm.",
    images: ["/products/banner/startup.jpg"],
    contentHtml: `<h2>Inovare în acțiune</h2><p>Startup-urile schimbă lumea. Prezintă viziunea pe banner.</p><ul><li>Misiunea companiei</li><li>Produsul inovator</li><li>Echipa fondatoare</li><li>Investiții căutate</li></ul>`
  },
  "franciza": {
    key: "franciza",
    title: "Banner Franciză — Extindere Afaceri",
    shortDescription: "Banner 'Franciză Disponibilă', 'Alătură-te Rețelei'.",
    seoTitle: "Banner Franciza | Extindere Business | Prynt",
    seoDescription: "Atrage francizați cu un banner atractiv.",
    images: ["/products/banner/franciza.jpg"],
    contentHtml: `<h2>Creește rețeaua</h2><p>Francizele aduc succes rapid. Detaliază beneficiile pe banner.</p><ul><li>Investiția necesară</li><li>Profit estimat</li><li>Suport oferit</li><li>Teritorii disponibile</li></ul>`
  },
  "reparatii": {
    key: "reparatii",
    title: "Banner Reparații — Servicii Tehnice",
    shortDescription: "Banner 'Reparăm TV', 'Electrocasnice', 'Mobilă'.",
    seoTitle: "Banner Reparatii | Service Tehnic | Prynt",
    seoDescription: "Anunță serviciile de reparații cu garanție.",
    images: ["/products/banner/reparatii.jpg"],
    contentHtml: `<h2>Reparăm totul</h2><p>Oamenii au nevoie de reparații urgente. Fii vizibil.</p><ul><li>Dispozitive reparate</li><li>Garanție oferită</li><li>Prețuri transparente</li><li>Contact rapid</li></ul>`
  },
  "instalatii": {
    key: "instalatii",
    title: "Banner Instalații — Electricitate și Gaz",
    shortDescription: "Banner pentru instalatori autorizați.",
    seoTitle: "Banner Instalatii | Electricitate & Sanitara | Prynt",
    seoDescription: "Promovează serviciile de instalații cu certificări.",
    images: ["/products/banner/instalatii.jpg"],
    contentHtml: `<h2>Instalații sigure</h2><p>Lucrări autorizate și de calitate. Include specializările.</p><ul><li>Electricitate</li><li>Încălziere</li><li>Sanitare</li><li>Certificări</li></ul>`
  },
  "curatenie": {
    key: "curatenie",
    title: "Banner Curățenie — Servicii Profesionale",
    shortDescription: "Banner 'Curățenie Birouri', 'Case', 'Industriale'.",
    seoTitle: "Banner Curatenie | Servicii Menaj | Prynt",
    seoDescription: "Atrage clienți cu servicii de curățenie complete.",
    images: ["/products/banner/curatenie.jpg"],
    contentHtml: `<h2>Curățenie impecabilă</h2><p>Serviciile de curățenie sunt esențiale. Detaliază pachetele.</p><ul><li>Tipuri de curățenie</li><li>Produse ecologice</li><li>Program flexibil</li><li>Prețuri competitive</li></ul>`
  },
  "transport": {
    key: "transport",
    title: "Banner Transport — Mutări și Livrări",
    shortDescription: "Banner 'Transport Rapid', 'Mutări Internaționale'.",
    seoTitle: "Banner Transport | Mutari & Livrari | Prynt",
    seoDescription: "Anunță serviciile de transport cu vehicule moderne.",
    images: ["/products/banner/transport.jpg"],
    contentHtml: `<h2>Transport sigur</h2><p>Mutările sunt stresante. Oferă servicii de încredere.</p><ul><li>Tipuri de transport</li><li>Zona acoperită</li><li>Asigurare marfă</li><li>Contact 24/7</li></ul>`
  },
  "consultanta": {
    key: "consultanta",
    title: "Banner Consultanță — Experți în Afaceri",
    shortDescription: "Banner pentru consultanți financiari, IT sau business.",
    seoTitle: "Banner Consultanta | Expertiza Profesionala | Prynt",
    seoDescription: "Prezintă serviciile de consultanță cu credibilitate.",
    images: ["/products/banner/consultanta.jpg"],
    contentHtml: `<h2>Sfaturi de la experți</h2><p>Consultanța aduce succes. Include domeniile de specializare.</p><ul><li>Financiar</li><li>Management</li><li>IT și digital</li><li>Cazuri de succes</li></ul>`
  },
  "avocat": {
    key: "avocat",
    title: "Banner Avocat — Drept și Justiție",
    shortDescription: "Banner pentru cabinete de avocatură.",
    seoTitle: "Banner Avocat | Servicii Juridice | Prynt",
    seoDescription: "Promovează serviciile legale cu profesionalism.",
    images: ["/products/banner/avocat.jpg"],
    contentHtml: `<h2>Dreptate și onestitate</h2><p>Avocații apără drepturile. Detaliază specializările.</p><ul><li>Drept civil</li><li>Penal</li><li>Familial</li><li>Contact direct</li></ul>`
  },
  "medic": {
    key: "medic",
    title: "Banner Medic — Sănătate și Îngrijire",
    shortDescription: "Banner pentru cabinete medicale private.",
    seoTitle: "Banner Medic | Servicii Medicale | Prynt",
    seoDescription: "Atrage pacienți cu servicii de calitate.",
    images: ["/products/banner/medic.jpg"],
    contentHtml: `<h2>Sănătate prioritară</h2><p>Medicii salvează vieți. Include specialitățile.</p><ul><li>Consultații</li><li>Tratamente</li><li>Programări</li><li>Asigurări acceptate</li></ul>`
  },

  // --- EDUCAȚIE ---
  "universitate": {
    key: "universitate",
    title: "Banner Universitate — Înscrieri și Admitere",
    shortDescription: "Banner pentru universități și facultăți.",
    seoTitle: "Banner Universitate | Admitere & Studii | Prynt",
    seoDescription: "Promovează programele universitare cu un banner informativ.",
    images: ["/products/banner/universitate.jpg"],
    contentHtml: `<h2>Educație superioară</h2><p>Universitățile formează viitorul. Detaliază facultățile.</p><ul><li>Facultăți disponibile</li><li>Taxe de școlarizare</li><li>Burse oferite</li><li>Admitere online</li></ul>`
  },
  "facultate": {
    key: "facultate",
    title: "Banner Facultate — Specializări și Cursuri",
    shortDescription: "Banner specific pentru fiecare facultate.",
    seoTitle: "Banner Facultate | Studii Specializate | Prynt",
    seoDescription: "Atrage studenți cu programe atractive.",
    images: ["/products/banner/facultate.jpg"],
    contentHtml: `<h2>Cunoașterea contează</h2><p>Facultățile oferă specializări diverse. Include beneficiile.</p><ul><li>Specializări</li><li>Durata studiilor</li><li>Diplome recunoscute</li><li>Cariere posibile</li></ul>`
  },
  "liceu": {
    key: "liceu",
    title: "Banner Liceu — Înscrieri Clasele IX-XII",
    shortDescription: "Banner pentru licee și școli generale.",
    seoTitle: "Banner Liceu | Educatie Secundara | Prynt",
    seoDescription: "Promovează liceul cu rezultate și activități.",
    images: ["/products/banner/liceu.jpg"],
    contentHtml: `<h2>Pregătire pentru viitor</h2><p>Liceele dezvoltă talentele. Detaliază profilurile.</p><ul><li>Profiluri disponibile</li><li>Rezultate examen</li><li>Activități extracurriculare</li><li>Înscrieri deschise</li></ul>`
  },
  "gimnaziu": {
    key: "gimnaziu",
    title: "Banner Gimnaziu — Clasele V-VIII",
    shortDescription: "Banner pentru școli gimnaziale.",
    seoTitle: "Banner Gimnaziu | Educatie Gimnaziala | Prynt",
    seoDescription: "Atrage elevi cu un mediu educațional prietenos.",
    images: ["/products/banner/gimnaziu.jpg"],
    contentHtml: `<h2>Învățare distractivă</h2><p>Gimnaziul este etapa de formare. Include facilitățile.</p><ul><li>Materii studiate</li><li>Profesori calificați</li><li>Cantine și săli sport</li><li>Programe afterschool</li></ul>`
  },
  "gradinita": {
    key: "gradinita",
    title: "Banner Grădiniță — Înscrieri Copii",
    shortDescription: "Banner colorat pentru grădinițe private.",
    seoTitle: "Banner Gradinita | Educatie Prescolara | Prynt",
    seoDescription: "Promovează grădinița cu activități creative.",
    images: ["/products/banner/gradinita.jpg"],
    contentHtml: `<h2>Primii pași în educație</h2><p>Grădinițele dezvoltă copii fericiți. Detaliază programele.</p><ul><li>Vârste acceptate</li><li>Activități zilnice</li><li>Mese sănătoase</li><li>Înscrieri disponibile</li></ul>`
  },
  "afterschool": {
    key: "afterschool",
    title: "Banner Afterschool — Meditații și Activități",
    shortDescription: "Banner pentru centre afterschool.",
    seoTitle: "Banner Afterschool | Meditatii & Hobby | Prynt",
    seoDescription: "Atrage copii cu programe interesante.",
    images: ["/products/banner/afterschool.jpg"],
    contentHtml: `<h2>Învățare după școală</h2><p>Afterschool-ul completează educația. Include disciplinele.</p><ul><li>Meditații școlare</li><li>Arte și sport</li><li>Ore suplimentare</li><li>Supraveghere atentă</li></ul>`
  },
  "meditatii": {
    key: "meditatii",
    title: "Banner Meditații — Îmbunătățire Note",
    shortDescription: "Banner 'Meditații Matematică', 'Limbi Străine'.",
    seoTitle: "Banner Meditatii | Ajutor Scolar | Prynt",
    seoDescription: "Oferă meditații personalizate cu rezultate.",
    images: ["/products/banner/meditatii.jpg"],
    contentHtml: `<h2>Note mai bune</h2><p>Meditațiile ajută elevii să exceleze. Detaliază materiile.</p><ul><li>Materii disponibile</li><li>Profesori experimentați</li><li>Sesiuni individuale</li><li>Rezultate garantate</li></ul>`
  },
  "examene": {
    key: "examene",
    title: "Banner Examene — Pregătire Intensivă",
    shortDescription: "Banner pentru centre de pregătire examene.",
    seoTitle: "Banner Examene | Pregatire Admitere | Prynt",
    seoDescription: "Ajută studenții să treacă examenele cu succes.",
    images: ["/products/banner/examene.jpg"],
    contentHtml: `<h2>Succes la examene</h2><p>Pregătirea este cheia. Include tipurile de examene.</p><ul><li>Admitere universitate</li><li>Bacalaureat</li><li>Concursuri</li><li>Simulări gratuite</li></ul>`
  },

  // --- IMOBILIARE SUPLIMENTAR ---
  "teren": {
    key: "teren",
    title: "Banner Teren — Vânzare Loturi",
    shortDescription: "Banner pentru terenuri agricole sau de construcție.",
    seoTitle: "Banner Teren | Loturi de Vanzare | Prynt",
    seoDescription: "Semnalizează terenul cu suprafața și prețul.",
    images: ["/products/banner/teren.jpg"],
    contentHtml: `<h2>Teren perfect</h2><p>Terenurile sunt investiții bune. Detaliază caracteristicile.</p><ul><li>Suprafața totală</li><li>Utilizare permisă</li><li>Acces la utilități</li><li>Preț negociabil</li></ul>`
  },
  "birou": {
    key: "birou",
    title: "Banner Birou — Spații de Lucru",
    shortDescription: "Banner 'Birouri de Închiriat', 'Coworking'.",
    seoTitle: "Banner Birou | Spatii Office | Prynt",
    seoDescription: "Promovează spațiile de birouri moderne.",
    images: ["/products/banner/birou.jpg"],
    contentHtml: `<h2>Loc de muncă ideal</h2><p>Birourile productive cresc eficiența. Include facilitățile.</p><ul><li>Metr pătrați</li><li>Facilități incluse</li><li>Chirie lunară</li><li>Locație centrală</li></ul>`
  },
  "spatiu-comercial-supl": {
    key: "spatiu-comercial-supl",
    title: "Banner Spațiu Comercial — Magazine și Ateliere",
    shortDescription: "Banner pentru spații comerciale diverse.",
    seoTitle: "Banner Spatiu Comercial | Magazine & Ateliere | Prynt",
    seoDescription: "Atrage afaceri în spațiul tău comercial.",
    images: ["/products/banner/spatiu-comercial.jpg"],
    contentHtml: `<h2>Afacere profitabilă</h2><p>Spațiile comerciale sunt căutate. Detaliază avantajele.</p><ul><li>Tipul spațiului</li><li>Zona comercială</li><li>Parcare inclusă</li><li>Preț de închiriere</li></ul>`
  },
  "depozit": {
    key: "depozit",
    title: "Banner Depozit — Stocare și Logistică",
    shortDescription: "Banner pentru depozite și hale industriale.",
    seoTitle: "Banner Depozit | Stocare Marfa | Prynt",
    seoDescription: "Oferă soluții de depozitare sigure.",
    images: ["/products/banner/depozit.jpg"],
    contentHtml: `<h2>Depozitare sigură</h2><p>Depozitele protejează marfa. Include capacitățile.</p><ul><li>Suprafață depozit</li><li>Sisteme securitate</li><li>Acces ușor</li><li>Prețuri competitive</li></ul>`
  },
  "garaj": {
    key: "garaj",
    title: "Banner Garaj — Parcări și Boxe",
    shortDescription: "Banner 'Garaje de Închiriat', 'Boxe Auto'.",
    seoTitle: "Banner Garaj | Parcari & Boxe | Prynt",
    seoDescription: "Promovează garajele disponibile în zonă.",
    images: ["/products/banner/garaj.jpg"],
    contentHtml: `<h2>Parcare acoperită</h2><p>Garajele protejează mașinile. Detaliază dimensiunile.</p><ul><li>Dimensiuni box</li><li>Sistem închidere</li><li>Preț lunar</li><li>Locație sigură</li></ul>`
  },
  "schimb": {
    key: "schimb",
    title: "Banner Schimb — Apartamente și Case",
    shortDescription: "Banner 'Schimb Apartament', 'Casă contra Apartament'.",
    seoTitle: "Banner Schimb | Imobiliare Schimb | Prynt",
    seoDescription: "Facilitează schimburile imobiliare cu transparență.",
    images: ["/products/banner/schimb.jpg"],
    contentHtml: `<h2>Schimb avantajos</h2><p>Schimburile economisesc bani. Include detaliile proprietăților.</p><ul><li>Proprietatea oferită</li><li>Cea dorită</li><li>Diferența de preț</li><li>Contact direct</li></ul>`
  },
  "donatie": {
    key: "donatie",
    title: "Banner Donație — Ajutor pentru Nevoiți",
    shortDescription: "Banner pentru campanii de strângere fonduri.",
    seoTitle: "Banner Donatie | Ajutor Social | Prynt",
    seoDescription: "Încurajează donațiile cu un mesaj emoțional.",
    images: ["/products/banner/donatie.jpg"],
    contentHtml: `<h2>Ajută-i pe cei în nevoie</h2><p>Donațiile schimbă vieți. Detaliază cauza și impactul.</p><ul><li>Cauza sprijinită</li><li>Cum să donezi</li><li>Impactul donației</li><li>Transparență totală</li></ul>`
  },
  "voluntariat": {
    key: "voluntariat",
    title: "Banner Voluntariat — Alătură-te Cauzei",
    shortDescription: "Banner pentru recrutare voluntari.",
    seoTitle: "Banner Voluntariat | Activitati Sociale | Prynt",
    seoDescription: "Atrage voluntari cu proiecte semnificative.",
    images: ["/products/banner/voluntariat.jpg"],
    contentHtml: `<h2>Fă diferența</h2><p>Voluntariatul aduce satisfacție. Include activitățile disponibile.</p><ul><li>Proiecte active</li><li>Ore de voluntariat</li><li>Beneficii pentru tine</li><li>Înscriere ușoară</li></ul>`
  },
  "adoptie": {
    key: "adoptie",
    title: "Banner Adoptie — Caută Familie",
    shortDescription: "Banner pentru animale sau copii în adopție.",
    seoTitle: "Banner Adoptie | Animale & Copii | Prynt",
    seoDescription: "Promovează adopția cu povești emoționante.",
    images: ["/products/banner/adoptie.jpg"],
    contentHtml: `<h2>Dă o casă</h2><p>Adopția salvează vieți. Detaliază animalele sau copiii disponibili.</p><ul><li>Descriere completă</li><li>Vârsta și caracter</li><li>Cerințe adopție</li><li>Contact centru</li></ul>`
  },

  // --- SEZONALE ȘI SĂRBĂTORI ---
  "revelion": {
    key: "revelion",
    title: "Banner Revelion — An Nou Fericit",
    shortDescription: "Banner 'Revelion 2025', 'Petrecere An Nou'.",
    seoTitle: "Banner Revelion | Sarbatori An Nou | Prynt",
    seoDescription: "Anunță petrecerea de Revelion cu muzică și distracție.",
    images: ["/products/banner/revelion.jpg"],
    contentHtml: `<h2>Bun venit 2025!</h2><p>Revelionul este noaptea magică. Detaliază programul.</p><ul><li>Muzică live</li><li>Meniu festivist</li><li>Preț bilet</li><li>Rezervări acum</li></ul>`
  },
  "ziua-mamei": {
    key: "ziua-mamei",
    title: "Banner Ziua Mamei — Sărbătoriți Mama",
    shortDescription: "Banner pentru evenimente dedicate mamelor.",
    seoTitle: "Banner Ziua Mamei | Sarbatori Familiale | Prynt",
    seoDescription: "Promovează evenimente speciale pentru Ziua Mamei.",
    images: ["/products/banner/ziua-mamei.jpg"],
    contentHtml: `<h2>Mulțumesc, mamă!</h2><p>Ziua Mamei este sărbătoare de iubire. Include activitățile.</p><ul><li>Cadourile ideale</li><li>Evenimente speciale</li><li>Mese festive</li><li>Mesaje de iubire</li></ul>`
  },
  "ziua-tatalui": {
    key: "ziua-tatalui",
    title: "Banner Ziua Tatălui — Onorează Tatăl",
    shortDescription: "Banner pentru sărbătorirea taților.",
    seoTitle: "Banner Ziua Tatalui | Sarbatori Familiale | Prynt",
    seoDescription: "Dedică o zi specială taților cu evenimente memorabile.",
    images: ["/products/banner/ziua-tatalui.jpg"],
    contentHtml: `<h2>Eroul familiei</h2><p>Tații merită recunoașterea. Detaliază sărbătorile.</p><ul><li>Activități pentru tați</li><li>Cadourile potrivite</li><li>Petreceri familiale</li><li>Mesaje de apreciere</li></ul>`
  },
  "ziua-copiilor": {
    key: "ziua-copiilor",
    title: "Banner Ziua Copiilor — Distracție pentru Micuți",
    shortDescription: "Banner pentru evenimente dedicate copiilor.",
    seoTitle: "Banner Ziua Copiilor | Sarbatori pentru Copii | Prynt",
    seoDescription: "Organizează sărbători pline de bucurie pentru copii.",
    images: ["/products/banner/ziua-copiilor.jpg"],
    contentHtml: `<h2>Zâmbește și joacă!</h2><p>Copiii iubesc sărbătorile. Include activitățile distractive.</p><ul><li>Jocuri și concursuri</li><li>Animatori profesioniști</li><li>Cadourile pentru toți</li><li>Mese colorate</li></ul>`
  },
  "valentine": {
    key: "valentine",
    title: "Banner Valentine — Ziua Îndrăgostiților",
    shortDescription: "Banner romantic pentru evenimente de Valentine.",
    seoTitle: "Banner Valentine | Ziua Indragostitilor | Prynt",
    seoDescription: "Creează atmosferă romantică cu bannere speciale.",
    images: ["/products/banner/valentine.jpg"],
    contentHtml: `<h2>Iubire eternă</h2><p>Valentine este ziua iubirii. Detaliază surprizele.</p><ul><li>Cina romantică</li><li>Cadourile ideale</li><li>Petreceri cuplu</li><li>Mesaje dulci</li></ul>`
  },
  "martisor": {
    key: "martisor",
    title: "Banner Martisor — Primăvară și Iubire",
    shortDescription: "Banner pentru sărbătoarea Martisorului.",
    seoTitle: "Banner Martisor | Sarbatoarea Primaverii | Prynt",
    seoDescription: "Anunță evenimente tradiționale cu bannere colorate.",
    images: ["/products/banner/martisor.jpg"],
    contentHtml: `<h2>Primăvara vine!</h2><p>Martisorul aduce noroc. Include tradițiile.</p><ul><li>Martisoare handmade</li><li>Evenimente culturale</li><li>Ateliere creative</li><li>Sărbători populare</li></ul>`
  },
  "ziua-nationala": {
    key: "ziua-nationala",
    title: "Banner Ziua Națională — Patriotism și Tradiție",
    shortDescription: "Banner pentru sărbători naționale.",
    seoTitle: "Banner Ziua Nationala | Sarbatori Patriotice | Prynt",
    seoDescription: "Creează spirit patriotic cu evenimente speciale.",
    images: ["/products/banner/ziua-nationala.jpg"],
    contentHtml: `<h2>Mândri de țara noastră</h2><p>Ziua Națională unește poporul. Detaliază manifestările.</p><ul><li>Parade și defilări</li><li>Concerte patriotice</li><li>Expoziții culturale</li><li>Activități familiale</li></ul>`
  },

  // --- SPORT ---
  "fotbal": {
    key: "fotbal",
    title: "Banner Fotbal — Meciuri și Antrenamente",
    shortDescription: "Banner pentru cluburi de fotbal sau evenimente sportive.",
    seoTitle: "Banner Fotbal | Cluburi & Meciuri | Prynt",
    seoDescription: "Promovează echipa cu bannere pasionale.",
    images: ["/products/banner/fotbal.jpg"],
    contentHtml: `<h2>Goluri și pasiune</h2><p>Fotbalul unește fanii. Include programul meciurilor.</p><ul><li>Echipa favorită</li><li>Meciuri viitoare</li><li>Antrenamente</li><li>Înscrieri jucători</li></ul>`
  },
  "baschet": {
    key: "baschet",
    title: "Banner Baschet — Coșuri și Abilități",
    shortDescription: "Banner pentru echipe de baschet.",
    seoTitle: "Banner Baschet | Echipe & Campionate | Prynt",
    seoDescription: "Atrage jucători talentați cu bannere dinamice.",
    images: ["/products/banner/baschet.jpg"],
    contentHtml: `<h2>Coș după coș</h2><p>Baschetul dezvoltă agilitatea. Detaliază echipa.</p><ul><li>Jucători cheie</li><li>Campionate</li><li>Antrenori</li><li>Înscrieri deschise</li></ul>`
  },
  "volei": {
    key: "volei",
    title: "Banner Volei — Lovituri și Apărare",
    shortDescription: "Banner pentru cluburi de volei.",
    seoTitle: "Banner Volei | Echipe & Meciuri | Prynt",
    seoDescription: "Promovează voleiul cu bannere energice.",
    images: ["/products/banner/volei.jpg"],
    contentHtml: `<h2>Putere în echipă</h2><p>Voleiul cere echipă. Include rezultatele recente.</p><ul><li>Meciuri câștigate</li><li>Jucători vedetă</li><li>Antrenamente</li><li>Spirit de echipă</li></ul>`
  },
  "handbal": {
    key: "handbal",
    title: "Banner Handbal — Precizie și Viteză",
    shortDescription: "Banner pentru echipe de handbal.",
    seoTitle: "Banner Handbal | Campionate & Goluri | Prynt",
    seoDescription: "Atrage suporteri cu bannere motivante.",
    images: ["/products/banner/handbal.jpg"],
    contentHtml: `<h2>Goluri spectaculoase</h2><p>Handbalul este rapid. Detaliază performanțele.</p><ul><li>Goluri marcate</li><li>Jucători importanți</li><li>Campionate</li><li>Fani pasionați</li></ul>`
  },
  "atletism": {
    key: "atletism",
    title: "Banner Atletism — Viteză și Rezistență",
    shortDescription: "Banner pentru cluburi de atletism.",
    seoTitle: "Banner Atletism | Competitii & Recorduri | Prynt",
    seoDescription: "Încurajează sportivii cu bannere inspiraționale.",
    images: ["/products/banner/atletism.jpg"],
    contentHtml: `<h2>Depășește limitele</h2><p>Atletismul testează limitele. Include probele.</p><ul><li>Alergare</li><li>Sărituri</li><li>Aruncări</li><li>Recorduri personale</li></ul>`
  },
  "gimnastica": {
    key: "gimnastica",
    title: "Banner Gimnastică — Grație și Forță",
    shortDescription: "Banner pentru săli de gimnastică.",
    seoTitle: "Banner Gimnastica | Sali & Competitii | Prynt",
    seoDescription: "Promovează gimnastica cu bannere elegante.",
    images: ["/products/banner/gimnastica.jpg"],
    contentHtml: `<h2>Mișcare armonioasă</h2><p>Gimnastica dezvoltă corpul. Detaliază clasele.</p><ul><li>Clase pentru copii</li><li>Antrenori calificați</li><li>Competiții</li><li>Echipamente moderne</li></ul>`
  },

  // --- MUZICĂ ȘI ARTĂ ---
  "jazz": {
    key: "jazz",
    title: "Banner Jazz — Improvizație și Ritm",
    shortDescription: "Banner pentru evenimente jazz.",
    seoTitle: "Banner Jazz | Concerte & Festivaluri | Prynt",
    seoDescription: "Atrage melomani cu bannere sofisticate.",
    images: ["/products/banner/jazz.jpg"],
    contentHtml: `<h2>Muzică soul</h2><p>Jazz-ul captivează. Include artiștii invitați.</p><ul><li>Trupe jazz</li><li>Concerte live</li><li>Atmosferă relaxată</li><li>Bilete disponibile</li></ul>`
  },
  "rock": {
    key: "rock",
    title: "Banner Rock — Energie și Rebeliune",
    shortDescription: "Banner pentru concerte rock.",
    seoTitle: "Banner Rock | Concerte & Festivaluri | Prynt",
    seoDescription: "Creează hype cu bannere rock.",
    images: ["/products/banner/rock.jpg"],
    contentHtml: `<h2>Rock 'n' roll forever</h2><p>Rock-ul energizează. Detaliază lineup-ul.</p><ul><li>Trupe rock</li><li>Muzică puternică</li><li>Fani entuziaști</li><li>Concerte memorabile</li></ul>`
  },
  "pop": {
    key: "pop",
    title: "Banner Pop — Dans și Melodii",
    shortDescription: "Banner pentru evenimente pop.",
    seoTitle: "Banner Pop | Concerte & Show-uri | Prynt",
    seoDescription: "Promovează muzica pop cu bannere colorate.",
    images: ["/products/banner/pop.jpg"],
    contentHtml: `<h2>Muzică pentru toți</h2><p>Pop-ul este catchy. Include hiturile.</p><ul><li>Artisti populari</li><li>Dansuri</li><li>Show-uri live</li><li>Fani tineri</li></ul>`
  },
  "folk": {
    key: "folk",
    title: "Banner Folk — Tradiție și Cântec",
    shortDescription: "Banner pentru muzică folk românească.",
    seoTitle: "Banner Folk | Muzica Traditionala | Prynt",
    seoDescription: "Creează atmosferă tradițională cu bannere folk.",
    images: ["/products/banner/folk.jpg"],
    contentHtml: `<h2>Rădăcini românești</h2><p>Folk-ul ne unește. Detaliază cântecele.</p><ul><li>Cântece populare</li><li>Instrumente tradiționale</li><li>Festivaluri</li><li>Cultură autentică</li></ul>`
  },
  "opera": {
    key: "opera",
    title: "Banner Operă — Artă și Emoție",
    shortDescription: "Banner pentru spectacole de operă.",
    seoTitle: "Banner Opera | Spectacole Clasice | Prynt",
    seoDescription: "Promovează opera cu bannere elegante.",
    images: ["/products/banner/opera.jpg"],
    contentHtml: `<h2>Emoție pură</h2><p>Opera impresionează. Include reprezentațiile.</p><ul><li>Operă clasică</li><li>Soliști celebri</li><li>Orchestră</li><li>Bilete premium</li></ul>`
  },
  "balet": {
    key: "balet",
    title: "Banner Balet — Grație și Eleganță",
    shortDescription: "Banner pentru trupe de balet.",
    seoTitle: "Banner Balet | Spectacole de Dans | Prynt",
    seoDescription: "Atrage publicul cu bannere sofisticate.",
    images: ["/products/banner/balet.jpg"],
    contentHtml: `<h2>Dans divin</h2><p>Baletul este artă. Detaliază coregrafiile.</p><ul><li>Dansatori profesioniști</li><li>Coregrafii originale</li><li>Muzică clasică</li><li>Spectacole magice</li></ul>`
  },
  "pictura": {
    key: "pictura",
    title: "Banner Pictură — Expoziții și Ateliere",
    shortDescription: "Banner pentru artiști plastici.",
    seoTitle: "Banner Pictura | Expozitii Artistice | Prynt",
    seoDescription: "Promovează arta plastică cu bannere creative.",
    images: ["/products/banner/pictura.jpg"],
    contentHtml: `<h2>Culori și forme</h2><p>Pictura exprimă sufletul. Include tehnicile.</p><ul><li>Expoziții</li><li>Ateliere creative</li><li>Artiști locali</li><li>Vânzări tablouri</li></ul>`
  },
  "sculptura": {
    key: "sculptura",
    title: "Banner Sculptură — Forme și Texturi",
    shortDescription: "Banner pentru sculptori și expoziții.",
    seoTitle: "Banner Sculptura | Arta 3D | Prynt",
    seoDescription: "Atrage vizitatori cu bannere sculpturale.",
    images: ["/products/banner/sculptura.jpg"],
    contentHtml: `<h2>Artă tridimensională</h2><p>Sculptura dă viață materialelor. Detaliază lucrările.</p><ul><li>Materiale folosite</li><li>Tehnici sculpturale</li><li>Expoziții</li><li>Comenzi personalizate</li></ul>`
  },
  "fotografie": {
    key: "fotografie",
    title: "Banner Fotografie — Capturi de Momente",
    shortDescription: "Banner pentru fotografi și expoziții foto.",
    seoTitle: "Banner Fotografie | Expozitii & Portrete | Prynt",
    seoDescription: "Promovează fotografia cu bannere vizuale.",
    images: ["/products/banner/fotografie.jpg"],
    contentHtml: `<h2>Momente eterne</h2><p>Fotografia surprinde esența. Include genurile.</p><ul><li>Portrete</li><li>Peisaje</li><li>Evenimente</li><li>Sesiuni foto</li></ul>`
  },
  "film": {
    key: "film",
    title: "Banner Film — Proiecții și Festivaluri",
    shortDescription: "Banner pentru evenimente cinematografice.",
    seoTitle: "Banner Film | Festivaluri & Proiectii | Prynt",
    seoDescription: "Atrage cinefili cu bannere cinematografice.",
    images: ["/products/banner/film.jpg"],
    contentHtml: `<h2>Lumi imaginare</h2><p>Filmul povestește. Detaliază proiecțiile.</p><ul><li>Festivaluri</li><li>Filme independente</li><li>Proiecții gratuite</li><li>Dezbateri</li></ul>`
  },

  // --- TEHNOLOGIE ȘI INOVARE ---
  "conferinta-tech": {
    key: "conferinta-tech",
    title: "Banner Conferință Tech — Inovație și Viitor",
    shortDescription: "Banner pentru evenimente tech.",
    seoTitle: "Banner Conferinta Tech | Tehnologie & Inovare | Prynt",
    seoDescription: "Promovează conferințe tech cu bannere moderne.",
    images: ["/products/banner/conferinta-tech.jpg"],
    contentHtml: `<h2>Tehnologia viitorului</h2><p>Conferințele tech inspiră. Include speakerii.</p><ul><li>Speakeri celebri</li><li>Subiecte actuale</li><li>Networking</li><li>Inovații prezentate</li></ul>`
  },
  "hackathon": {
    key: "hackathon",
    title: "Banner Hackathon — Programare Intensivă",
    shortDescription: "Banner pentru competiții de programare.",
    seoTitle: "Banner Hackathon | Competitii Coding | Prynt",
    seoDescription: "Atrage developeri cu bannere tech.",
    images: ["/products/banner/hackathon.jpg"],
    contentHtml: `<h2>Codează viitorul</h2><p>Hackathon-urile creează soluții. Detaliază provocările.</p><ul><li>Provocări tech</li><li>Premii atractive</li><li>Mentori</li><li>Echipe formate</li></ul>`
  },
  "startup-pitch": {
    key: "startup-pitch",
    title: "Banner Startup Pitch — Prezentări de Afaceri",
    shortDescription: "Banner pentru evenimente startup.",
    seoTitle: "Banner Startup Pitch | Afaceri Inovatoare | Prynt",
    seoDescription: "Promovează startup-uri cu bannere dinamice.",
    images: ["/products/banner/startup-pitch.jpg"],
    contentHtml: `<h2>Idei revoluționare</h2><p>Pitch-urile conving investitori. Include ideile.</p><ul><li>Startup-uri participante</li><li>Investitori prezenți</li><li>Premii</li><li>Networking</li></ul>`
  },

  // --- SĂNĂTATE ȘI BINESTARE ---
  "vaccin": {
    key: "vaccin",
    title: "Banner Vaccin — Protecție și Sănătate",
    shortDescription: "Banner pentru campanii de vaccinare.",
    seoTitle: "Banner Vaccin | Campanii de Imunizare | Prynt",
    seoDescription: "Încurajează vaccinarea cu mesaje pozitive.",
    images: ["/products/banner/vaccin.jpg"],
    contentHtml: `<h2>Sănătate pentru toți</h2><p>Vaccinurile protejează. Detaliază beneficiile.</p><ul><li>Vaccinuri disponibile</li><li>Programări</li><li>Efecte secundare minime</li><li>Protecție comunitară</li></ul>`
  },
  "donare-sange": {
    key: "donare-sange",
    title: "Banner Donare Sânge — Salvează Vieți",
    shortDescription: "Banner pentru centre de donare sânge.",
    seoTitle: "Banner Donare Sange | Acte de Binefacere | Prynt",
    seoDescription: "Încurajează donarea cu bannere emoționante.",
    images: ["/products/banner/donare-sange.jpg"],
    contentHtml: `<h2>Un gest simplu, vieți salvate</h2><p>Donarea sânge ajută. Include condițiile.</p><ul><li>Cine poate dona</li><li>Procesul donării</li><li>Beneficii pentru donator</li><li>Urgențe acoperite</li></ul>`
  },
  "campanie-preventie": {
    key: "campanie-preventie",
    title: "Banner Campanie Prevenție — Sănătate Preventivă",
    shortDescription: "Banner pentru campanii de prevenție boli.",
    seoTitle: "Banner Campanie Preventie | Sanatate Publica | Prynt",
    seoDescription: "Educa populația cu bannere informative.",
    images: ["/products/banner/campanie-preventie.jpg"],
    contentHtml: `<h2>Prevenția salvează vieți</h2><p>Campaniile educă. Detaliază sfaturile.</p><ul><li>Boli prevenite</li><li>Sfaturi practice</li><li>Screening gratuit</li><li>Specialiști implicați</li></ul>`
  },
  "fitness": {
    key: "fitness",
    title: "Banner Fitness — Mișcare și Sănătate",
    shortDescription: "Banner pentru săli de fitness.",
    seoTitle: "Banner Fitness | Sali Sport & Antrenamente | Prynt",
    seoDescription: "Motivați-vă cu bannere fitness.",
    images: ["/products/banner/fitness.jpg"],
    contentHtml: `<h2>Corp sănătos, minte puternică</h2><p>Fitness-ul transformă. Include antrenamentele.</p><ul><li>Antrenori personali</li><li>Echipamente moderne</li><li>Clase de grup</li><li>Abonamente flexibile</li></ul>`
  },
  "yoga": {
    key: "yoga",
    title: "Banner Yoga — Echilibru și Relaxare",
    shortDescription: "Banner pentru centre de yoga.",
    seoTitle: "Banner Yoga | Relaxare & Meditatie | Prynt",
    seoDescription: "Promovează yoga cu bannere zen.",
    images: ["/products/banner/yoga.jpg"],
    contentHtml: `<h2>Pace interioară</h2><p>Yoga aduce armonie. Detaliază stilurile.</p><ul><li>Yoga hatha</li><li>Meditatie</li><li>Clase pentru începători</li><li>Beneficii mentale</li></ul>`
  },

  // --- MEDIU ȘI ECOLOGIE ---
  "ecologie": {
    key: "ecologie",
    title: "Banner Ecologie — Protejarea Planetei",
    shortDescription: "Banner pentru campanii ecologice.",
    seoTitle: "Banner Ecologie | Mediu & Protectie | Prynt",
    seoDescription: "Încurajează acțiuni eco cu bannere verzi.",
    images: ["/products/banner/ecologie.jpg"],
    contentHtml: `<h2>Pământul nostru</h2><p>Ecologia este viitorul. Include acțiunile.</p><ul><li>Reciclare</li><li>Plantări de copaci</li><li>Energie verde</li><li>Comunitate implicată</li></ul>`
  },
  "reciclare": {
    key: "reciclare",
    title: "Banner Reciclare — Reutilizare și Economie",
    shortDescription: "Banner pentru centre de reciclare.",
    seoTitle: "Banner Reciclare | Protectia Mediului | Prynt",
    seoDescription: "Educa despre reciclare cu bannere utile.",
    images: ["/products/banner/reciclare.jpg"],
    contentHtml: `<h2>Reciclează inteligent</h2><p>Reciclarea economisește resurse. Detaliază materialele.</p><ul><li>Hârtie și carton</li><li>Plastic și sticlă</li><li>Electrocasnice</li><li>Puncte de colectare</li></ul>`
  },
  "protejarea-mediului": {
    key: "protejarea-mediului",
    title: "Banner Protejarea Mediului — Acțiuni Concrete",
    shortDescription: "Banner pentru proiecte de mediu.",
    seoTitle: "Banner Protejarea Mediului | Ecologie & Actiune | Prynt",
    seoDescription: "Mobilizează comunitatea cu bannere motivaționale.",
    images: ["/products/banner/protejarea-mediului.jpg"],
    contentHtml: `<h2>Împreună pentru planetă</h2><p>Protejarea mediului este datoria noastră. Include proiectele.</p><ul><li>Curățenie zone</li><li>Conservare biodiversitate</li><li>Educație ecologică</li><li>Rezultate vizibile</li></ul>`
  },

  // --- CARITATE ȘI ONG ---
  "fundatie": {
    key: "fundatie",
    title: "Banner Fundație — Ajutor pentru Comunitate",
    shortDescription: "Banner pentru fundații caritabile.",
    seoTitle: "Banner Fundatie | Activitati Caritabile | Prynt",
    seoDescription: "Promovează fundația cu bannere de impact.",
    images: ["/products/banner/fundatie.jpg"],
    contentHtml: `<h2>Ajutor real</h2><p>Fundațiile schimbă vieți. Detaliază proiectele.</p><ul><li>Cauze sprijinite</li><li>Proiecte active</li><li>Donații primite</li><li>Impact comunitar</li></ul>`
  },
  "ong": {
    key: "ong",
    title: "Banner ONG — Organizații Non-Guvernamentale",
    shortDescription: "Banner pentru ONG-uri locale.",
    seoTitle: "Banner ONG | Activitati Sociale | Prynt",
    seoDescription: "Atrage voluntari cu bannere inspiraționale.",
    images: ["/products/banner/ong.jpg"],
    contentHtml: `<h2>Schimbare pozitivă</h2><p>ONG-urile fac diferența. Include misiunea.</p><ul><li>Misiunea organizației</li><li>Proiecte curente</li><li>Voluntari căutați</li><li>Rezultate obținute</li></ul>`
  },
  "ajutor-umanitar": {
    key: "ajutor-umanitar",
    title: "Banner Ajutor Umanitar — Sprijin în Crize",
    shortDescription: "Banner pentru campanii umanitare.",
    seoTitle: "Banner Ajutor Umanitar | Sprijin Social | Prynt",
    seoDescription: "Mobilizează ajutor cu bannere urgente.",
    images: ["/products/banner/ajutor-umanitar.jpg"],
    contentHtml: `<h2>Solidaritate umană</h2><p>Ajutorul umanitar salvează. Detaliază nevoile.</p><ul><li>Nevoi urgente</li><li>Cum să ajuți</li><li>Distribuție ajutoare</li><li>Transparență totală</li></ul>`
  }
};
