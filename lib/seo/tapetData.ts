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
  },

  // --- EVENIMENTE & PETRECERI ---
  "nunta": {
    key: "nunta",
    title: "Tapet Nuntă — Romantic & Personalizat",
    shortDescription: "Fototapet cu poze de familie, motive florale sau citate de iubire.",
    seoTitle: "Tapet Nunta & Evenimente | Fototapet Romantic | Prynt",
    seoDescription: "Decorează sala de evenimente cu un tapet personalizat. Print de calitate pentru amintiri de neuitat.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Cele mai frumoase amintiri</h2><p>Transformă orice spațiu într-un cadru de poveste pentru ziua cea mare.</p>`
  },
  "botez": {
    key: "botez",
    title: "Tapet Botez & Naștere — Îngeri & Flori",
    shortDescription: "Motive angelice, nori, flori delicate pentru botezuri și sărbători de naștere.",
    seoTitle: "Tapet Botez & Nastere | Decor Eveniment | Prynt",
    seoDescription: "Creează o atmosferă sacră și emoționantă. Tapet cu imagini simbolice pentru botez.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Un început nou</h2><p>Celebrează venirea pe lume a celui mic cu un decor plin de iubire.</p>`
  },
  "zi-de-nastere": {
    key: "zi-de-nastere",
    title: "Tapet Zi de Naștere — Vesele & Colorate",
    shortDescription: "Balonașe, torturi, personaje animate pentru petreceri de zi de naștere.",
    seoTitle: "Tapet Zi de Nastere | Decor Petrecere | Prynt",
    seoDescription: "Fă ziua specială și mai distractivă. Tapet personalizat cu tema preferată.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Surprize și bucurie</h2><p>Un perete decorat poate fi centrul atenției la orice petrecere.</p>`
  },
  "petrecere-copii": {
    key: "petrecere-copii",
    title: "Tapet Petrecere Copii — Aventură & Magie",
    shortDescription: "Supereroi, prințese, animale fantastice pentru petreceri tematice.",
    seoTitle: "Tapet Petrecere Copii | Decor Magie | Prynt",
    seoDescription: "Intră în lumea basmelor. Tapet cu personaje îndrăgite pentru sărbători.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O lume de vis</h2><p>Copiii vor fi încântați de decorul magic al petrecerii lor.</p>`
  },
  "revelion": {
    key: "revelion",
    title: "Tapet Revelion — Strălucire & Fantezie",
    shortDescription: "Confetti, artificii, ceasuri care bat miezul nopții pentru petreceri de An Nou.",
    seoTitle: "Tapet Revelion & An Nou | Decor Petrecere | Prynt",
    seoDescription: "Bucură-te de sărbători cu un tapet festivist. Print vibrant pentru atmosfera de sărbătoare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>An nou, decor nou</h2><p>Celebrează trecerea timpului cu un design spectaculos.</p>`
  },
  "halloween": {
    key: "halloween",
    title: "Tapet Halloween — Înfricoșător & Distractiv",
    shortDescription: "Fantome, dovleci, vrăjitoare pentru decorări tematice de Halloween.",
    seoTitle: "Tapet Halloween | Decor Înfricosator | Prynt",
    seoDescription: "Sperie prietenii cu un tapet horror. Design fun pentru petreceri tematice.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Noaptea tuturor sfinților</h2><p>Creează o atmosferă misterioasă și distractivă.</p>`
  },
  "craciun": {
    key: "craciun",
    title: "Tapet Crăciun — Magie & Iarnă",
    shortDescription: "Brad, zăpadă, Moș Crăciun pentru decorări festive.",
    seoTitle: "Tapet Craciun & Iarna | Decor Festiv | Prynt",
    seoDescription: "Adu magia sărbătorilor în casă. Tapet cu motive de iarnă.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sărbători fericite</h2><p>Transformă orice cameră într-un peisaj de poveste.</p>`
  },
  "paste": {
    key: "paste",
    title: "Tapet Paște — Înviere & Tradiție",
    shortDescription: "Ouă încondeiate, flori de primăvară, simboluri creștine pentru Paște.",
    seoTitle: "Tapet Paste & Primavara | Decor Traditional | Prynt",
    seoDescription: "Sărbătorește Paștele cu un decor autentic. Print cu motive tradiționale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Înviere și reînnoire</h2><p>Celebrează tradiția cu un tapet plin de semnificație.</p>`
  },
  "targ": {
    key: "targ",
    title: "Tapet Târg & Expoziție — Branding & Impact",
    shortDescription: "Logo companie, produse, sloganuri pentru standuri expoziționale.",
    seoTitle: "Tapet Targ & Expo | Branding Perete | Prynt",
    seoDescription: "Atrage atenția vizitatorilor. Tapet personalizat pentru evenimente business.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Prezență puternică</h2><p>Fă-ți standul să iasă în evidență cu un design unic.</p>`
  },
  "festival": {
    key: "festival",
    title: "Tapet Festival & Concert — Energie & Vibrații",
    shortDescription: "Note muzicale, instrumente, siluete pentru evenimente muzicale.",
    seoTitle: "Tapet Festival & Concert | Decor Muzical | Prynt",
    seoDescription: "Creează atmosfera perfectă pentru iubitorii de muzică. Print vibrant.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Ritm și culoare</h2><p>Transformă spațiul într-o scenă vie.</p>`
  },
  "conferinta": {
    key: "conferinta",
    title: "Tapet Conferință & Seminar — Profesional & Inspirant",
    shortDescription: "Citate motivaționale, grafice, branding pentru evenimente corporate.",
    seoTitle: "Tapet Conferinta & Seminar | Decor Business | Prynt",
    seoDescription: "Inspiră participanții cu un decor profesional. Tapet personalizat.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Cunoaștere și inovație</h2><p>Un mediu care stimulează discuțiile productive.</p>`
  },
  "petrecere-adulti": {
    key: "petrecere-adulti",
    title: "Tapet Petrecere Adulți — Glamour & Eleganță",
    shortDescription: "Cocktail-uri, orașe de noapte, motive abstracte pentru petreceri sofisticate.",
    seoTitle: "Tapet Petrecere Adulti | Decor Glamour | Prynt",
    seoDescription: "Ridică nivelul evenimentului tău. Design elegant pentru ocazii speciale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sofisticare și distracție</h2><p>Creează amintiri de neuitat cu un decor rafinat.</p>`
  },

  // --- BUSINESS & COMERCIALE ---
  "restaurant": {
    key: "restaurant",
    title: "Tapet Restaurant — Apetit & Atmosferă",
    shortDescription: "Preparate culinare, ingrediente proaspete, vinuri pentru decor horeca.",
    seoTitle: "Tapet Restaurant & Horeca | Decor Gastronomic | Prynt",
    seoDescription: "Stimulează apetitul clienților. Tapet tematic pentru restaurante.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O experiență culinară completă</h2><p>Decorul contribuie la satisfacția generală a mesei.</p>`
  },
  "bar": {
    key: "bar",
    title: "Tapet Bar & Pub — Relaxare & Socializare",
    shortDescription: "Băuturi, cocktail-uri, atmosferă urbană pentru baruri.",
    seoTitle: "Tapet Bar & Pub | Decor Relaxant | Prynt",
    seoDescription: "Creează un spațiu inviting pentru clienți. Print rezistent la umiditate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Locul perfect pentru relaxare</h2><p>Un decor care încurajează conversațiile lungi.</p>`
  },
  "hotel": {
    key: "hotel",
    title: "Tapet Hotel & Pensiune — Confort & Ospitalitate",
    shortDescription: "Peisaje relaxante, orașe turistice pentru camere de hotel.",
    seoTitle: "Tapet Hotel & Pensiune | Decor Confort | Prynt",
    seoDescription: "Oferă oaspeților un refugiu plăcut. Tapet personalizat pentru ospitalitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Acasă departe de acasă</h2><p>Fă fiecare cameră să se simtă specială.</p>`
  },
  "spital": {
    key: "spital",
    title: "Tapet Spital & Clinică — Calmare & Profesionalism",
    shortDescription: "Imagini calmante, natură, motive abstracte pentru spații medicale.",
    seoTitle: "Tapet Spital & Clinica | Decor Calmant | Prynt",
    seoDescription: "Ajută la reducerea stresului pacienților. Design liniștitor pentru spitale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îngrijire și compasiune</h2><p>Un decor care promovează vindecarea.</p>`
  },
  "scoala": {
    key: "scoala",
    title: "Tapet Școală & Universitate — Educație & Inspirație",
    shortDescription: "Hărți, citate, știință pentru săli de clasă.",
    seoTitle: "Tapet Scoala & Universitate | Decor Educational | Prynt",
    seoDescription: "Stimulează învățarea cu un decor inspirant. Tapet lavabil pentru școli.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Locul unde se formează viitorul</h2><p>Pereții pot fi o sursă de motivație.</p>`
  },
  "magazin": {
    key: "magazin",
    title: "Tapet Magazin & Butic — Branding & Vânzare",
    shortDescription: "Produse, logo, atmosferă pentru magazine retail.",
    seoTitle: "Tapet Magazin & Butic | Decor Comercial | Prynt",
    seoDescription: "Îmbunătățește experiența de cumpărare. Tapet personalizat pentru retail.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Atrage și reține clienți</h2><p>Un decor care reflectă identitatea brandului.</p>`
  },
  "birou-corporate": {
    key: "birou-corporate",
    title: "Tapet Birou Corporate — Productivitate & Stil",
    shortDescription: "Design minimalist, grafice, branding pentru birouri moderne.",
    seoTitle: "Tapet Birou Corporate | Decor Office | Prynt",
    seoDescription: "Creează un mediu de lucru profesional. Print de calitate pentru companii.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Eficiență și creativitate</h2><p>Un spațiu care inspiră performanță.</p>`
  },
  "fitness": {
    key: "fitness",
    title: "Tapet Fitness & Sală Sport — Energie & Motivare",
    shortDescription: "Siluete atletice, motive sportive pentru săli de fitness.",
    seoTitle: "Tapet Fitness & Sala Sport | Decor Motivational | Prynt",
    seoDescription: "Motivați-vă clienții cu un decor energizant. Tapet rezistent.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Putere și determinare</h2><p>Transformă antrenamentul într-o experiență inspirantă.</p>`
  },
  "coafura": {
    key: "coafura",
    title: "Tapet Coafură & Salon — Frumusețe & Eleganță",
    shortDescription: "Motive fashion, păr, machiaj pentru saloane de înfrumusețare.",
    seoTitle: "Tapet Coafura & Salon | Decor Beauty | Prynt",
    seoDescription: "Completează serviciile cu un decor sofisticat. Print pentru saloane.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Frumusețe și stil</h2><p>Un spațiu care reflectă profesionalismul.</p>`
  },
  "avocat": {
    key: "avocat",
    title: "Tapet Cabinet Avocat — Încredere & Profesionalism",
    shortDescription: "Simboluri juridice, cărți, motive clasice pentru birouri legale.",
    seoTitle: "Tapet Cabinet Avocat | Decor Juridic | Prynt",
    seoDescription: "Construiți încredere cu un decor serios. Tapet pentru cabinete avocat.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Justiție și onestitate</h2><p>Un mediu care inspiră respect.</p>`
  },
  "dentist": {
    key: "dentist",
    title: "Tapet Cabinet Dentist — Calmare & Igienă",
    shortDescription: "Imagini relaxante, natură pentru cabinete stomatologice.",
    seoTitle: "Tapet Cabinet Dentist | Decor Calmant | Prynt",
    seoDescription: "Reduce anxietatea pacienților. Design liniștitor pentru dentiști.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Zâmbete sănătoase</h2><p>Un decor care promovează bunăstarea.</p>`
  },
  "farmacie": {
    key: "farmacie",
    title: "Tapet Farmacie — Sănătate & Încredere",
    shortDescription: "Simboluri medicale, plante medicinale pentru farmacii.",
    seoTitle: "Tapet Farmacie | Decor Medical | Prynt",
    seoDescription: "Creează un spațiu de încredere. Tapet pentru farmacii.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îngrijire pentru sănătate</h2><p>Un decor care inspiră siguranță.</p>`
  },
  "agentie-imobiliara": {
    key: "agentie-imobiliara",
    title: "Tapet Agenție Imobiliară — Lux & Aspirație",
    shortDescription: "Case de vis, orașe, peisaje pentru birouri imobiliare.",
    seoTitle: "Tapet Agentie Imobiliara | Decor Lux | Prynt",
    seoDescription: "Inspiră clienții cu vise imobiliare. Print pentru agenții.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Acasă ideal</h2><p>Un decor care reflectă aspirațiile.</p>`
  },
  "constructii": {
    key: "constructii",
    title: "Tapet Firmă Construcții — Soliditate & Inovație",
    shortDescription: "Clădiri, unelte, proiecte pentru firme de construcții.",
    seoTitle: "Tapet Firma Constructii | Decor Industrial | Prynt",
    seoDescription: "Arată expertiza companiei. Tapet pentru birouri construcții.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Construcția viitorului</h2><p>Un decor care demonstrează putere.</p>`
  },
  "it": {
    key: "it",
    title: "Tapet Firmă IT — Tehnologie & Inovare",
    shortDescription: "Cod, circuite, gadgeturi pentru birouri tech.",
    seoTitle: "Tapet Firma IT | Decor Tech | Prynt",
    seoDescription: "Reflectă lumea digitală. Print pentru companii IT.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Inovație și progres</h2><p>Un spațiu care inspiră creativitate tehnică.</p>`
  },
  "marketing": {
    key: "marketing",
    title: "Tapet Agenție Marketing — Creativitate & Impact",
    shortDescription: "Idei vizuale, branding, campanii pentru agenții marketing.",
    seoTitle: "Tapet Agentie Marketing | Decor Creativ | Prynt",
    seoDescription: "Stimulează ideile geniale. Tapet pentru marketing.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Idei care vând</h2><p>Un decor care încurajează inovația.</p>`
  },
  "contabilitate": {
    key: "contabilitate",
    title: "Tapet Cabinet Contabilitate — Precizie & Încredere",
    shortDescription: "Grafice, numere, motive financiare pentru birouri contabile.",
    seoTitle: "Tapet Cabinet Contabilitate | Decor Profesional | Prynt",
    seoDescription: "Construiți încredere financiară. Print pentru contabili.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Numere care contează</h2><p>Un mediu serios pentru afaceri.</p>`
  },
  "turism": {
    key: "turism",
    title: "Tapet Agenție Turism — Aventură & Explorare",
    shortDescription: "Destinații turistice, hărți, aventuri pentru agenții turistice.",
    seoTitle: "Tapet Agentie Turism | Decor Aventura | Prynt",
    seoDescription: "Inspiră călătorii. Tapet pentru birouri turism.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lumea te așteaptă</h2><p>Un decor care trezește dorința de explorare.</p>`
  },
  "auto": {
    key: "auto",
    title: "Tapet Service Auto — Putere & Performanță",
    shortDescription: "Mașini, motoare, curse pentru service-uri auto.",
    seoTitle: "Tapet Service Auto | Decor Moto | Prynt",
    seoDescription: "Arată pasiunea pentru mașini. Print pentru ateliere auto.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viteză și putere</h2><p>Un decor care reflectă performanță.</p>`
  },
  "electrice": {
    key: "electrice",
    title: "Tapet Firmă Electrică — Energie & Siguranță",
    shortDescription: "Circuite, fulgere, echipamente pentru firme electrice.",
    seoTitle: "Tapet Firma Electrica | Decor Tech | Prynt",
    seoDescription: "Demonstrează expertiză electrică. Tapet pentru electricieni.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Energie sigură</h2><p>Un decor care inspiră încredere.</p>`
  },
  "instalatii": {
    key: "instalatii",
    title: "Tapet Firmă Instalații — Funcționalitate & Expertiză",
    shortDescription: "Conducte, robinete, sisteme pentru firme instalații.",
    seoTitle: "Tapet Firma Instalatii | Decor Industrial | Prynt",
    seoDescription: "Arată măiestria tehnică. Print pentru instalații.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sisteme perfecte</h2><p>Un decor care reflectă precizie.</p>`
  },
  "transport": {
    key: "transport",
    title: "Tapet Firmă Transport — Mobilitate & Logistică",
    shortDescription: "Camioane, trenuri, hărți pentru firme transport.",
    seoTitle: "Tapet Firma Transport | Decor Logistic | Prynt",
    seoDescription: "Reflectă lumea transporturilor. Tapet pentru logistică.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Conectăm lumea</h2><p>Un decor care simbolizează mișcare.</p>`
  },
  "agricultura": {
    key: "agricultura",
    title: "Tapet Firmă Agricultură — Natură & Productivitate",
    shortDescription: "Câmpuri, tractoare, recolte pentru firme agricole.",
    seoTitle: "Tapet Firma Agricultura | Decor Rural | Prynt",
    seoDescription: "Celebrează agricultura. Print pentru ferme și birouri agricole.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Pământul hrănește</h2><p>Un decor care onorează munca pământului.</p>`
  },
  "veterinar": {
    key: "veterinar",
    title: "Tapet Cabinet Veterinar — Îngrijire & Compasiune",
    shortDescription: "Animale, îngrijire veterinară pentru clinici veterinare.",
    seoTitle: "Tapet Cabinet Veterinar | Decor Animal | Prynt",
    seoDescription: "Creează un spațiu prietenos pentru animale. Tapet pentru veterinari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Prieteni cu blană</h2><p>Un decor care inspiră grijă.</p>`
  },
  "fotograf": {
    key: "fotograf",
    title: "Tapet Atelier Fotograf — Artă & Creativitate",
    shortDescription: "Aparate foto, imagini, studio pentru fotografi.",
    seoTitle: "Tapet Atelier Fotograf | Decor Artistic | Prynt",
    seoDescription: "Reflectă pasiunea pentru fotografie. Print pentru studiouri foto.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Capturăm momente</h2><p>Un decor care celebrează arta vizuală.</p>`
  },
  "arta": {
    key: "arta",
    title: "Tapet Atelier Artă — Inspirație & Creație",
    shortDescription: "Culori, pensule, picturi pentru ateliere de artă.",
    seoTitle: "Tapet Atelier Arta | Decor Creativ | Prynt",
    seoDescription: "Stimulează creativitatea. Tapet pentru artiști.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Expresie artistică</h2><p>Un spațiu care încurajează imaginația.</p>`
  },
  "muzica": {
    key: "muzica",
    title: "Tapet Studio Muzică — Ritm & Armonie",
    shortDescription: "Note, instrumente, sunete pentru studiouri muzicale.",
    seoTitle: "Tapet Studio Muzica | Decor Ritmic | Prynt",
    seoDescription: "Creează atmosfera perfectă pentru muzică. Print pentru studiouri.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Muzica sufletului</h2><p>Un decor care vibrează de pasiune.</p>`
  },
  "dans": {
    key: "dans",
    title: "Tapet Școală Dans — Mișcare & Grație",
    shortDescription: "Siluete dans, ritm, mișcare pentru școli de dans.",
    seoTitle: "Tapet Scoala Dans | Decor Grațios | Prynt",
    seoDescription: "Inspiră mișcarea. Tapet pentru studiouri dans.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Arta mișcării</h2><p>Un decor care celebrează grația.</p>`
  },
  "yoga": {
    key: "yoga",
    title: "Tapet Studio Yoga — Pace & Echilibru",
    shortDescription: "Poze yoga, zen, natură pentru studiouri yoga.",
    seoTitle: "Tapet Studio Yoga | Decor Calmant | Prynt",
    seoDescription: "Promovează relaxarea. Print pentru centre yoga.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Echilibru interior</h2><p>Un spațiu pentru pace și reflecție.</p>`
  },
  "pilates": {
    key: "pilates",
    title: "Tapet Studio Pilates — Forță & Flexibilitate",
    shortDescription: "Exerciții, corp, echilibru pentru studiouri pilates.",
    seoTitle: "Tapet Studio Pilates | Decor Fitness | Prynt",
    seoDescription: "Motivați elevii. Tapet pentru centre pilates.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Corp și minte</h2><p>Un decor care inspiră sănătate.</p>`
  },
  "terapie": {
    key: "terapie",
    title: "Tapet Cabinet Terapie — Vindecare & Sprijin",
    shortDescription: "Imagini calmante, natură pentru cabinete terapie.",
    seoTitle: "Tapet Cabinet Terapie | Decor Calmant | Prynt",
    seoDescription: "Ajută la vindecare emoțională. Print pentru terapeuți.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sprijin și vindecare</h2><p>Un spațiu sigur pentru reflecție.</p>`
  },
  "psiholog": {
    key: "psiholog",
    title: "Tapet Cabinet Psiholog — Înțelegere & Empatie",
    shortDescription: "Motive abstracte, culori calmante pentru cabinete psiholog.",
    seoTitle: "Tapet Cabinet Psiholog | Decor Empatic | Prynt",
    seoDescription: "Creează un mediu de încredere. Tapet pentru psihologi.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Minte sănătoasă</h2><p>Un decor care promovează dialogul.</p>`
  },
  "masaj": {
    key: "masaj",
    title: "Tapet Salon Masaj — Relaxare & Bine",
    shortDescription: "Imagini zen, corp, relaxare pentru saloane masaj.",
    seoTitle: "Tapet Salon Masaj | Decor Relaxant | Prynt",
    seoDescription: "Completează tratamentele. Print pentru centre masaj.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Bine și relaxare</h2><p>Un spațiu pentru reîncărcare.</p>`
  },
  "tatuaj": {
    key: "tatuaj",
    title: "Tapet Salon Tatuaj — Artă & Individualitate",
    shortDescription: "Design-uri tattoo, artă corporală pentru saloane tatuaj.",
    seoTitle: "Tapet Salon Tatuaj | Decor Artistic | Prynt",
    seoDescription: "Reflectă creativitatea. Tapet pentru studiouri tattoo.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Artă pe piele</h2><p>Un decor care celebrează expresia personală.</p>`
  },
  "bijuterii": {
    key: "bijuterii",
    title: "Tapet Atelier Bijuterii — Lux & Detaliu",
    shortDescription: "Bijuterii, pietre prețioase pentru ateliere bijuterii.",
    seoTitle: "Tapet Atelier Bijuterii | Decor Luxos | Prynt",
    seoDescription: "Arată măiestria. Print pentru bijutieri.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Frumusețe eternă</h2><p>Un decor care strălucește.</p>`
  },
  "ceasuri": {
    key: "ceasuri",
    title: "Tapet Atelier Ceasuri — Precizie & Timp",
    shortDescription: "Ceasuri, mecanisme, timp pentru ateliere ceasuri.",
    seoTitle: "Tapet Atelier Ceasuri | Decor Tehnic | Prynt",
    seoDescription: "Reflectă pasiunea pentru timp. Tapet pentru ceasornicari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Timpul zboară</h2><p>Un decor care măsoară măiestria.</p>`
  },
  "mobilier": {
    key: "mobilier",
    title: "Tapet Atelier Mobilier — Lemn & Design",
    shortDescription: "Mobilă, lemn, design pentru ateliere mobilier.",
    seoTitle: "Tapet Atelier Mobilier | Decor Artizanal | Prynt",
    seoDescription: "Celebrează meșteșugul. Print pentru tâmplari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Artă din lemn</h2><p>Un decor care inspiră creație.</p>`
  },
  "textile": {
    key: "textile",
    title: "Tapet Atelier Textile — Țesătură & Culoare",
    shortDescription: "Țesături, fire, modele pentru ateliere textile.",
    seoTitle: "Tapet Atelier Textile | Decor Colorat | Prynt",
    seoDescription: "Reflectă diversitatea. Tapet pentru designeri textile.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Fire de culoare</h2><p>Un decor care țese povești.</p>`
  },
  "ceramica": {
    key: "ceramica",
    title: "Tapet Atelier Ceramică — Formă & Textură",
    shortDescription: "Ceramică, olărie, forme pentru ateliere ceramică.",
    seoTitle: "Tapet Atelier Ceramica | Decor Artizanal | Prynt",
    seoDescription: "Celebrează pământul. Print pentru olari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Forme din lut</h2><p>Un decor care modelează frumusețea.</p>`
  },
  "sticla": {
    key: "sticla",
    title: "Tapet Atelier Sticlă — Transparență & Lucru",
    shortDescription: "Sticlă, cristal, forme pentru ateliere sticlă.",
    seoTitle: "Tapet Atelier Sticla | Decor Transparent | Prynt",
    seoDescription: "Reflectă claritatea. Tapet pentru sticlari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lumini și forme</h2><p>Un decor care strălucește.</p>`
  },
  "metal": {
    key: "metal",
    title: "Tapet Atelier Metal — Forță & Structură",
    shortDescription: "Metale, forjare, structuri pentru ateliere metal.",
    seoTitle: "Tapet Atelier Metal | Decor Industrial | Prynt",
    seoDescription: "Arată rezistența. Print pentru fierari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Metal și măiestrie</h2><p>Un decor care construiește viitorul.</p>`
  },
  "electronice": {
    key: "electronice",
    title: "Tapet Atelier Electronice — Inovație & Circuit",
    shortDescription: "Circuite, componente, gadgeturi pentru ateliere electronice.",
    seoTitle: "Tapet Atelier Electronice | Decor Tech | Prynt",
    seoDescription: "Reflectă viitorul. Tapet pentru electroniști.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Circuite inteligente</h2><p>Un decor care conectează idei.</p>`
  },
  "robotica": {
    key: "robotica",
    title: "Tapet Atelier Robotică — Automatizare & Precizie",
    shortDescription: "Roboți, automatizare, AI pentru ateliere robotică.",
    seoTitle: "Tapet Atelier Robotica | Decor Futurist | Prynt",
    seoDescription: "Celebrează tehnologia. Print pentru roboțiști.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Machine learning</h2><p>Un decor care programează viitorul.</p>`
  },
  "aviatie": {
    key: "aviatie",
    title: "Tapet Atelier Aviație — Zbor & Libertate",
    shortDescription: "Avioane, cer, zbor pentru ateliere aviație.",
    seoTitle: "Tapet Atelier Aviatie | Decor Aerian | Prynt",
    seoDescription: "Reflectă visul zborului. Tapet pentru aviatori.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Către ceruri</h2><p>Un decor care inspiră înălțare.</p>`
  },
  "naval": {
    key: "naval",
    title: "Tapet Atelier Naval — Mare & Explorare",
    shortDescription: "Bărci, mare, navigație pentru ateliere navale.",
    seoTitle: "Tapet Atelier Naval | Decor Maritim | Prynt",
    seoDescription: "Celebrează oceanul. Print pentru constructori nave.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Valuri și vânt</h2><p>Un decor care navighează vise.</p>`
  },
  "spatiu": {
    key: "spatiu",
    title: "Tapet Atelier Spațial — Cosmos & Explorare",
    shortDescription: "Stele, planete, cosmos pentru ateliere spațiale.",
    seoTitle: "Tapet Atelier Spatiu | Decor Cosmic | Prynt",
    seoDescription: "Reflectă infinitul. Tapet pentru ingineri spațiali.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Către stele</h2><p>Un decor care explorează universul.</p>`
  },
  "energie": {
    key: "energie",
    title: "Tapet Firmă Energie — Putere & Sustenabilitate",
    shortDescription: "Panouri solare, turbine, energie pentru firme energie.",
    seoTitle: "Tapet Firma Energie | Decor Verde | Prynt",
    seoDescription: "Promovează viitorul curat. Print pentru energii regenerabile.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Energie verde</h2><p>Un decor care luminează viitorul.</p>`
  },
  "apa": {
    key: "apa",
    title: "Tapet Firmă Apă — Puritate & Flux",
    shortDescription: "Apă, râuri, purificare pentru firme apă.",
    seoTitle: "Tapet Firma Apa | Decor Fluid | Prynt",
    seoDescription: "Celebrează apa vieții. Tapet pentru tratare apă.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Fluxul vieții</h2><p>Un decor care curge cu puritate.</p>`
  },
  "reciclare": {
    key: "reciclare",
    title: "Tapet Firmă Reciclare — Reînnoire & Planetă",
    shortDescription: "Reciclare, planetă, sustenabilitate pentru firme reciclare.",
    seoTitle: "Tapet Firma Reciclare | Decor Verde | Prynt",
    seoDescription: "Salvează planeta. Print pentru centre reciclare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O planetă mai bună</h2><p>Un decor care reînnoiește speranța.</p>`
  },
  "protectia-mediu": {
    key: "protectia-mediu",
    title: "Tapet ONG Mediu — Natură & Conservare",
    shortDescription: "Păduri, animale, planetă pentru ONG-uri mediu.",
    seoTitle: "Tapet ONG Mediu | Decor Ecologic | Prynt",
    seoDescription: "Protejează natura. Tapet pentru activiști mediu.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Pământul nostru</h2><p>Un decor care inspiră grijă.</p>`
  },
  "animale": {
    key: "animale",
    title: "Tapet ONG Animale — Compasiune & Ajutor",
    shortDescription: "Animale, salvare, iubire pentru ONG-uri animale.",
    seoTitle: "Tapet ONG Animale | Decor Prietenos | Prynt",
    seoDescription: "Ajută animalele. Print pentru protectori animale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Prieteni necuvântători</h2><p>Un decor care trezește compasiune.</p>`
  },
  "copii": {
    key: "copii",
    title: "Tapet ONG Copii — Speranță & Viitor",
    shortDescription: "Copii, zâmbete, viitor pentru ONG-uri copii.",
    seoTitle: "Tapet ONG Copii | Decor Inspirational | Prynt",
    seoDescription: "Construiește viitorul. Tapet pentru fundații copii.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mâini mici, vise mari</h2><p>Un decor care luminează speranța.</p>`
  },
  "sanatate": {
    key: "sanatate",
    title: "Tapet ONG Sănătate — Vindecare & Sprijin",
    shortDescription: "Sănătate, îngrijire, ajutor pentru ONG-uri sănătate.",
    seoTitle: "Tapet ONG Sanatate | Decor Empatic | Prynt",
    seoDescription: "Îmbunătățește vieți. Print pentru organizații sănătate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sănătate pentru toți</h2><p>Un decor care vindecă suflete.</p>`
  },
  "educatie": {
    key: "educatie",
    title: "Tapet ONG Educație — Cunoaștere & Dezvoltare",
    shortDescription: "Cărți, învățare, viitor pentru ONG-uri educație.",
    seoTitle: "Tapet ONG Educatie | Decor Educational | Prynt",
    seoDescription: "Educația schimbă lumea. Tapet pentru fundații educaționale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Cunoașterea eliberează</h2><p>Un decor care inspiră învățare.</p>`
  },
  "cultura": {
    key: "cultura",
    title: "Tapet ONG Cultură — Artă & Tradiție",
    shortDescription: "Artă, tradiții, moștenire pentru ONG-uri cultură.",
    seoTitle: "Tapet ONG Cultura | Decor Artistic | Prynt",
    seoDescription: "Păstrează cultura. Print pentru organizații culturale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Moștenirea noastră</h2><p>Un decor care celebrează diversitatea.</p>`
  },
  "sport": {
    key: "sport",
    title: "Tapet ONG Sport — Energie & Echipă",
    shortDescription: "Sport, echipă, victorie pentru ONG-uri sport.",
    seoTitle: "Tapet ONG Sport | Decor Motivational | Prynt",
    seoDescription: "Promovează sănătatea. Tapet pentru cluburi sportive.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Jocuri și echipă</h2><p>Un decor care inspiră performanță.</p>`
  },
  "religie": {
    key: "religie",
    title: "Tapet ONG Religie — Spiritualitate & Comunitate",
    shortDescription: "Spiritualitate, comunitate, credință pentru ONG-uri religie.",
    seoTitle: "Tapet ONG Religie | Decor Spiritual | Prynt",
    seoDescription: "Construiește comunități. Print pentru organizații religioase.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Credință și unitate</h2><p>Un decor care unește suflete.</p>`
  },
  "voluntariat": {
    key: "voluntariat",
    title: "Tapet ONG Voluntariat — Altruism & Impact",
    shortDescription: "Voluntari, ajutor, impact pentru ONG-uri voluntariat.",
    seoTitle: "Tapet ONG Voluntariat | Decor Inspirational | Prynt",
    seoDescription: "Schimbă lumea. Tapet pentru centre voluntariat.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mâini care ajută</h2><p>Un decor care inspiră altruism.</p>`
  },
  "drepturi-om": {
    key: "drepturi-om",
    title: "Tapet ONG Drepturi Om — Egalitate & Justiție",
    shortDescription: "Drepturi, egalitate, justiție pentru ONG-uri drepturi om.",
    seoTitle: "Tapet ONG Drepturi Om | Decor Empatic | Prynt",
    seoDescription: "Apără drepturile. Print pentru organizații drepturi.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Egalitate pentru toți</h2><p>Un decor care luptă pentru justiție.</p>`
  },
  "dezvoltare": {
    key: "dezvoltare",
    title: "Tapet ONG Dezvoltare — Progres & Comunitate",
    shortDescription: "Dezvoltare, comunitate, progres pentru ONG-uri dezvoltare.",
    seoTitle: "Tapet ONG Dezvoltare | Decor Inspirational | Prynt",
    seoDescription: "Construiește viitorul. Tapet pentru organizații dezvoltare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Împreună înainte</h2><p>Un decor care inspiră schimbare.</p>`
  },
  "tehnologie": {
    key: "tehnologie",
    title: "Tapet ONG Tehnologie — Inovație & Acces",
    shortDescription: "Tehnologie, inovație, acces pentru ONG-uri tech.",
    seoTitle: "Tapet ONG Tehnologie | Decor Futurist | Prynt",
    seoDescription: "Conectează lumea. Print pentru organizații tech.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Tehnologia unește</h2><p>Un decor care programează viitorul.</p>`
  },
  "arta-si-cultura": {
    key: "arta-si-cultura",
    title: "Tapet ONG Artă și Cultură — Creație & Expresie",
    shortDescription: "Artă, cultură, expresie pentru ONG-uri artă.",
    seoTitle: "Tapet ONG Arta si Cultura | Decor Artistic | Prynt",
    seoDescription: "Celebrează creativitatea. Tapet pentru centre culturale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Expresie liberă</h2><p>Un decor care inspiră artă.</p>`
  },
  "turism-durabil": {
    key: "turism-durabil",
    title: "Tapet ONG Turism Durabil — Natură & Explorare",
    shortDescription: "Turism, natură, sustenabilitate pentru ONG-uri turism.",
    seoTitle: "Tapet ONG Turism Durabil | Decor Ecologic | Prynt",
    seoDescription: "Protejează destinații. Print pentru turism verde.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Călătorii responsabile</h2><p>Un decor care păstrează frumusețea.</p>`
  },
  "alimentatie": {
    key: "alimentatie",
    title: "Tapet ONG Alimentație — Nutriție & Sustenabilitate",
    shortDescription: "Alimentație, nutriție, hrană pentru ONG-uri alimentație.",
    seoTitle: "Tapet ONG Alimentatie | Decor Sustenabil | Prynt",
    seoDescription: "Hrănește comunitatea. Tapet pentru bănci alimentare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Hrana pentru toți</h2><p>Un decor care împarte abundența.</p>`
  },
  "locuinte": {
    key: "locuinte",
    title: "Tapet ONG Locuințe — Acasă & Siguranță",
    shortDescription: "Locuințe, acasă, siguranță pentru ONG-uri locuințe.",
    seoTitle: "Tapet ONG Locuinte | Decor Prietenos | Prynt",
    seoDescription: "Oferă adăpost. Print pentru organizații locuințe.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Un acoperiș deasupra capului</h2><p>Un decor care construiește siguranță.</p>`
  },
  "batrani": {
    key: "batrani",
    title: "Tapet ONG Bătrâni — Respect & Îngrijire",
    shortDescription: "Bătrâni, îngrijire, respect pentru ONG-uri bătrâni.",
    seoTitle: "Tapet ONG Batrani | Decor Empatic | Prynt",
    seoDescription: "Onorează înțelepciunea. Tapet pentru centre bătrâni.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Anii de aur</h2><p>Un decor care celebrează viață.</p>`
  },
  "handicap": {
    key: "handicap",
    title: "Tapet ONG Handicap — Incluziune & Sprijin",
    shortDescription: "Incluziune, sprijin, acces pentru ONG-uri handicap.",
    seoTitle: "Tapet ONG Handicap | Decor Inclusiv | Prynt",
    seoDescription: "Promovează egalitatea. Print pentru organizații handicap.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Toți merităm șanse egale</h2><p>Un decor care construiește punte.</p>`
  },
  "femei": {
    key: "femei",
    title: "Tapet ONG Femei — Putere & Egalitate",
    shortDescription: "Femei, putere, egalitate pentru ONG-uri femei.",
    seoTitle: "Tapet ONG Femei | Decor Empatic | Prynt",
    seoDescription: "Susține drepturile. Tapet pentru centre femei.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Putere feminină</h2><p>Un decor care inspiră schimbare.</p>`
  },
  "tineri": {
    key: "tineri",
    title: "Tapet ONG Tineri — Viitor & Oportunități",
    shortDescription: "Tineri, viitor, oportunități pentru ONG-uri tineri.",
    seoTitle: "Tapet ONG Tineri | Decor Inspirational | Prynt",
    seoDescription: "Construiește viitorul. Print pentru organizații tineri.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Energie tânără</h2><p>Un decor care deschide uși.</p>`
  },
  "imigranti": {
    key: "imigranti",
    title: "Tapet ONG Imigranți — Integrare & Sprijin",
    shortDescription: "Imigranți, integrare, sprijin pentru ONG-uri imigranți.",
    seoTitle: "Tapet ONG Imigranti | Decor Inclusiv | Prynt",
    seoDescription: "Binevenit acasă. Tapet pentru centre imigranți.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Împreună în diversitate</h2><p>Un decor care unește culturi.</p>`
  },
  "dezastre": {
    key: "dezastre",
    title: "Tapet ONG Dezastre — Ajutor & Reconstrucție",
    shortDescription: "Ajutor, reconstrucție, speranță pentru ONG-uri dezastre.",
    seoTitle: "Tapet ONG Dezastre | Decor Inspirational | Prynt",
    seoDescription: "Reconstruiește vieți. Print pentru organizații dezastre.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Speranță după furtună</h2><p>Un decor care aduce lumină.</p>`
  },
  "pace": {
    key: "pace",
    title: "Tapet ONG Pace — Armonie & Dialog",
    shortDescription: "Pace, armonie, dialog pentru ONG-uri pace.",
    seoTitle: "Tapet ONG Pace | Decor Empatic | Prynt",
    seoDescription: "Promovează pacea. Tapet pentru organizații pace.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lume fără războaie</h2><p>Un decor care inspiră dialog.</p>`
  },
  "democratie": {
    key: "democratie",
    title: "Tapet ONG Democrație — Libertate & Participare",
    shortDescription: "Democrație, libertate, participare pentru ONG-uri democrație.",
    seoTitle: "Tapet ONG Democratie | Decor Inspirational | Prynt",
    seoDescription: "Apără valorile. Print pentru organizații democrație.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Vocea poporului</h2><p>Un decor care celebrează libertatea.</p>`
  },
  "transparență": {
    key: "transparență",
    title: "Tapet ONG Transparență — Integritate & Responsabilitate",
    shortDescription: "Transparență, integritate, responsabilitate pentru ONG-uri transparență.",
    seoTitle: "Tapet ONG Transparenta | Decor Profesional | Prynt",
    seoDescription: "Promovează onestitatea. Tapet pentru organizații transparență.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Claritate și onestitate</h2><p>Un decor care construiește încredere.</p>`
  },
  "inovatie": {
    key: "inovatie",
    title: "Tapet ONG Inovație — Creativitate & Progres",
    shortDescription: "Inovație, creativitate, progres pentru ONG-uri inovație.",
    seoTitle: "Tapet ONG Inovatie | Decor Futurist | Prynt",
    seoDescription: "Inovează pentru bine. Print pentru centre inovație.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Gândire nouă</h2><p>Un decor care inspiră soluții.</p>`
  },
  "comunitate": {
    key: "comunitate",
    title: "Tapet ONG Comunitate — Unitate & Solidaritate",
    shortDescription: "Comunitate, unitate, solidaritate pentru ONG-uri comunitate.",
    seoTitle: "Tapet ONG Comunitate | Decor Prietenos | Prynt",
    seoDescription: "Construiește legături. Tapet pentru centre comunitare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Împreună suntem mai puternici</h2><p>Un decor care unește inimi.</p>`
  },
  "viitor": {
    key: "viitor",
    title: "Tapet ONG Viitor — Viziune & Planificare",
    shortDescription: "Viitor, viziune, planificare pentru ONG-uri viitor.",
    seoTitle: "Tapet ONG Viitor | Decor Inspirational | Prynt",
    seoDescription: "Plănuiește mâine. Print pentru organizații viitor.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mâine începe azi</h2><p>Un decor care vizează stelele.</p>`
  },
  "global": {
    key: "global",
    title: "Tapet ONG Global — Lume & Conexiune",
    shortDescription: "Global, lume, conexiune pentru ONG-uri globale.",
    seoTitle: "Tapet ONG Global | Decor Universal | Prynt",
    seoDescription: "Conectează lumea. Tapet pentru organizații globale.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>O lume conectată</h2><p>Un decor care unește continente.</p>`
  },
  "sustinabilitate": {
    key: "sustinabilitate",
    title: "Tapet ONG Sustenabilitate — Planetă & Viitor",
    shortDescription: "Sustenabilitate, planetă, viitor pentru ONG-uri sustenabilitate.",
    seoTitle: "Tapet ONG Sustinabilitate | Decor Verde | Prynt",
    seoDescription: "Salvează planeta. Print pentru centre sustenabilitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Pământul nostru comun</h2><p>Un decor care plantează semințe de schimbare.</p>`
  },
  "egalitate": {
    key: "egalitate",
    title: "Tapet ONG Egalitate — Dreptate & Incluziune",
    shortDescription: "Egalitate, dreptate, incluziune pentru ONG-uri egalitate.",
    seoTitle: "Tapet ONG Egalitate | Decor Empatic | Prynt",
    seoDescription: "Promovează dreptatea. Tapet pentru organizații egalitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Toți egali în drepturi</h2><p>Un decor care construiește o lume mai bună.</p>`
  },
  "diversitate": {
    key: "diversitate",
    title: "Tapet ONG Diversitate — Culori & Culturi",
    shortDescription: "Diversitate, culori, culturi pentru ONG-uri diversitate.",
    seoTitle: "Tapet ONG Diversitate | Decor Colorat | Prynt",
    seoDescription: "Celebrează diferențele. Print pentru centre diversitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Frumusețea diversității</h2><p>Un decor care îmbrățișează toate culorile.</p>`
  },
  "responsabilitate": {
    key: "responsabilitate",
    title: "Tapet ONG Responsabilitate — Acțiune & Impact",
    shortDescription: "Responsabilitate, acțiune, impact pentru ONG-uri responsabilitate.",
    seoTitle: "Tapet ONG Responsabilitate | Decor Inspirational | Prynt",
    seoDescription: "Fă diferența. Tapet pentru organizații responsabilitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Acțiuni care contează</h2><p>Un decor care inspiră responsabilitate.</p>`
  },
  "parteneriate": {
    key: "parteneriate",
    title: "Tapet ONG Parteneriate — Colaborare & Rețea",
    shortDescription: "Parteneriate, colaborare, rețea pentru ONG-uri parteneriate.",
    seoTitle: "Tapet ONG Parteneriate | Decor Colaborativ | Prynt",
    seoDescription: "Construiește alianțe. Print pentru centre parteneriate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Împreună pentru schimbare</h2><p>Un decor care țese rețele.</p>`
  },
  "impact": {
    key: "impact",
    title: "Tapet ONG Impact — Rezultate & Schimbare",
    shortDescription: "Impact, rezultate, schimbare pentru ONG-uri impact.",
    seoTitle: "Tapet ONG Impact | Decor Motivational | Prynt",
    seoDescription: "Măsoară succesul. Tapet pentru organizații impact.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Schimbarea începe cu tine</h2><p>Un decor care măsoară progresul.</p>`
  },
  "vizibilitate": {
    key: "vizibilitate",
    title: "Tapet ONG Vizibilitate — Voce & Audiență",
    shortDescription: "Vizibilitate, voce, audiență pentru ONG-uri vizibilitate.",
    seoTitle: "Tapet ONG Vizibilitate | Decor Comunicativ | Prynt",
    seoDescription: "Fă-te auzit. Print pentru centre vizibilitate.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Vocea comunității</h2><p>Un decor care amplifică mesajul.</p>`
  },
  "finantare": {
    key: "finantare",
    title: "Tapet ONG Finanțare — Resurse & Sustenabilitate",
    shortDescription: "Finanțare, resurse, sustenabilitate pentru ONG-uri finanțare.",
    seoTitle: "Tapet ONG Finantare | Decor Profesional | Prynt",
    seoDescription: "Asigură viitorul. Tapet pentru centre finanțare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Resurse pentru bine</h2><p>Un decor care atrage sprijin.</p>`
  },
  "voluntari": {
    key: "voluntari",
    title: "Tapet ONG Voluntari — Dăruire & Energie",
    shortDescription: "Voluntari, dăruire, energie pentru ONG-uri voluntari.",
    seoTitle: "Tapet ONG Voluntari | Decor Inspirational | Prynt",
    seoDescription: "Mulțumește eroilor. Print pentru centre voluntari.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Inimi generoase</h2><p>Un decor care celebrează dăruirea.</p>`
  },
  "campanii": {
    key: "campanii",
    title: "Tapet ONG Campanii — Mobilizare & Conștientizare",
    shortDescription: "Campanii, mobilizare, conștientizare pentru ONG-uri campanii.",
    seoTitle: "Tapet ONG Campanii | Decor Motivational | Prynt",
    seoDescription: "Mobilizează pentru cauză. Tapet pentru centre campanii.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Vocea schimbării</h2><p>Un decor care trezește conștiința.</p>`
  },
  "proiecte": {
    key: "proiecte",
    title: "Tapet ONG Proiecte — Implementare & Succes",
    shortDescription: "Proiecte, implementare, succes pentru ONG-uri proiecte.",
    seoTitle: "Tapet ONG Proiecte | Decor Profesional | Prynt",
    seoDescription: "Realizează vise. Print pentru centre proiecte.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>De la idee la realitate</h2><p>Un decor care inspiră execuție.</p>`
  },
  "evaluare": {
    key: "evaluare",
    title: "Tapet ONG Evaluare — Măsurare & Îmbunătățire",
    shortDescription: "Evaluare, măsurare, îmbunătățire pentru ONG-uri evaluare.",
    seoTitle: "Tapet ONG Evaluare | Decor Analitic | Prynt",
    seoDescription: "Îmbunătățește impactul. Tapet pentru centre evaluare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Măsurarea succesului</h2><p>Un decor care analizează progresul.</p>`
  },
  "strategie": {
    key: "strategie",
    title: "Tapet ONG Strategie — Planificare & Viziune",
    shortDescription: "Strategie, planificare, viziune pentru ONG-uri strategie.",
    seoTitle: "Tapet ONG Strategie | Decor Strategic | Prynt",
    seoDescription: "Planifică viitorul. Print pentru centre strategie.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viziune clară</h2><p>Un decor care trasează drumul.</p>`
  },
  "leadership": {
    key: "leadership",
    title: "Tapet ONG Leadership — Conducere & Inspirație",
    shortDescription: "Leadership, conducere, inspirație pentru ONG-uri leadership.",
    seoTitle: "Tapet ONG Leadership | Decor Inspirational | Prynt",
    seoDescription: "Inspiră lideri. Tapet pentru centre leadership.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lideri pentru schimbare</h2><p>Un decor care cultivă leadership.</p>`
  },
  "comunicare": {
    key: "comunicare",
    title: "Tapet ONG Comunicare — Mesaj & Conexiune",
    shortDescription: "Comunicare, mesaj, conexiune pentru ONG-uri comunicare.",
    seoTitle: "Tapet ONG Comunicare | Decor Comunicativ | Prynt",
    seoDescription: "Conectează cu publicul. Print pentru centre comunicare.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mesaje care ajung</h2><p>Un decor care facilitează dialogul.</p>`
  },
  "tehnologie-ong": {
    key: "tehnologie-ong",
    title: "Tapet ONG Tehnologie — Digital & Inovație",
    shortDescription: "Tehnologie, digital, inovație pentru ONG-uri tech.",
    seoTitle: "Tapet ONG Tehnologie | Decor Tech | Prynt",
    seoDescription: "Inovează pentru bine. Tapet pentru centre tech ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Tehnologia pentru bine</h2><p>Un decor care conectează inovația cu impactul.</p>`
  },
  "arta-ong": {
    key: "arta-ong",
    title: "Tapet ONG Artă — Creație & Expresie",
    shortDescription: "Artă, creație, expresie pentru ONG-uri artă.",
    seoTitle: "Tapet ONG Arta | Decor Artistic | Prynt",
    seoDescription: "Arta schimbă lumea. Print pentru centre artă ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Expresie liberă pentru bine</h2><p>Un decor care inspiră creație socială.</p>`
  },
  "sport-ong": {
    key: "sport-ong",
    title: "Tapet ONG Sport — Sănătate & Comunitate",
    shortDescription: "Sport, sănătate, comunitate pentru ONG-uri sport.",
    seoTitle: "Tapet ONG Sport | Decor Motivational | Prynt",
    seoDescription: "Sport pentru toți. Tapet pentru centre sport ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mișcare pentru bine</h2><p>Un decor care promovează sănătatea comunității.</p>`
  },
  "educatie-ong": {
    key: "educatie-ong",
    title: "Tapet ONG Educație — Cunoaștere & Dezvoltare",
    shortDescription: "Educație, cunoaștere, dezvoltare pentru ONG-uri educație.",
    seoTitle: "Tapet ONG Educatie | Decor Educational | Prynt",
    seoDescription: "Educația eliberează. Print pentru centre educație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Cunoașterea pentru toți</h2><p>Un decor care inspiră învățare comunitară.</p>`
  },
  "sanatate-ong": {
    key: "sanatate-ong",
    title: "Tapet ONG Sănătate — Îngrijire & Prevenție",
    shortDescription: "Sănătate, îngrijire, prevenire pentru ONG-uri sănătate.",
    seoTitle: "Tapet ONG Sanatate | Decor Empatic | Prynt",
    seoDescription: "Sănătate pentru toți. Tapet pentru centre sănătate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îngrijire pentru comunitate</h2><p>Un decor care promovează bunăstarea generală.</p>`
  },
  "mediu-ong": {
    key: "mediu-ong",
    title: "Tapet ONG Mediu — Natură & Conservare",
    shortDescription: "Mediu, natură, conservare pentru ONG-uri mediu.",
    seoTitle: "Tapet ONG Mediu | Decor Ecologic | Prynt",
    seoDescription: "Protejează planeta. Print pentru centre mediu ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Natura noastră comună</h2><p>Un decor care inspiră conservarea.</p>`
  },
  "social-ong": {
    key: "social-ong",
    title: "Tapet ONG Social — Sprijin & Incluziune",
    shortDescription: "Social, sprijin, incluziune pentru ONG-uri sociale.",
    seoTitle: "Tapet ONG Social | Decor Empatic | Prynt",
    seoDescription: "Ajută comunitatea. Tapet pentru centre sociale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sprijin pentru toți</h2><p>Un decor care construiește incluziune.</p>`
  },
  "cultural-ong": {
    key: "cultural-ong",
    title: "Tapet ONG Cultural — Tradiție & Identitate",
    shortDescription: "Cultural, tradiție, identitate pentru ONG-uri culturale.",
    seoTitle: "Tapet ONG Cultural | Decor Artistic | Prynt",
    seoDescription: "Păstrează cultura. Print pentru centre culturale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Moștenirea noastră</h2><p>Un decor care celebrează identitatea.</p>`
  },
  "economic-ong": {
    key: "economic-ong",
    title: "Tapet ONG Economic — Dezvoltare & Oportunități",
    shortDescription: "Economic, dezvoltare, oportunități pentru ONG-uri economice.",
    seoTitle: "Tapet ONG Economic | Decor Profesional | Prynt",
    seoDescription: "Dezvoltă comunitatea. Tapet pentru centre economice ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Oportunități pentru toți</h2><p>Un decor care inspiră creștere economică.</p>`
  },
  "politic-ong": {
    key: "politic-ong",
    title: "Tapet ONG Politic — Democrație & Participare",
    shortDescription: "Politic, democrație, participare pentru ONG-uri politice.",
    seoTitle: "Tapet ONG Politic | Decor Inspirational | Prynt",
    seoDescription: "Participă la democrație. Print pentru centre politice ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Vocea cetățeanului</h2><p>Un decor care promovează participarea.</p>`
  },
  "international-ong": {
    key: "international-ong",
    title: "Tapet ONG Internațional — Global & Solidaritate",
    shortDescription: "Internațional, global, solidaritate pentru ONG-uri internaționale.",
    seoTitle: "Tapet ONG International | Decor Universal | Prynt",
    seoDescription: "Solidaritate globală. Tapet pentru centre internaționale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lumea împreună</h2><p>Un decor care unește națiuni.</p>`
  },
  "local-ong": {
    key: "local-ong",
    title: "Tapet ONG Local — Comunitate & Identitate",
    shortDescription: "Local, comunitate, identitate pentru ONG-uri locale.",
    seoTitle: "Tapet ONG Local | Decor Prietenos | Prynt",
    seoDescription: "Construiește comunitatea. Print pentru centre locale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Rădăcinile noastre</h2><p>Un decor care întărește legăturile locale.</p>`
  },
  "tineret-ong": {
    key: "tineret-ong",
    title: "Tapet ONG Tineret — Viitor & Energie",
    shortDescription: "Tineret, viitor, energie pentru ONG-uri tineret.",
    seoTitle: "Tapet ONG Tineret | Decor Inspirational | Prynt",
    seoDescription: "Energie tânără pentru schimbare. Tapet pentru centre tineret ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viitorul în mâinile tinere</h2><p>Un decor care inspiră generația tânără.</p>`
  },
  "femei-ong": {
    key: "femei-ong",
    title: "Tapet ONG Femei — Putere & Egalitate",
    shortDescription: "Femei, putere, egalitate pentru ONG-uri femei.",
    seoTitle: "Tapet ONG Femei | Decor Empatic | Prynt",
    seoDescription: "Putere feminină. Tapet pentru centre femei ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Egalitate pentru toate</h2><p>Un decor care celebrează puterea feminină.</p>`
  },
  "barbati-ong": {
    key: "barbati-ong",
    title: "Tapet ONG Bărbați — Responsabilitate & Sprijin",
    shortDescription: "Bărbați, responsabilitate, sprijin pentru ONG-uri bărbați.",
    seoTitle: "Tapet ONG Barbati | Decor Inspirational | Prynt",
    seoDescription: "Responsabilitate masculină. Print pentru centre bărbați ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Putere responsabilă</h2><p>Un decor care inspiră leadership masculin.</p>`
  },
  "familie-ong": {
    key: "familie-ong",
    title: "Tapet ONG Familie — Unitate & Iubire",
    shortDescription: "Familie, unitate, iubire pentru ONG-uri familie.",
    seoTitle: "Tapet ONG Familie | Decor Prietenos | Prynt",
    seoDescription: "Familii puternice. Tapet pentru centre familie ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Iubire familială</h2><p>Un decor care întărește legăturile de familie.</p>`
  },
  "copii-ong": {
    key: "copii-ong",
    title: "Tapet ONG Copii — Speranță & Protecție",
    shortDescription: "Copii, speranță, protecție pentru ONG-uri copii.",
    seoTitle: "Tapet ONG Copii | Decor Inspirational | Prynt",
    seoDescription: "Viitor luminos pentru copii. Print pentru centre copii ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mâini mici, vise mari</h2><p>Un decor care protejează inocența.</p>`
  },
  "batrani-ong": {
    key: "batrani-ong",
    title: "Tapet ONG Bătrâni — Respect & Îngrijire",
    shortDescription: "Bătrâni, respect, îngrijire pentru ONG-uri bătrâni.",
    seoTitle: "Tapet ONG Batrani | Decor Empatic | Prynt",
    seoDescription: "Respect pentru înțelepciune. Tapet pentru centre bătrâni ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Anii de aur</h2><p>Un decor care onorează experiența.</p>`
  },
  "handicap-ong": {
    key: "handicap-ong",
    title: "Tapet ONG Handicap — Incluziune & Acces",
    shortDescription: "Handicap, incluziune, acces pentru ONG-uri handicap.",
    seoTitle: "Tapet ONG Handicap | Decor Inclusiv | Prynt",
    seoDescription: "Acces pentru toți. Print pentru centre handicap ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Egalitate în diversitate</h2><p>Un decor care construiește accesibilitate.</p>`
  },
  "imigranti-ong": {
    key: "imigranti-ong",
    title: "Tapet ONG Imigranți — Integrare & Bun Venit",
    shortDescription: "Imigranți, integrare, bun venit pentru ONG-uri imigranți.",
    seoTitle: "Tapet ONG Imigranti | Decor Inclusiv | Prynt",
    seoDescription: "Bun venit acasă. Tapet pentru centre imigranți ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Împreună în diversitate</h2><p>Un decor care sărbătorește integrarea.</p>`
  },
  "dezastre-ong": {
    key: "dezastre-ong",
    title: "Tapet ONG Dezastre — Ajutor & Reconstrucție",
    shortDescription: "Dezastre, ajutor, reconstrucție pentru ONG-uri dezastre.",
    seoTitle: "Tapet ONG Dezastre | Decor Inspirational | Prynt",
    seoDescription: "Speranță după furtună. Print pentru centre dezastre ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Reconstrucție și speranță</h2><p>Un decor care aduce lumină în întuneric.</p>`
  },
  "pace-ong": {
    key: "pace-ong",
    title: "Tapet ONG Pace — Armonie & Dialog",
    shortDescription: "Pace, armonie, dialog pentru ONG-uri pace.",
    seoTitle: "Tapet ONG Pace | Decor Empatic | Prynt",
    seoDescription: "Pacea începe cu tine. Tapet pentru centre pace ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Lume fără conflicte</h2><p>Un decor care promovează armonia.</p>`
  },
  "democratie-ong": {
    key: "democratie-ong",
    title: "Tapet ONG Democrație — Libertate & Participare",
    shortDescription: "Democrație, libertate, participare pentru ONG-uri democrație.",
    seoTitle: "Tapet ONG Democratie | Decor Inspirational | Prynt",
    seoDescription: "Vocea poporului. Print pentru centre democrație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Libertate pentru toți</h2><p>Un decor care celebrează democrația.</p>`
  },
  "transparență-ong": {
    key: "transparență-ong",
    title: "Tapet ONG Transparență — Integritate & Responsabilitate",
    shortDescription: "Transparență, integritate, responsabilitate pentru ONG-uri transparență.",
    seoTitle: "Tapet ONG Transparenta | Decor Profesional | Prynt",
    seoDescription: "Onestitate în acțiune. Tapet pentru centre transparență ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Claritate și încredere</h2><p>Un decor care promovează transparența.</p>`
  },
  "inovatie-ong": {
    key: "inovatie-ong",
    title: "Tapet ONG Inovație — Creativitate & Progres",
    shortDescription: "Inovație, creativitate, progres pentru ONG-uri inovație.",
    seoTitle: "Tapet ONG Inovatie | Decor Futurist | Prynt",
    seoDescription: "Inovație pentru bine. Print pentru centre inovație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Gândire nouă pentru schimbare</h2><p>Un decor care inspiră soluții inovatoare.</p>`
  },
  "comunitate-ong": {
    key: "comunitate-ong",
    title: "Tapet ONG Comunitate — Unitate & Solidaritate",
    shortDescription: "Comunitate, unitate, solidaritate pentru ONG-uri comunitate.",
    seoTitle: "Tapet ONG Comunitate | Decor Prietenos | Prynt",
    seoDescription: "Împreună suntem mai puternici. Tapet pentru centre comunitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Legături puternice</h2><p>Un decor care unește comunitatea.</p>`
  },
  "viitor-ong": {
    key: "viitor-ong",
    title: "Tapet ONG Viitor — Viziune & Planificare",
    shortDescription: "Viitor, viziune, planificare pentru ONG-uri viitor.",
    seoTitle: "Tapet ONG Viitor | Decor Inspirational | Prynt",
    seoDescription: "Mâine începe azi. Print pentru centre viitor ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viziune pentru generații</h2><p>Un decor care planifică viitorul.</p>`
  },
  "global-ong": {
    key: "global-ong",
    title: "Tapet ONG Global — Lume & Conexiune",
    shortDescription: "Global, lume, conexiune pentru ONG-uri globale.",
    seoTitle: "Tapet ONG Global | Decor Universal | Prynt",
    seoDescription: "O lume conectată. Tapet pentru centre globale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Conexiune planetară</h2><p>Un decor care unește lumea.</p>`
  },
  "sustinabilitate-ong": {
    key: "sustinabilitate-ong",
    title: "Tapet ONG Sustenabilitate — Planetă & Viitor",
    shortDescription: "Sustenabilitate, planetă, viitor pentru ONG-uri sustenabilitate.",
    seoTitle: "Tapet ONG Sustinabilitate | Decor Verde | Prynt",
    seoDescription: "Salvează planeta împreună. Print pentru centre sustenabilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Pământul nostru comun</h2><p>Un decor care inspiră acțiuni sustenabile.</p>`
  },
  "egalitate-ong": {
    key: "egalitate-ong",
    title: "Tapet ONG Egalitate — Dreptate & Incluziune",
    shortDescription: "Egalitate, dreptate, incluziune pentru ONG-uri egalitate.",
    seoTitle: "Tapet ONG Egalitate | Decor Empatic | Prynt",
    seoDescription: "Dreptate pentru toți. Tapet pentru centre egalitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Egalitate în acțiune</h2><p>Un decor care promovează dreptatea.</p>`
  },
  "diversitate-ong": {
    key: "diversitate-ong",
    title: "Tapet ONG Diversitate — Culori & Culturi",
    shortDescription: "Diversitate, culori, culturi pentru ONG-uri diversitate.",
    seoTitle: "Tapet ONG Diversitate | Decor Colorat | Prynt",
    seoDescription: "Frumusețea diversității. Print pentru centre diversitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Culori ale lumii</h2><p>Un decor care sărbătorește diversitatea.</p>`
  },
  "responsabilitate-ong": {
    key: "responsabilitate-ong",
    title: "Tapet ONG Responsabilitate — Acțiune & Impact",
    shortDescription: "Responsabilitate, acțiune, impact pentru ONG-uri responsabilitate.",
    seoTitle: "Tapet ONG Responsabilitate | Decor Inspirational | Prynt",
    seoDescription: "Acțiuni care contează. Tapet pentru centre responsabilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Responsabilitate pentru bine</h2><p>Un decor care inspiră acțiuni pozitive.</p>`
  },
  "parteneriate-ong": {
    key: "parteneriate-ong",
    title: "Tapet ONG Parteneriate — Colaborare & Rețea",
    shortDescription: "Parteneriate, colaborare, rețea pentru ONG-uri parteneriate.",
    seoTitle: "Tapet ONG Parteneriate | Decor Colaborativ | Prynt",
    seoDescription: "Împreună pentru schimbare. Print pentru centre parteneriate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Rețele puternice</h2><p>Un decor care construiește alianțe.</p>`
  },
  "impact-ong": {
    key: "impact-ong",
    title: "Tapet ONG Impact — Rezultate & Schimbare",
    shortDescription: "Impact, rezultate, schimbare pentru ONG-uri impact.",
    seoTitle: "Tapet ONG Impact | Decor Motivational | Prynt",
    seoDescription: "Schimbarea începe cu tine. Tapet pentru centre impact ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Rezultate care contează</h2><p>Un decor care măsoară impactul.</p>`
  },
  "vizibilitate-ong": {
    key: "vizibilitate-ong",
    title: "Tapet ONG Vizibilitate — Voce & Audiență",
    shortDescription: "Vizibilitate, voce, audiență pentru ONG-uri vizibilitate.",
    seoTitle: "Tapet ONG Vizibilitate | Decor Comunicativ | Prynt",
    seoDescription: "Fă-te auzit. Print pentru centre vizibilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Voce puternică</h2><p>Un decor care amplifică mesajul.</p>`
  },
  "finantare-ong": {
    key: "finantare-ong",
    title: "Tapet ONG Finanțare — Resurse & Sustenabilitate",
    shortDescription: "Finanțare, resurse, sustenabilitate pentru ONG-uri finanțare.",
    seoTitle: "Tapet ONG Finantare | Decor Profesional | Prynt",
    seoDescription: "Resurse pentru bine. Tapet pentru centre finanțare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Finanțare sustenabilă</h2><p>Un decor care atrage sprijin financiar.</p>`
  },
  "voluntari-ong": {
    key: "voluntari-ong",
    title: "Tapet ONG Voluntari — Dăruire & Energie",
    shortDescription: "Voluntari, dăruire, energie pentru ONG-uri voluntari.",
    seoTitle: "Tapet ONG Voluntari | Decor Inspirational | Prynt",
    seoDescription: "Eroi ai comunității. Print pentru centre voluntari ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Dăruire pentru bine</h2><p>Un decor care celebrează voluntariatul.</p>`
  },
  "campanii-ong": {
    key: "campanii-ong",
    title: "Tapet ONG Campanii — Mobilizare & Conștientizare",
    shortDescription: "Campanii, mobilizare, conștientizare pentru ONG-uri campanii.",
    seoTitle: "Tapet ONG Campanii | Decor Motivational | Prynt",
    seoDescription: "Mobilizează pentru cauză. Tapet pentru centre campanii ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Campanii de impact</h2><p>Un decor care trezește conștiința.</p>`
  },
  "proiecte-ong": {
    key: "proiecte-ong",
    title: "Tapet ONG Proiecte — Implementare & Succes",
    shortDescription: "Proiecte, implementare, succes pentru ONG-uri proiecte.",
    seoTitle: "Tapet ONG Proiecte | Decor Profesional | Prynt",
    seoDescription: "De la idee la realitate. Print pentru centre proiecte ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Proiecte de succes</h2><p>Un decor care inspiră execuție.</p>`
  },
  "evaluare-ong": {
    key: "evaluare-ong",
    title: "Tapet ONG Evaluare — Măsurare & Îmbunătățire",
    shortDescription: "Evaluare, măsurare, îmbunătățire pentru ONG-uri evaluare.",
    seoTitle: "Tapet ONG Evaluare | Decor Analitic | Prynt",
    seoDescription: "Îmbunătățește impactul. Tapet pentru centre evaluare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Măsurarea progresului</h2><p>Un decor care analizează rezultatele.</p>`
  },
  "strategie-ong": {
    key: "strategie-ong",
    title: "Tapet ONG Strategie — Planificare & Viziune",
    shortDescription: "Strategie, planificare, viziune pentru ONG-uri strategie.",
    seoTitle: "Tapet ONG Strategie | Decor Strategic | Prynt",
    seoDescription: "Planifică viitorul. Print pentru centre strategie ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Strategii câștigătoare</h2><p>Un decor care trasează drumul.</p>`
  },
  "leadership-ong": {
    key: "leadership-ong",
    title: "Tapet ONG Leadership — Conducere & Inspirație",
    shortDescription: "Leadership, conducere, inspirație pentru ONG-uri leadership.",
    seoTitle: "Tapet ONG Leadership | Decor Inspirational | Prynt",
    seoDescription: "Lideri pentru schimbare. Tapet pentru centre leadership ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Leadership inspirant</h2><p>Un decor care cultivă conducerea.</p>`
  },
  "comunicare-ong": {
    key: "comunicare-ong",
    title: "Tapet ONG Comunicare — Mesaj & Conexiune",
    shortDescription: "Comunicare, mesaj, conexiune pentru ONG-uri comunicare.",
    seoTitle: "Tapet ONG Comunicare | Decor Comunicativ | Prynt",
    seoDescription: "Mesaje care ajung. Print pentru centre comunicare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Comunicare eficientă</h2><p>Un decor care facilitează dialogul.</p>`
  },
  "tehnologie-ong-final": {
    key: "tehnologie-ong-final",
    title: "Tapet ONG Tehnologie — Digital & Inovație",
    shortDescription: "Tehnologie, digital, inovație pentru ONG-uri tech.",
    seoTitle: "Tapet ONG Tehnologie | Decor Tech | Prynt",
    seoDescription: "Tehnologia pentru bine. Tapet pentru centre tech ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Inovație digitală</h2><p>Un decor care conectează tech cu impactul social.</p>`
  },
  "arta-ong-final": {
    key: "arta-ong-final",
    title: "Tapet ONG Artă — Creație & Expresie",
    shortDescription: "Artă, creație, expresie pentru ONG-uri artă.",
    seoTitle: "Tapet ONG Arta | Decor Artistic | Prynt",
    seoDescription: "Arta schimbă lumea. Print pentru centre artă ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Expresie artistică pentru bine</h2><p>Un decor care inspiră creație socială.</p>`
  },
  "sport-ong-final": {
    key: "sport-ong-final",
    title: "Tapet ONG Sport — Sănătate & Comunitate",
    shortDescription: "Sport, sănătate, comunitate pentru ONG-uri sport.",
    seoTitle: "Tapet ONG Sport | Decor Motivational | Prynt",
    seoDescription: "Sport pentru toți. Tapet pentru centre sport ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Mișcare comunitară</h2><p>Un decor care promovează sănătatea prin sport.</p>`
  },
  "educatie-ong-final": {
    key: "educatie-ong-final",
    title: "Tapet ONG Educație — Cunoaștere & Dezvoltare",
    shortDescription: "Educație, cunoaștere, dezvoltare pentru ONG-uri educație.",
    seoTitle: "Tapet ONG Educatie | Decor Educational | Prynt",
    seoDescription: "Educația eliberează. Print pentru centre educație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Cunoaștere accesibilă</h2><p>Un decor care inspiră învățare pentru toți.</p>`
  },
  "sanatate-ong-final": {
    key: "sanatate-ong-final",
    title: "Tapet ONG Sănătate — Îngrijire & Prevenție",
    shortDescription: "Sănătate, îngrijire, prevenire pentru ONG-uri sănătate.",
    seoTitle: "Tapet ONG Sanatate | Decor Empatic | Prynt",
    seoDescription: "Sănătate pentru toți. Tapet pentru centre sănătate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îngrijire preventivă</h2><p>Un decor care promovează bunăstarea comunității.</p>`
  },
  "mediu-ong-final": {
    key: "mediu-ong-final",
    title: "Tapet ONG Mediu — Natură & Conservare",
    shortDescription: "Mediu, natură, conservare pentru ONG-uri mediu.",
    seoTitle: "Tapet ONG Mediu | Decor Ecologic | Prynt",
    seoDescription: "Protejează planeta. Print pentru centre mediu ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Conservare activă</h2><p>Un decor care inspiră protecția mediului.</p>`
  },
  "social-ong-final": {
    key: "social-ong-final",
    title: "Tapet ONG Social — Sprijin & Incluziune",
    shortDescription: "Social, sprijin, incluziune pentru ONG-uri sociale.",
    seoTitle: "Tapet ONG Social | Decor Empatic | Prynt",
    seoDescription: "Ajută comunitatea. Tapet pentru centre sociale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sprijin incluziv</h2><p>Un decor care construiește o comunitate puternică.</p>`
  },
  "cultural-ong-final": {
    key: "cultural-ong-final",
    title: "Tapet ONG Cultural — Tradiție & Identitate",
    shortDescription: "Cultural, tradiție, identitate pentru ONG-uri culturale.",
    seoTitle: "Tapet ONG Cultural | Decor Artistic | Prynt",
    seoDescription: "Păstrează cultura. Print pentru centre culturale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Identitate culturală</h2><p>Un decor care celebrează moștenirea.</p>`
  },
  "economic-ong-final": {
    key: "economic-ong-final",
    title: "Tapet ONG Economic — Dezvoltare & Oportunități",
    shortDescription: "Economic, dezvoltare, oportunități pentru ONG-uri economice.",
    seoTitle: "Tapet ONG Economic | Decor Profesional | Prynt",
    seoDescription: "Dezvoltă comunitatea. Tapet pentru centre economice ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Oportunități economice</h2><p>Un decor care inspiră creștere sustenabilă.</p>`
  },
  "politic-ong-final": {
    key: "politic-ong-final",
    title: "Tapet ONG Politic — Democrație & Participare",
    shortDescription: "Politic, democrație, participare pentru ONG-uri politice.",
    seoTitle: "Tapet ONG Politic | Decor Inspirational | Prynt",
    seoDescription: "Participă la democrație. Print pentru centre politice ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Participare activă</h2><p>Un decor care promovează implicarea civică.</p>`
  },
  "international-ong-final": {
    key: "international-ong-final",
    title: "Tapet ONG Internațional — Global & Solidaritate",
    shortDescription: "Internațional, global, solidaritate pentru ONG-uri internaționale.",
    seoTitle: "Tapet ONG International | Decor Universal | Prynt",
    seoDescription: "Solidaritate globală. Tapet pentru centre internaționale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Solidaritate planetară</h2><p>Un decor care unește națiunile.</p>`
  },
  "local-ong-final": {
    key: "local-ong-final",
    title: "Tapet ONG Local — Comunitate & Identitate",
    shortDescription: "Local, comunitate, identitate pentru ONG-uri locale.",
    seoTitle: "Tapet ONG Local | Decor Prietenos | Prynt",
    seoDescription: "Construiește comunitatea. Print pentru centre locale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Identitate locală</h2><p>Un decor care întărește legăturile comunitare.</p>`
  },
  "tineret-ong-final": {
    key: "tineret-ong-final",
    title: "Tapet ONG Tineret — Viitor & Energie",
    shortDescription: "Tineret, viitor, energie pentru ONG-uri tineret.",
    seoTitle: "Tapet ONG Tineret | Decor Inspirational | Prynt",
    seoDescription: "Energie tânără pentru schimbare. Tapet pentru centre tineret ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Energie pentru viitor</h2><p>Un decor care inspiră generația tânără.</p>`
  },
  "femei-ong-final": {
    key: "femei-ong-final",
    title: "Tapet ONG Femei — Putere & Egalitate",
    shortDescription: "Femei, putere, egalitate pentru ONG-uri femei.",
    seoTitle: "Tapet ONG Femei | Decor Empatic | Prynt",
    seoDescription: "Putere feminină. Tapet pentru centre femei ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Egalitate feminină</h2><p>Un decor care celebrează puterea și egalitatea.</p>`
  },
  "barbati-ong-final": {
    key: "barbati-ong-final",
    title: "Tapet ONG Bărbați — Responsabilitate & Sprijin",
    shortDescription: "Bărbați, responsabilitate, sprijin pentru ONG-uri bărbați.",
    seoTitle: "Tapet ONG Barbati | Decor Inspirational | Prynt",
    seoDescription: "Responsabilitate masculină. Print pentru centre bărbați ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Leadership responsabil</h2><p>Un decor care inspiră bărbați implicați.</p>`
  },
  "familie-ong-final": {
    key: "familie-ong-final",
    title: "Tapet ONG Familie — Unitate & Iubire",
    shortDescription: "Familie, unitate, iubire pentru ONG-uri familie.",
    seoTitle: "Tapet ONG Familie | Decor Prietenos | Prynt",
    seoDescription: "Familii puternice. Tapet pentru centre familie ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Unitate familială</h2><p>Un decor care întărește iubirea de familie.</p>`
  },
  "copii-ong-final": {
    key: "copii-ong-final",
    title: "Tapet ONG Copii — Speranță & Protecție",
    shortDescription: "Copii, speranță, protecție pentru ONG-uri copii.",
    seoTitle: "Tapet ONG Copii | Decor Inspirational | Prynt",
    seoDescription: "Viitor luminos pentru copii. Print pentru centre copii ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Protecție pentru copii</h2><p>Un decor care păstrează inocența și speranța.</p>`
  },
  "batrani-ong-final": {
    key: "batrani-ong-final",
    title: "Tapet ONG Bătrâni — Respect & Îngrijire",
    shortDescription: "Bătrâni, respect, îngrijire pentru ONG-uri bătrâni.",
    seoTitle: "Tapet ONG Batrani | Decor Empatic | Prynt",
    seoDescription: "Respect pentru înțelepciune. Tapet pentru centre bătrâni ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îngrijire respectuoasă</h2><p>Un decor care onorează experiența de viață.</p>`
  },
  "handicap-ong-final": {
    key: "handicap-ong-final",
    title: "Tapet ONG Handicap — Incluziune & Acces",
    shortDescription: "Handicap, incluziune, acces pentru ONG-uri handicap.",
    seoTitle: "Tapet ONG Handicap | Decor Inclusiv | Prynt",
    seoDescription: "Acces pentru toți. Print pentru centre handicap ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Incluziune totală</h2><p>Un decor care construiește accesibilitate universală.</p>`
  },
  "imigranti-ong-final": {
    key: "imigranti-ong-final",
    title: "Tapet ONG Imigranți — Integrare & Bun Venit",
    shortDescription: "Imigranți, integrare, bun venit pentru ONG-uri imigranți.",
    seoTitle: "Tapet ONG Imigranti | Decor Inclusiv | Prynt",
    seoDescription: "Bun venit acasă. Tapet pentru centre imigranți ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Integrare reușită</h2><p>Un decor care sărbătorește diversitatea culturală.</p>`
  },
  "dezastre-ong-final": {
    key: "dezastre-ong-final",
    title: "Tapet ONG Dezastre — Ajutor & Reconstrucție",
    shortDescription: "Dezastre, ajutor, reconstrucție pentru ONG-uri dezastre.",
    seoTitle: "Tapet ONG Dezastre | Decor Inspirational | Prynt",
    seoDescription: "Speranță după furtună. Print pentru centre dezastre ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Reconstrucție puternică</h2><p>Un decor care aduce speranță și ajutor.</p>`
  },
  "pace-ong-final": {
    key: "pace-ong-final",
    title: "Tapet ONG Pace — Armonie & Dialog",
    shortDescription: "Pace, armonie, dialog pentru ONG-uri pace.",
    seoTitle: "Tapet ONG Pace | Decor Empatic | Prynt",
    seoDescription: "Pacea începe cu tine. Tapet pentru centre pace ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Armonie globală</h2><p>Un decor care promovează dialogul și pacea.</p>`
  },
  "democratie-ong-final": {
    key: "democratie-ong-final",
    title: "Tapet ONG Democrație — Libertate & Participare",
    shortDescription: "Democrație, libertate, participare pentru ONG-uri democrație.",
    seoTitle: "Tapet ONG Democratie | Decor Inspirational | Prynt",
    seoDescription: "Vocea poporului. Print pentru centre democrație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Libertate democratică</h2><p>Un decor care celebrează participarea civică.</p>`
  },
  "transparență-ong-final": {
    key: "transparență-ong-final",
    title: "Tapet ONG Transparență — Integritate & Responsabilitate",
    shortDescription: "Transparență, integritate, responsabilitate pentru ONG-uri transparență.",
    seoTitle: "Tapet ONG Transparenta | Decor Profesional | Prynt",
    seoDescription: "Onestitate în acțiune. Tapet pentru centre transparență ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Integritate totală</h2><p>Un decor care promovează transparența absolută.</p>`
  },
  "inovatie-ong-final": {
    key: "inovatie-ong-final",
    title: "Tapet ONG Inovație — Creativitate & Progres",
    shortDescription: "Inovație, creativitate, progres pentru ONG-uri inovație.",
    seoTitle: "Tapet ONG Inovatie | Decor Futurist | Prynt",
    seoDescription: "Inovație pentru bine. Print pentru centre inovație ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Progres inovator</h2><p>Un decor care inspiră soluții creative pentru bine.</p>`
  },
  "comunitate-ong-final": {
    key: "comunitate-ong-final",
    title: "Tapet ONG Comunitate — Unitate & Solidaritate",
    shortDescription: "Comunitate, unitate, solidaritate pentru ONG-uri comunitate.",
    seoTitle: "Tapet ONG Comunitate | Decor Prietenos | Prynt",
    seoDescription: "Împreună suntem mai puternici. Tapet pentru centre comunitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Solidaritate comunitară</h2><p>Un decor care unește inimile pentru bine.</p>`
  },
  "viitor-ong-final": {
    key: "viitor-ong-final",
    title: "Tapet ONG Viitor — Viziune & Planificare",
    shortDescription: "Viitor, viziune, planificare pentru ONG-uri viitor.",
    seoTitle: "Tapet ONG Viitor | Decor Inspirational | Prynt",
    seoDescription: "Mâine începe azi. Print pentru centre viitor ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viziune pentru viitor</h2><p>Un decor care planifică un viitor mai bun.</p>`
  },
  "global-ong-final": {
    key: "global-ong-final",
    title: "Tapet ONG Global — Lume & Conexiune",
    shortDescription: "Global, lume, conexiune pentru ONG-uri globale.",
    seoTitle: "Tapet ONG Global | Decor Universal | Prynt",
    seoDescription: "O lume conectată. Tapet pentru centre globale ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Conexiune universală</h2><p>Un decor care unește lumea pentru bine.</p>`
  },
  "sustinabilitate-ong-final": {
    key: "sustinabilitate-ong-final",
    title: "Tapet ONG Sustenabilitate — Planetă & Viitor",
    shortDescription: "Sustenabilitate, planetă, viitor pentru ONG-uri sustenabilitate.",
    seoTitle: "Tapet ONG Sustinabilitate | Decor Verde | Prynt",
    seoDescription: "Salvează planeta împreună. Print pentru centre sustenabilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viitor sustenabil</h2><p>Un decor care inspiră acțiuni pentru planetă.</p>`
  },
  "egalitate-ong-final": {
    key: "egalitate-ong-final",
    title: "Tapet ONG Egalitate — Dreptate & Incluziune",
    shortDescription: "Egalitate, dreptate, incluziune pentru ONG-uri egalitate.",
    seoTitle: "Tapet ONG Egalitate | Decor Empatic | Prynt",
    seoDescription: "Dreptate pentru toți. Tapet pentru centre egalitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Dreptate egală</h2><p>Un decor care promovează incluziunea totală.</p>`
  },
  "diversitate-ong-final": {
    key: "diversitate-ong-final",
    title: "Tapet ONG Diversitate — Culori & Culturi",
    shortDescription: "Diversitate, culori, culturi pentru ONG-uri diversitate.",
    seoTitle: "Tapet ONG Diversitate | Decor Colorat | Prynt",
    seoDescription: "Frumusețea diversității. Print pentru centre diversitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Culori ale lumii</h2><p>Un decor care sărbătorește diversitatea culturală.</p>`
  },
  "responsabilitate-ong-final": {
    key: "responsabilitate-ong-final",
    title: "Tapet ONG Responsabilitate — Acțiune & Impact",
    shortDescription: "Responsabilitate, acțiune, impact pentru ONG-uri responsabilitate.",
    seoTitle: "Tapet ONG Responsabilitate | Decor Inspirational | Prynt",
    seoDescription: "Acțiuni care contează. Tapet pentru centre responsabilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Impact responsabil</h2><p>Un decor care inspiră acțiuni pozitive pentru societate.</p>`
  },
  "parteneriate-ong-final": {
    key: "parteneriate-ong-final",
    title: "Tapet ONG Parteneriate — Colaborare & Rețea",
    shortDescription: "Parteneriate, colaborare, rețea pentru ONG-uri parteneriate.",
    seoTitle: "Tapet ONG Parteneriate | Decor Colaborativ | Prynt",
    seoDescription: "Împreună pentru schimbare. Print pentru centre parteneriate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Rețele puternice</h2><p>Un decor care construiește alianțe pentru bine.</p>`
  },
  "impact-ong-final": {
    key: "impact-ong-final",
    title: "Tapet ONG Impact — Rezultate & Schimbare",
    shortDescription: "Impact, rezultate, schimbare pentru ONG-uri impact.",
    seoTitle: "Tapet ONG Impact | Decor Motivational | Prynt",
    seoDescription: "Schimbarea începe cu tine. Tapet pentru centre impact ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Rezultate măsurabile</h2><p>Un decor care măsoară impactul pozitiv.</p>`
  },
  "vizibilitate-ong-final": {
    key: "vizibilitate-ong-final",
    title: "Tapet ONG Vizibilitate — Voce & Audiență",
    shortDescription: "Vizibilitate, voce, audiență pentru ONG-uri vizibilitate.",
    seoTitle: "Tapet ONG Vizibilitate | Decor Comunicativ | Prynt",
    seoDescription: "Fă-te auzit. Print pentru centre vizibilitate ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Voce puternică</h2><p>Un decor care amplifică mesajul organizației.</p>`
  },
  "finantare-ong-final": {
    key: "finantare-ong-final",
    title: "Tapet ONG Finanțare — Resurse & Sustenabilitate",
    shortDescription: "Finanțare, resurse, sustenabilitate pentru ONG-uri finanțare.",
    seoTitle: "Tapet ONG Finantare | Decor Profesional | Prynt",
    seoDescription: "Resurse pentru bine. Tapet pentru centre finanțare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Sustenabilitate financiară</h2><p>Un decor care atrage sprijin pentru cauze nobile.</p>`
  },
  "voluntari-ong-final": {
    key: "voluntari-ong-final",
    title: "Tapet ONG Voluntari — Dăruire & Energie",
    shortDescription: "Voluntari, dăruire, energie pentru ONG-uri voluntari.",
    seoTitle: "Tapet ONG Voluntari | Decor Inspirational | Prynt",
    seoDescription: "Eroi ai comunității. Print pentru centre voluntari ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Energie voluntară</h2><p>Un decor care celebrează dăruirea pentru bine.</p>`
  },
  "campanii-ong-final": {
    key: "campanii-ong-final",
    title: "Tapet ONG Campanii — Mobilizare & Conștientizare",
    shortDescription: "Campanii, mobilizare, conștientizare pentru ONG-uri campanii.",
    seoTitle: "Tapet ONG Campanii | Decor Motivational | Prynt",
    seoDescription: "Mobilizează pentru cauză. Tapet pentru centre campanii ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Campanii de impact</h2><p>Un decor care trezește conștiința pentru schimbare.</p>`
  },
  "proiecte-ong-final": {
    key: "proiecte-ong-final",
    title: "Tapet ONG Proiecte — Implementare & Succes",
    shortDescription: "Proiecte, implementare, succes pentru ONG-uri proiecte.",
    seoTitle: "Tapet ONG Proiecte | Decor Profesional | Prynt",
    seoDescription: "De la idee la realitate. Print pentru centre proiecte ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Succes în proiecte</h2><p>Un decor care inspiră implementarea cu succes.</p>`
  },
  "evaluare-ong-final": {
    key: "evaluare-ong-final",
    title: "Tapet ONG Evaluare — Măsurare & Îmbunătățire",
    shortDescription: "Evaluare, măsurare, îmbunătățire pentru ONG-uri evaluare.",
    seoTitle: "Tapet ONG Evaluare | Decor Analitic | Prynt",
    seoDescription: "Îmbunătățește impactul. Tapet pentru centre evaluare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Îmbunătățire continuă</h2><p>Un decor care analizează și optimizează rezultatele.</p>`
  },
  "strategie-ong-final": {
    key: "strategie-ong-final",
    title: "Tapet ONG Strategie — Planificare & Viziune",
    shortDescription: "Strategie, planificare, viziune pentru ONG-uri strategie.",
    seoTitle: "Tapet ONG Strategie | Decor Strategic | Prynt",
    seoDescription: "Planifică viitorul. Print pentru centre strategie ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Viziune strategică</h2><p>Un decor care trasează drumul către succes.</p>`
  },
  "leadership-ong-final": {
    key: "leadership-ong-final",
    title: "Tapet ONG Leadership — Conducere & Inspirație",
    shortDescription: "Leadership, conducere, inspirație pentru ONG-uri leadership.",
    seoTitle: "Tapet ONG Leadership | Decor Inspirational | Prynt",
    seoDescription: "Lideri pentru schimbare. Tapet pentru centre leadership ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Leadership inspirant</h2><p>Un decor care cultivă conducerea pentru bine.</p>`
  },
  "comunicare-ong-final": {
    key: "comunicare-ong-final",
    title: "Tapet ONG Comunicare — Mesaj & Conexiune",
    shortDescription: "Comunicare, mesaj, conexiune pentru ONG-uri comunicare.",
    seoTitle: "Tapet ONG Comunicare | Decor Comunicativ | Prynt",
    seoDescription: "Mesaje care ajung. Print pentru centre comunicare ONG.",
    images: ["/products/tapet/1.webp"],
    contentHtml: `<h2>Conexiune eficientă</h2><p>Un decor care facilitează dialogul pentru impact.</p>`
  }
};
