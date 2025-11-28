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
    images: ["/products/banner/vanzare.webp"],
    contentHtml: `<h2>Vinde rapid proprietatea</h2><p>Cel mai simplu și eficient mod de a vinde. Include numărul tău de telefon mare și vizibil.</p>`
  },
  "de-inchiriat": {
    key: "de-inchiriat",
    title: "Banner DE ÎNCHIRIAT — Găsește Chiriași",
    shortDescription: "Banner 'DE ÎNCHIRIAT' vizibil de la distanță pentru apartamente și spații comerciale.",
    seoTitle: "Banner De Închiriat | Imobiliare | Prynt",
    seoDescription: "Semnalizează spațiul disponibil cu un banner rezistent. Livrare oriunde în țară.",
    images: ["/products/banner/de-inchiriat.webp"],
    contentHtml: `<h2>Închiriază rapid spațiul</h2><p>Ideal pentru balcoane, garduri sau geamuri. Material rezistent la intemperii.</p>`
  },
  "vand-teren": {
    key: "vand-teren",
    title: "Banner VÂND TEREN — Semnalizare Loturi",
    shortDescription: "Banner specific pentru terenuri intravilane/extravilane. Rezistent la vânt și soare.",
    seoTitle: "Banner Vand Teren | Intravilan & Extravilan | Prynt",
    seoDescription: "Bannere mari pentru vânzare terenuri. Se pot monta pe țăruși sau garduri.",
    images: ["/products/banner/teren-de-vanzare.webp"],
    contentHtml: `<h2>Semnalizează terenul direct la locație</h2><p>Cumpărătorii de terenuri vizitează zona. Asigură-te că văd numărul tău.</p>`
  },
  "spatiu-comercial": {
    key: "spatiu-comercial",
    title: "Banner SPAȚIU COMERCIAL — Vânzare/Închiriere",
    shortDescription: "Banner pentru vitrine spații comerciale. 'De Închiriat' sau 'De Vânzare'.",
    seoTitle: "Banner Spatiu Comercial | Vitrine & Fatade | Prynt",
    seoDescription: "Atrage afaceri în spațiul tău. Banner printat la rezoluție mare pentru impact vizual.",
    images: ["/products/banner/spatiu-de-inchiriat.webp"],
    contentHtml: `<h2>Valorifică spațiul comercial</h2><p>Un banner profesional crește valoarea percepută a spațiului.</p>`
  },
  "dezvoltator-imobiliar": {
    key: "dezvoltator-imobiliar",
    title: "Bannere Dezvoltatori Imobiliari — Ansambluri Rezidențiale",
    shortDescription: "Mesh-uri și bannere gigant pentru șantiere și blocuri în construcție.",
    seoTitle: "Print Outdoor Dezvoltatori Imobiliari | Mesh & Banner | Prynt",
    seoDescription: "Soluții complete pentru dezvoltatori: bannere gard, mesh fațadă, panouri investiție.",
    images: ["/products/banner/Vila-de-vanzare.webp"],
    contentHtml: `<h2>Branding de șantier</h2><p>Transformă șantierul în cel mai bun agent de vânzări cu randări fotorealiste pe mesh.</p>`
  },

  // --- AUTO & MOTO ---
  "service-auto": {
    key: "service-auto",
    title: "Banner Service Auto — Mecanică & Diagnoză",
    shortDescription: "Semnalizează atelierul tău. 'Mecanică', 'Electrică', 'Diagnoză'.",
    seoTitle: "Banner Service Auto | Reclama Atelier Mecanic | Prynt",
    seoDescription: "Banner service auto rezistent la ulei și exterior. Atrage clienți din trafic.",
    images: ["/products/banner/service-auto.webp"],
    contentHtml: `<h2>Vizibilitate pentru Service-ul tău</h2><p>Listează serviciile principale pentru a atrage șoferii care trec prin zonă.</p>`
  },
  "vulcanizare": {
    key: "vulcanizare",
    title: "Banner Vulcanizare — Schimb Anvelope",
    shortDescription: "Banner 'VULCANIZARE', 'SCHIMB ROȚI', 'ECHILIBRARE'.",
    seoTitle: "Banner Vulcanizare & Roti | Semnalistica Auto | Prynt",
    seoDescription: "Pregătește-te de sezon. Banner vulcanizare vizibil de la mare distanță.",
    images: ["/products/banner/Vulcanizare.webp"],
    contentHtml: `<h2>Nu rata sezonul de schimb anvelope</h2><p>Un banner mare cu 'DESCHIS' aduce clienți imediat.</p>`
  },
  "itp": {
    key: "itp",
    title: "Banner Stație ITP — Inspecție Tehnică",
    shortDescription: "Semnalizează stația ITP. 'ITP Fără Programare', 'ITP Rapid'.",
    seoTitle: "Banner ITP | Reclama Statie Inspectie Tehnica | Prynt",
    seoDescription: "Banner ITP autorizat. Text mare și clar pentru șoferi.",
    images: ["/products/banner/service-auto.webp"],
    contentHtml: `<h2>Atrage clienți la ITP</h2><p>Șoferii caută stații ITP vizibile și accesibile.</p>`
  },
  "spalatorie-auto": {
    key: "spalatorie-auto",
    title: "Banner Spălătorie Auto — Self Wash & Detailing",
    shortDescription: "Banner rezistent la apă pentru spălătorii. 'Jetoane', 'Spumă Activă'.",
    seoTitle: "Banner Spalatorie Auto | Self Service | Prynt",
    seoDescription: "Reclame outdoor pentru spălătorii. Rezistente la umezeală și aburi.",
    images: ["/products/banner/spalatorie-haine.webp"], // Fallback image
    contentHtml: `<h2>Semnalizare Spălătorie</h2><p>Afișează prețurile și programele de spălare clar.</p>`
  },
  "piese-auto": {
    key: "piese-auto",
    title: "Banner Piese Auto — Magazin & Dezmembrări",
    shortDescription: "Banner pentru magazine de piese sau parcuri de dezmembrări.",
    seoTitle: "Banner Piese Auto & Dezmembrari | Prynt",
    seoDescription: "Promovează magazinul de piese auto cu un banner stradal.",
    images: ["/products/banner/PIESE-AUTO.webp"],
    contentHtml: `<h2>Piese auto disponibile imediat</h2><p>Semnalizează stocul de piese sau serviciul de comandă rapidă.</p>`
  },
  "tractari-auto": {
    key: "tractari-auto",
    title: "Banner Tractări Auto — Non Stop",
    shortDescription: "Banner cu număr de telefon pentru servicii de tractare și asistență rutieră.",
    seoTitle: "Banner Tractari Auto Non Stop | Prynt",
    seoDescription: "Banner simplu și eficient: TRACTĂRI + Telefon. Vizibil zi și noapte (dacă e iluminat).",
    images: ["/products/banner/service-auto.webp"],
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
    images: ["/products/banner/nu-blocati.webp"],
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
    images: ["/products/banner/MAGAZIN-DECORATIUNI.webp"],
    contentHtml: `<h2>Inspiră clienții</h2><p>Folosește imagini cu interioare renovate pentru a convinge.</p>`
  },

  // --- HORECA (Hoteluri, Restaurante, Cafenele) ---
  "restaurant": {
    key: "restaurant",
    title: "Banner Restaurant — Meniul Zilei & Evenimente",
    shortDescription: "Banner apetisant pentru restaurante. 'Deschis', 'Livrări', 'Nunta/Botez'.",
    seoTitle: "Banner Restaurant & Terasa | Outdoor Horeca | Prynt",
    seoDescription: "Printuri culinare de înaltă rezoluție. Rezistente la exterior.",
    images: ["/products/banner/RESTAURANT.webp"],
    contentHtml: `<h2>Gustul care atrage</h2><p>O imagine cu mâncare face cât 1000 de cuvinte. Folosește poze reale.</p>`
  },
  "pizzerie": {
    key: "pizzerie",
    title: "Banner Pizzerie — Oferta 1+1 & Livrare",
    shortDescription: "Banner 'Pizza pe Vatră', 'Livrare Gratuită', 'Oferte Family'.",
    seoTitle: "Banner Pizzerie | Livrare Pizza | Prynt",
    seoDescription: "Crește comenzile la pizzerie cu un banner vizibil în cartier.",
    images: ["/products/banner/PIZZERIE.webp"],
    contentHtml: `<h2>Cea mai bună pizza din oraș</h2><p>Promovează numărul de telefon pentru comenzi rapide.</p>`
  },
  "fast-food": {
    key: "fast-food",
    title: "Banner Fast Food — Shaorma & Burger",
    shortDescription: "Banner stradal pentru fast-food. Culori vii, poze cu produse.",
    seoTitle: "Banner Fast Food & Shaormerie | Prynt",
    seoDescription: "Atrage clienții înfometați cu bannere luminoase și clare.",
    images: ["/products/banner/FastFood.webp"],
    contentHtml: `<h2>Mâncare rapidă și bună</h2><p>Ideal pentru locații stradale cu trafic pietonal intens.</p>`
  },
  "cafenea": {
    key: "cafenea",
    title: "Banner Cafenea & Coffe To Go",
    shortDescription: "Banner elegant pentru cafenele. 'Coffee To Go', 'Specialty Coffee'.",
    seoTitle: "Banner Cafenea & Coffe Shop | Prynt",
    seoDescription: "Semnalizează locația ta de cafea. Design modern și atractiv.",
    images: ["/products/banner/TERASA.webp"],
    contentHtml: `<h2>Energie pentru toată ziua</h2><p>Semnalizează prezența unei cafele bune în zonă.</p>`
  },
  "nunti-botezuri": {
    key: "nunti-botezuri",
    title: "Banner Organizare Evenimente — Săli & Corturi",
    shortDescription: "Banner pentru săli de evenimente. 'Organizam Nunți, Botezuri, Mese Festive'.",
    seoTitle: "Banner Sala Evenimente & Nunti | Prynt",
    seoDescription: "Promovează sala de evenimente pentru sezonul nunților.",
    images: ["/products/banner/RESTAURANT.webp"],
    contentHtml: `<h2>Locația ideală pentru evenimente</h2><p>Prezintă capacitatea sălii și facilitățile oferite.</p>`
  },
  "cazare": {
    key: "cazare",
    title: "Banner Cazare / Pensiune / Hotel",
    shortDescription: "Banner 'CAZARE', 'CAMERE LIBERE', 'RECEȚIE'.",
    seoTitle: "Banner Cazare & Pensiuni | Turism | Prynt",
    seoDescription: "Esențial pentru pensiuni în zone turistice. Atrage turiștii de la stradă.",
    images: ["/products/banner/Vila-de-inchiriat.webp"],
    contentHtml: `<h2>Bine ați venit!</h2><p>Semnalizează intrarea și disponibilitatea camerelor.</p>`
  },

  // --- BEAUTY & MEDICAL ---
  "salon-infrumusetare": {
    key: "salon-infrumusetare",
    title: "Banner Salon Înfrumusețare — Coafor & Cosmetică",
    shortDescription: "Banner elegant pentru saloane. Listează servicii: tuns, vopsit, manichiură.",
    seoTitle: "Banner Salon Infrumusetare & Coafor | Prynt",
    seoDescription: "Reclame outdoor pentru saloane de beauty. Design feminin și atrăgător.",
    images: ["/products/banner/BARBERSHOP.webp"], // Fallback visual
    contentHtml: `<h2>Frumusețe și stil</h2><p>Atrage doamnele din cartier la salonul tău.</p>`
  },
  "frizerie": {
    key: "frizerie",
    title: "Banner Frizerie / Barber Shop",
    shortDescription: "Banner masculin, stil Barber Shop. 'Tuns', 'Barbi', 'Fără Programare'.",
    seoTitle: "Banner Frizerie & Barber Shop | Prynt",
    seoDescription: "Semnalistică pentru frizerii. Stil clasic sau modern.",
    images: ["/products/banner/BARBERSHOP.webp"],
    contentHtml: `<h2>Stil masculin desăvârșit</h2><p>Semnalizează barber shop-ul cu un design puternic.</p>`
  },
  "stomatologie": {
    key: "stomatologie",
    title: "Banner Cabinet Stomatologic — Urgențe Dentare",
    shortDescription: "Banner curat, medical. 'Stomatologie', 'Implanturi', 'Radiologie'.",
    seoTitle: "Banner Cabinet Stomatologic & Dentist | Prynt",
    seoDescription: "Inspira încredere pacienților cu un banner profesional pentru clinică.",
    images: ["/products/banner/Cabinet-Stomatologic.webp"],
    contentHtml: `<h2>Zâmbetul tău contează</h2><p>Promovează serviciile stomatologice și urgențele.</p>`
  },
  "farmacie": {
    key: "farmacie",
    title: "Banner Farmacie / Plafar",
    shortDescription: "Banner cu cruce verde sau specific farmaceutic. 'Farmacie Non-Stop'.",
    seoTitle: "Banner Farmacie & Plafar | Semnalistica Medicala | Prynt",
    seoDescription: "Semnalizează farmacia pentru vizibilitate stradală.",
    images: ["/products/banner/servicii-medicale.webp"],
    contentHtml: `<h2>Sănătate aproape de tine</h2><p>Esențial pentru farmacii noi sau relocate.</p>`
  },
  "veterinar": {
    key: "veterinar",
    title: "Banner Cabinet Veterinar & Pet Shop",
    shortDescription: "Banner cu animale. 'Veterinar', 'Urgențe', 'Hrană Animale'.",
    seoTitle: "Banner Cabinet Veterinar | Pet Shop | Prynt",
    seoDescription: "Atrage iubitorii de animale la cabinetul tău.",
    images: ["/products/banner/PET-SHOP.webp"],
    contentHtml: `<h2>Grija pentru prietenii necuvântători</h2><p>Semnalizează cabinetul și farmacia veterinară.</p>`
  },

  // --- RETAIL & MAGAZINE ---
  "magazin-alimentar": {
    key: "magazin-alimentar",
    title: "Banner Magazin Alimentar / Mixt",
    shortDescription: "Banner 'DESCHIS', 'PÂINE PROASPĂTĂ', 'LEGUME FRUCTE'.",
    seoTitle: "Banner Magazin Alimentar & Supermarket | Prynt",
    seoDescription: "Crește vânzările magazinului de cartier cu oferte vizibile.",
    images: ["/products/banner/magazin-alimentar.webp"],
    contentHtml: `<h2>Produse proaspete zilnic</h2><p>Anunță clienții despre produsele de bază disponibile.</p>`
  },
  "haine": {
    key: "haine",
    title: "Banner Magazin Haine & Încălțăminte",
    shortDescription: "Banner fashion. 'Noua Colecție', 'Haine Copii', 'Outlet'.",
    seoTitle: "Banner Magazin Haine & Fashion | Prynt",
    seoDescription: "Promovează magazinul de haine cu imagini de lifestyle.",
    images: ["/products/banner/MAGAZIN-INCALTAMINTE.webp"],
    contentHtml: `<h2>Stil și eleganță</h2><p>Atrage pasionații de modă în magazin.</p>`
  },
  "second-hand": {
    key: "second-hand",
    title: "Banner Magazin Second Hand / Outlet",
    shortDescription: "Banner 'Marfă Nouă', 'Prețuri Mici', 'Haine la Kilogram'.",
    seoTitle: "Banner Second Hand & Outlet | Prynt",
    seoDescription: "Semnalizează zilele cu marfă nouă și reducerile.",
    images: ["/products/banner/MAGAZIN-SECOND-HAND.webp"],
    contentHtml: `<h2>Calitate la prețuri mici</h2><p>Anunță ziua de marfă și reducerile finale.</p>`
  },
  "florarie": {
    key: "florarie",
    title: "Banner Florărie — Buchete & Aranjamente",
    shortDescription: "Banner colorat cu flori. 'Buchete', 'Lumânări', 'Evenimente'.",
    seoTitle: "Banner Florarie & Aranjamente Florale | Prynt",
    seoDescription: "Atrage atenția cu imagini florale vibrante.",
    images: ["/products/banner/CADOURI-PERSONALIZATE.webp"], // Fallback
    contentHtml: `<h2>Emoții prin flori</h2><p>Semnalizează florăria pentru clienții grăbiți.</p>`
  },

  // --- SERVICII DIVERSE ---
  "curatenie": {
    key: "curatenie",
    title: "Banner Firmă Curățenie — Scări de Bloc & Birouri",
    shortDescription: "Banner servicii curățenie. 'Curățenie Generală', 'Spălare Covoare'.",
    seoTitle: "Banner Firma Curatenie Profesionala | Prynt",
    seoDescription: "Promovează serviciile de curățenie către asociații și firme.",
    images: ["/products/banner/CURATENIE-PROFESIONALA.webp"],
    contentHtml: `<h2>Curățenie lună</h2><p>Servicii profesionale pentru spații curate și igienizate.</p>`
  },
  "reparatii-telefoane": {
    key: "reparatii-telefoane",
    title: "Banner Service GSM / Reparații Telefoane",
    shortDescription: "Banner 'Service GSM', 'Schimb Display', 'Accesorii'.",
    seoTitle: "Banner Service GSM & Reparatii Telefoane | Prynt",
    seoDescription: "Semnalizează service-ul GSM într-o zonă aglomerată.",
    images: ["/products/banner/REPARAM-TELEFOANE.webp"],
    contentHtml: `<h2>Reparații rapide pe loc</h2><p>Lumea are nevoie de telefoane funcționale. Fii vizibil!</p>`
  },
  "amanet": {
    key: "amanet",
    title: "Banner Amanet / Exchange",
    shortDescription: "Banner 'AMANET', 'AUR', 'SCHIMB VALUTAR', 'NON-STOP'.",
    seoTitle: "Banner Amanet & Schimb Valutar | Prynt",
    seoDescription: "Culori galbene specifice pentru vizibilitate maximă amanet.",
    images: ["/products/banner/IN-STOC.webp"], // Fallback generic
    contentHtml: `<h2>Servicii financiare rapide</h2><p>Semnalizare stradală puternică pentru case de amanet.</p>`
  },
  "croitorie": {
    key: "croitorie",
    title: "Banner Croitorie & Retușuri",
    shortDescription: "Banner 'Croitorie Rapidă', 'Scurtat Pantaloni', 'Perdele'.",
    seoTitle: "Banner Croitorie & Retusuri Haine | Prynt",
    seoDescription: "Promovează atelierul de croitorie în cartier.",
    images: ["/products/banner/CROITORIE-RETUSARI.webp"],
    contentHtml: `<h2>Haine pe măsura ta</h2><p>Servicii de croitorie la îndemâna clienților din zonă.</p>`
  },
  "chei": {
    key: "chei",
    title: "Banner Copiat Chei & Yale",
    shortDescription: "Banner 'Copiat Chei', 'Carcase Auto', 'Ascuțit Cuțite'.",
    seoTitle: "Banner Copiat Chei & Lacatus | Prynt",
    seoDescription: "Semnalizare pentru ateliere mici de chei.",
    images: ["/products/banner/CIZMARIE.webp"], // Fallback similar craft
    contentHtml: `<h2>Chei duplicate pe loc</h2><p>Nu lăsa clienții să te caute, fii vizibil!</p>`
  },

  // --- EVENIMENTE & SĂRBĂTORI ---
  "la-multi-ani": {
    key: "la-multi-ani",
    title: "Banner La Mulți Ani — Aniversări & Petreceri",
    shortDescription: "Banner festiv personalizat cu nume și poză pentru zile de naștere.",
    seoTitle: "Banner La Multi Ani Personalizat | Aniversare | Prynt",
    seoDescription: "Surprinde sărbătoritul cu un banner uriaș 'La Mulți Ani'.",
    images: ["/products/banner/la-multi-ani.webp"],
    contentHtml: `<h2>O surpriză de neuitat</h2><p>Perfect pentru petreceri surpriză, majorate sau aniversări de firmă.</p>`
  },
  "botez": {
    key: "botez",
    title: "Banner Botez — Bun Venit & Decor",
    shortDescription: "Banner 'Bine ați venit la Botezul meu', cu poza bebelușului.",
    seoTitle: "Banner Botez Personalizat | Decor Sala | Prynt",
    seoDescription: "Decor personalizat pentru sala de botez. Tematici diverse (Disney, culori pastel).",
    images: ["/products/banner/CADOURI-PERSONALIZATE.webp"],
    contentHtml: `<h2>Primul eveniment important</h2><p>Un photo-corner personalizat pentru botez.</p>`
  },
  "nunta": {
    key: "nunta",
    title: "Banner Nuntă — Welcome & Photo Corner",
    shortDescription: "Banner 'Casa de Piatră' sau fundal pentru poze la nuntă.",
    seoTitle: "Banner Nunta & Photo Corner | Prynt",
    seoDescription: "Bannere elegante pentru nunți. Numele mirilor și data evenimentului.",
    images: ["/products/banner/vrei-sa-fii-sotia-mea.webp"],
    contentHtml: `<h2>Eleganță și amintiri</h2><p>Creează un fundal perfect pentru fotografiile invitaților.</p>`
  },
  "black-friday": {
    key: "black-friday",
    title: "Banner Black Friday — Reduceri Explozive",
    shortDescription: "Banner negru/roșu pentru campanii de reduceri.",
    seoTitle: "Banner Black Friday | Afise Reduceri | Prynt",
    seoDescription: "Pregătește magazinul pentru cele mai mari reduceri din an.",
    images: ["/products/banner/BLACK-FRIDAY.webp"],
    contentHtml: `<h2>Cele mai mari reduceri</h2><p>Semnalizează campania clar și vizibil.</p>`
  },
  "sarbatori": {
    key: "sarbatori",
    title: "Banner Sărbători — Crăciun & Paște",
    shortDescription: "Banner 'Sărbători Fericite', decorativ pentru firme și primării.",
    seoTitle: "Banner Sarbatori Fericite | Craciun & Paste | Prynt",
    seoDescription: "Bannere stradale cu urări de sărbători.",
    images: ["/products/banner/WINTER-SALE.webp"],
    contentHtml: `<h2>Atmosferă de sărbătoare</h2><p>Decorează fațada sau interiorul cu mesaje festive.</p>`
  },

  // --- INSTITUȚII & COMUNITATE ---
  "primarie": {
    key: "primarie",
    title: "Banner Primărie — Informări & Evenimente",
    shortDescription: "Bannere pentru 'Zilele Comunei', informări publice, proiecte.",
    seoTitle: "Banner Primarie & Institutii Publice | Prynt",
    seoDescription: "Print outdoor pentru instituții. Bannere stradale transversale sau panouri.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Comunicare cu cetățenii</h2><p>Anunță evenimentele locale și proiectele de investiții.</p>`
  },
  "biserica": {
    key: "biserica",
    title: "Banner Biserică — Hram & Sărbători",
    shortDescription: "Banner 'Hramul Bisericii', 'La Mulți Ani', 'Sfintele Paști'.",
    seoTitle: "Banner Biserica & Parohie | Religios | Prynt",
    seoDescription: "Bannere rezistente pentru lăcașuri de cult.",
    images: ["/products/banner/la-multi-ani.webp"],
    contentHtml: `<h2>Mesaje pentru comunitate</h2><p>Semnalizează sărbătorile importante ale parohiei.</p>`
  },
  "scoala": {
    key: "scoala",
    title: "Banner Școală & Grădiniță — Înscrieri",
    shortDescription: "Banner 'Înscrieri Deschise', 'Bun Venit', 'Serbare'.",
    seoTitle: "Banner Scoala & Gradinita | Inscrieri | Prynt",
    seoDescription: "Promovează oferta educațională a școlii sau grădiniței.",
    images: ["/products/banner/RECRUTAM-PERSONAL.webp"], // Fallback contextual
    contentHtml: `<h2>Educație de calitate</h2><p>Anunță perioada de înscrieri pentru părinți.</p>`
  },

  // --- AGRICULTURĂ ---
  "agricol": {
    key: "agricol",
    title: "Banner Agricol — Produse & Utilaje",
    shortDescription: "Banner 'Vând Cereale', 'Vând Fân', 'Utilaje Agricole'.",
    seoTitle: "Banner Agricol & Produse Locale | Prynt",
    seoDescription: "Bannere pentru fermieri și producători locali.",
    images: ["/products/banner/FRUCTE-SI-LEGUME.webp"],
    contentHtml: `<h2>Susține producătorii locali</h2><p>Vinde recolta direct de la poartă cu un banner vizibil.</p>`
  },
  "apicol": {
    key: "apicol",
    title: "Banner Miere de Albine & Produse Apicole",
    shortDescription: "Banner 'Vând Miere Naturală', 'Polen', 'Propolis'.",
    seoTitle: "Banner Miere & Apicultor | Prynt",
    seoDescription: "Semnalizează stupina sau punctul de vânzare miere.",
    images: ["/products/banner/Produse-bio-eco.webp"],
    contentHtml: `<h2>Miere 100% Naturală</h2><p>Atrage clienții care caută produse sănătoase.</p>`
  },

  // --- ALTELE ---
  "angajam": {
    key: "angajam",
    title: "Banner ANGAJĂM — Recrutare Personal",
    shortDescription: "Cel mai eficient mod de a găsi personal local. 'Angajăm Vânzătoare', 'Șofer', 'Personal'.",
    seoTitle: "Banner Angajam Personal | Recrutare | Prynt",
    seoDescription: "Găsește angajați rapid. Pune un banner 'ANGAJĂM' la intrare.",
    images: ["/products/banner/ANGAJAM-PERSONAL.webp"],
    contentHtml: `<h2>Recrutare directă</h2><p>Oamenii care locuiesc în zonă sunt cei mai buni angajați. Anunță-i că ai nevoie de ei.</p>`
  },
  "deschidere": {
    key: "deschidere",
    title: "Banner DESCHIDERE — Open Soon",
    shortDescription: "Banner 'Deschidem în curând', 'Marea Deschidere'.",
    seoTitle: "Banner Deschidere Magazin | Grand Opening | Prynt",
    seoDescription: "Creează suspans înainte de lansare.",
    images: ["/products/banner/DESCHIS-ACUM.webp"],
    contentHtml: `<h2>Lansare de succes</h2><p>Nu deschide în liniște. Fă gălăgie vizuală!</p>`
  }
};