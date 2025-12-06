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
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Dăruiește amintiri, nu doar obiecte</h2><p>Un tablou canvas este mai mult decât un cadou; este o amintire vie pe perete. Perfect pentru zile de naștere, aniversări sau sărbători.</p>`
  },
  "nunta": {
    key: "nunta",
    title: "Tablouri Canvas Nuntă — Amintiri de la Eveniment",
    shortDescription: "Cele mai frumoase poze de la nuntă merită expuse pe pânză de calitate.",
    seoTitle: "Tablou Canvas Nunta | Print Foto Pe Panza | Prynt",
    seoDescription: "Păstrează vie amintirea nunții. Printează fotografia preferată pe canvas de mari dimensiuni.",
    images: ["/products/canvas/canvas-1.webp"], // Poți adăuga o imagine specifică gen /products/canvas/nunta.webp
    contentHtml: `<h2>Ziua nunții pe peretele tău</h2><p>Nu lăsa pozele de la nuntă uitate în calculator. Transformă-le în piese de artă pentru livingul vostru.</p>`
  },
  "botez": {
    key: "botez",
    title: "Tablou Canvas Botez — Amintiri cu Bebe",
    shortDescription: "Tablouri delicate cu bebelușul tău. Decor perfect pentru camera copilului sau cadou pentru nași.",
    seoTitle: "Tablou Canvas Botez & Bebe | Cadouri Nasi | Prynt",
    seoDescription: "Tablouri canvas cu bebeluși. Print ecologic, sigur pentru camera copilului.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Primul zâmbet, imortalizat</h2><p>Fotografiile de la botez sau ședințele foto newborn arată spectaculos pe textura de pânză canvas.</p>`
  },
  "cuplu": {
    key: "cuplu",
    title: "Tablouri Canvas Cuplu — Ziua Îndrăgostiților",
    shortDescription: "Cadou romantic de Valentine's Day sau aniversare. Colaj foto sau portret de cuplu.",
    seoTitle: "Tablou Canvas Cuplu | Cadou Valentines Day | Prynt",
    seoDescription: "Surprinde-ți jumătatea cu un tablou personalizat. Printează povestea voastră de dragoste.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Celebrează iubirea</h2><p>Un gest romantic care va decora casa voastră pentru totdeauna.</p>`
  },

  // --- DECOR HOME & LIVING ---
  "living": {
    key: "living",
    title: "Tablouri Canvas pentru Living Modern",
    shortDescription: "Tablouri de mari dimensiuni (panoramic sau set multicanvas) pentru sufragerie.",
    seoTitle: "Tablouri Living & Sufragerie | Decor Perete | Prynt",
    seoDescription: "Schimbă atmosfera în living cu un tablou statement. Peisaje, abstract sau artă urbană.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Piesa de rezistență din sufragerie</h2><p>Un perete gol este o oportunitate ratată. Alege un canvas panoramic sau un set triptic pentru impact maxim.</p>`
  },
  "dormitor": {
    key: "dormitor",
    title: "Tablouri Canvas Dormitor — Relaxare & Stil",
    shortDescription: "Imagini relaxante, culori calde sau fotografii de familie pentru dormitor.",
    seoTitle: "Tablouri Dormitor | Canvas Relaxant | Prynt",
    seoDescription: "Creează un sanctuar de liniște. Tablouri canvas cu teme naturale sau abstracte pentru dormitor.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Adormi cu zâmbetul pe buze</h2><p>Decorează dormitorul cu imagini care îți aduc liniște și stare de bine.</p>`
  },
  "bucatarie": {
    key: "bucatarie",
    title: "Tablouri Canvas Bucătărie — Coffee & Food",
    shortDescription: "Tablouri cu cafea, condimente, fructe sau citate despre gătit.",
    seoTitle: "Tablouri Bucatarie | Decor Perete Dining | Prynt",
    seoDescription: "Dă viață bucătăriei tale. Tablouri rezistente la aburi (vernisate) cu tematică culinară.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Inspiră-te la gătit</h2><p>Un set de tablouri cu cafea sau ingrediente proaspete completează perfect designul bucătăriei.</p>`
  },
  "camera-copii": {
    key: "camera-copii",
    title: "Tablouri Canvas Cameră Copii",
    shortDescription: "Personaje din desene, animale drăguțe sau numele copilului stilizat.",
    seoTitle: "Tablouri Camera Copii | Decor Perete | Prynt",
    seoDescription: "Decorează camera micuțului. Printuri sigure, culori vii, personaje îndrăgite.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Universul copilăriei</h2><p>Adaugă culoare și veselie în camera copilului cu tablouri educative sau decorative.</p>`
  },

  // --- BUSINESS & BIROU ---
  "birou": {
    key: "birou",
    title: "Tablouri Canvas Birou — Motivaționale & Peisaje",
    shortDescription: "Decorează pereții biroului. Citate motivaționale sau peisaje urbane.",
    seoTitle: "Tablouri Birou & Office | Decor Corporate | Prynt",
    seoDescription: "Crește productivitatea și moralul echipei cu un decor office profesionist.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Un mediu de lucru inspirat</h2><p>Pereții albi sunt plictisitori. Adaugă personalitate spațiului de lucru cu tablouri canvas profesionale.</p>`
  },
  "salon": {
    key: "salon",
    title: "Tablouri Canvas Salon Înfrumusețare",
    shortDescription: "Imagini fashion, beauty, makeup pentru decor salon.",
    seoTitle: "Tablouri Salon Infrumusetare & Spa | Decor | Prynt",
    seoDescription: "Creează o atmosferă chic în salonul tău. Tablouri cu modele, coafuri sau elemente zen.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Stil și eleganță pentru clienții tăi</h2><p>Completează designul interior al salonului cu tablouri care reflectă frumusețea.</p>`
  },
  "cabinet-medical": {
    key: "cabinet-medical",
    title: "Tablouri Canvas Cabinet Medical / Clinica",
    shortDescription: "Imagini liniștitoare, natură sau anatomie stilizată pentru clinici.",
    seoTitle: "Tablouri Cabinet Medical & Sala Asteptare | Prynt",
    seoDescription: "Relaxează pacienții în sala de așteptare cu tablouri canvas cu peisaje naturale.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>O atmosferă primitoare</h2><p>Reduce anxietatea pacienților printr-un decor cald și prietenos.</p>`
  },
  "hotel": {
    key: "hotel",
    title: "Tablouri Canvas Hotel & Pensiune",
    shortDescription: "Decor pereți pentru camere de hotel. Peisaje locale sau artă abstractă.",
    seoTitle: "Tablouri Hotel & Horeca | Decor Camere | Prynt",
    seoDescription: "Soluții de decor pentru hoteluri. Tablouri rezistente, prețuri de volum.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Ospitalitate prin detalii</h2><p>Tablourile sunt detaliul final care transformă o cameră de hotel într-un spațiu 'ca acasă'.</p>`
  },

  // --- STILURI ARTISTICE ---
  "abstract": {
    key: "abstract",
    title: "Tablouri Canvas Abstracte — Artă Modernă",
    shortDescription: "Forme, culori și texturi pentru interioare minimaliste sau moderne.",
    seoTitle: "Tablouri Abstracte | Arta Moderna Pe Canvas | Prynt",
    seoDescription: "Tablouri abstracte care se potrivesc în orice decor modern. Print digital de artă.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Artă modernă accesibilă</h2><p>Nu trebuie să fii colecționar pentru a avea artă în casă. Alege un canvas abstract care te reprezintă.</p>`
  },
  "alb-negru": {
    key: "alb-negru",
    title: "Tablouri Canvas Alb-Negru — Fotografie Artistică",
    shortDescription: "Eleganță atemporală. Portrete, arhitectură sau peisaje B&W.",
    seoTitle: "Tablouri Alb Negru | Fotografie Artistica | Prynt",
    seoDescription: "Decor minimalist și sofisticat. Tablouri alb-negru cu contrast puternic.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Clasic și elegant</h2><p>Fotografia alb-negru adaugă o notă de rafinament și dramatism oricărei încăperi.</p>`
  },
  "colaj": {
    key: "colaj",
    title: "Tablou Canvas Colaj Foto",
    shortDescription: "Mai multe poze pe același tablou. Perfect pentru vacanțe sau primul an al bebelușului.",
    seoTitle: "Tablou Colaj Foto | Multe Poze Pe Un Canvas | Prynt",
    seoDescription: "Nu te poți decide la o singură poză? Fă un colaj foto pe canvas. Design inclus.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Toate amintirile la un loc</h2><p>Ideal pentru a cuprinde momentele cheie dintr-o vacanță sau evoluția copilului într-un singur tablou.</p>`
  },

  // --- CADOURI ȘI EVENIMENTE ---
  "aniversare": {
    key: "aniversare",
    title: "Tablou Canvas Aniversare — Cadou Personalizat",
    shortDescription: "Surprinde cu un tablou canvas pentru ziua de naștere.",
    seoTitle: "Tablou Canvas Aniversare | Cadou Personalizat | Prynt",
    seoDescription: "Cadou unic pentru aniversare. Tablou canvas cu fotografie personalizată.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Celebrează anii</h2><p>Un tablou canvas este cadoul perfect pentru aniversare, păstrând amintirile vii.</p><ul><li>Personalizare completă</li><li>Calitate premium</li><li>Ambalare cadou</li></ul>`
  },
  "ziua-mamei": {
    key: "ziua-mamei",
    title: "Tablou Canvas Ziua Mamei — Cadou Emoțional",
    shortDescription: "Tablou cu mamă și copii sau mesaj special pentru sărbătoare.",
    seoTitle: "Tablou Canvas Ziua Mamei | Cadou Emotiv | Prynt",
    seoDescription: "Surprinde mama cu un tablou canvas personalizat pentru Ziua Mamei.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Iubire eternă</h2><p>Celebrează cea mai importantă femeie din viața ta cu un cadou care rămâne pe perete.</p><ul><li>Mesaje personalizate</li><li>Design elegant</li><li>Livrare rapidă</li></ul>`
  },
  "ziua-tatalui": {
    key: "ziua-tatalui",
    title: "Tablou Canvas Ziua Tatălui — Cadou Masculin",
    shortDescription: "Tablou cu tată și copii sau hobby-uri preferate.",
    seoTitle: "Tablou Canvas Ziua Tatalui | Cadou Barbat | Prynt",
    seoDescription: "Cadou potrivit pentru tată. Tablou canvas cu fotografie personalizată.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Onorează tatăl</h2><p>Un tablou canvas care să amintească de momentele speciale alături de tată.</p><ul><li>Design masculin</li><li>Rezistent și durabil</li><li>Ambalare premium</li></ul>`
  },
  "ziua-copiilor": {
    key: "ziua-copiilor",
    title: "Tablou Canvas Ziua Copiilor — Decor Vesel",
    shortDescription: "Tablouri colorate pentru camera copiilor sau cadou.",
    seoTitle: "Tablou Canvas Ziua Copiilor | Decor Copii | Prynt",
    seoDescription: "Celebrează ziua copiilor cu tablouri canvas vesele și personalizate.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Bucurie pentru copii</h2><p>Tablouri canvas care să aducă zâmbetul pe fața copiilor.</p><ul><li>Culori vii</li><li>Personaje îndrăgite</li><li>Material sigur</li></ul>`
  },
  "valentine": {
    key: "valentine",
    title: "Tablou Canvas Valentine — Cadou Romantic",
    shortDescription: "Tablou cu cuplu sau mesaj de iubire pentru sărbătoare.",
    seoTitle: "Tablou Canvas Valentine | Cadou Romantic | Prynt",
    seoDescription: "Surprinde iubitul cu un tablou canvas romantic pentru Ziua Îndrăgostiților.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Iubire eternă</h2><p>Un cadou care să amintească de dragostea voastră în fiecare zi.</p><ul><li>Design romantic</li><li>Mesaje personalizate</li><li>Calitate superioară</li></ul>`
  },
  "martisor": {
    key: "martisor",
    title: "Tablou Canvas Martisor — Sărbătoare Tradițională",
    shortDescription: "Tablou cu motive tradiționale pentru sărbătoarea primăverii.",
    seoTitle: "Tablou Canvas Martisor | Traditie Romana | Prynt",
    seoDescription: "Celebrează Martisorul cu un tablou canvas inspirat din tradiție.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Primăvara în suflet</h2><p>Tablouri canvas cu motive tradiționale pentru sărbătoarea Martisorului.</p><ul><li>Motive populare</li><li>Culori vii</li><li>Design autentic</li></ul>`
  },
  "paste": {
    key: "paste",
    title: "Tablou Canvas Paște — Sărbătoare Creștină",
    shortDescription: "Tablou cu motive pascale sau familie la masă.",
    seoTitle: "Tablou Canvas Paste | Sarbatoare Crestina | Prynt",
    seoDescription: "Decorează pentru Paște cu tablouri canvas inspirate din tradiție.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Bucuria Învierii</h2><p>Tablouri canvas care să aducă pace și sărbătoare în casă.</p><ul><li>Motive religioase</li><li>Design elegant</li><li>Material premium</li></ul>`
  },
  "craciun": {
    key: "craciun",
    title: "Tablou Canvas Crăciun — Decor Festiv",
    shortDescription: "Tablou cu brad, familie sau motive de iarnă.",
    seoTitle: "Tablou Canvas Craciun | Decor Festiv | Prynt",
    seoDescription: "Decorează pentru Crăciun cu tablouri canvas sărbătorești.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Sărbătoare magică</h2><p>Tablouri canvas care să aducă spiritul Crăciunului în casă.</p><ul><li>Motive festive</li><li>Culori calde</li><li>Ambalare cadou</li></ul>`
  },
  "revelion": {
    key: "revelion",
    title: "Tablou Canvas Revelion — An Nou Fericit",
    shortDescription: "Tablou cu artificii sau mesaj de An Nou.",
    seoTitle: "Tablou Canvas Revelion | An Nou Fericit | Prynt",
    seoDescription: "Începe anul nou cu un tablou canvas motivant.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>An nou, începuturi noi</h2><p>Tablouri canvas care să celebreze trecerea în noul an.</p><ul><li>Mesaje pozitive</li><li>Design modern</li><li>Rezistent la vreme</li></ul>`
  },

  // --- DECOR ACASĂ ȘI INTERIOR ---
  "hol": {
    key: "hol",
    title: "Tablouri Canvas Hol — Primul Impresii",
    shortDescription: "Tablouri pentru holul de la intrare. Bun venit acasă.",
    seoTitle: "Tablouri Canvas Hol | Decor Intrare | Prynt",
    seoDescription: "Creează o primă impresie bună cu tablouri canvas în hol.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Bun venit acasă</h2><p>Tablouri canvas care să întâmpine oaspeții cu stil.</p><ul><li>Design primitor</li><li>Vizibilitate imediată</li><li>Material durabil</li></ul>`
  },
  "baie": {
    key: "baie",
    title: "Tablouri Canvas Baie — Relaxare",
    shortDescription: "Tablouri rezistente la umiditate pentru baie.",
    seoTitle: "Tablouri Canvas Baie | Decor Rezistent | Prynt",
    seoDescription: "Decorează baia cu tablouri canvas rezistente la apă.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Oază de relaxare</h2><p>Tablouri canvas care să transforme baia într-un spațiu de liniște.</p><ul><li>Rezistent la umiditate</li><li>Design calm</li><li>Întreținere ușoară</li></ul>`
  },
  "balcon": {
    key: "balcon",
    title: "Tablouri Canvas Balcon — Spațiu Exterior",
    shortDescription: "Tablouri pentru balcon sau terasă, rezistente la vreme.",
    seoTitle: "Tablouri Canvas Balcon | Decor Exterior | Prynt",
    seoDescription: "Decorează balconul cu tablouri canvas rezistente la intemperii.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Natură și artă</h2><p>Tablouri canvas care să completeze spațiul exterior.</p><ul><li>Rezistent la vreme</li><li>Design natural</li><li>Montare ușoară</li></ul>`
  },
  "gradina": {
    key: "gradina",
    title: "Tablouri Canvas Grădină — Spațiu Verde",
    shortDescription: "Tablouri pentru decor grădină sau verandă.",
    seoTitle: "Tablouri Canvas Gradina | Decor Exterior | Prynt",
    seoDescription: "Adaugă artă în grădină cu tablouri canvas rezistente.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Armonie cu natura</h2><p>Tablouri canvas care să se integreze perfect în spațiul verde.</p><ul><li>Rezistent la umezeală</li><li>Teme naturale</li><li>Design relaxant</li></ul>`
  },

  // --- AFACERI ȘI DECOR CORPORATIV ---
  "restaurant": {
    key: "restaurant",
    title: "Tablouri Canvas Restaurant — Atmosferă Culinară",
    shortDescription: "Tablouri cu mâncare, vin sau atmosferă pentru restaurante.",
    seoTitle: "Tablouri Canvas Restaurant | Decor Horeca | Prynt",
    seoDescription: "Creează atmosferă în restaurant cu tablouri canvas tematice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Experiență culinară completă</h2><p>Tablouri canvas care să completeze experiența dining-ului.</p><ul><li>Tematică culinară</li><li>Rezistent la mirosuri</li><li>Design elegant</li></ul>`
  },
  "cafenea": {
    key: "cafenea",
    title: "Tablouri Canvas Cafenea — Relaxare",
    shortDescription: "Tablouri pentru cafenele cu teme de cafea sau lectură.",
    seoTitle: "Tablouri Canvas Cafenea | Decor Relaxant | Prynt",
    seoDescription: "Decorează cafeneaua cu tablouri canvas care să invite la relaxare.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>O ceașcă de liniște</h2><p>Tablouri canvas care să creeze o atmosferă primitoare în cafenea.</p><ul><li>Teme relaxante</li><li>Rezistent la cafea</li><li>Montare discretă</li></ul>`
  },
  "bar": {
    key: "bar",
    title: "Tablouri Canvas Bar — Atmosferă Veselă",
    shortDescription: "Tablouri pentru baruri cu teme distractive.",
    seoTitle: "Tablouri Canvas Bar | Decor Vesel | Prynt",
    seoDescription: "Adaugă personalitate barului cu tablouri canvas tematice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Petrecere garantată</h2><p>Tablouri canvas care să contribuie la atmosfera distractivă.</p><ul><li>Design vibrant</li><li>Rezistent la zgomot</li><li>Impact vizual</li></ul>`
  },
  "receptie-hotel": {
    key: "receptie-hotel",
    title: "Tablouri Canvas Recepție Hotel — Bun Venit",
    shortDescription: "Tablouri pentru recepția hotelurilor.",
    seoTitle: "Tablouri Canvas Receptie Hotel | Decor Primitor | Prynt",
    seoDescription: "Întâmpină oaspeții cu tablouri canvas elegante în recepție.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Primul contact</h2><p>Tablouri canvas care să creeze o impresie pozitivă de la început.</p><ul><li>Design profesional</li><li>Vizibilitate imediată</li><li>Material premium</li></ul>`
  },
  "camera-hotel": {
    key: "camera-hotel",
    title: "Tablouri Canvas Cameră Hotel — Confort",
    shortDescription: "Tablouri pentru camerele de hotel.",
    seoTitle: "Tablouri Canvas Camera Hotel | Decor Confortabil | Prynt",
    seoDescription: "Adaugă confort camerelor de hotel cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Casă departe de casă</h2><p>Tablouri canvas care să facă camera să pară mai primitoare.</p><ul><li>Teme relaxante</li><li>Design neutru</li><li>Întreținere ușoară</li></ul>`
  },
  "spital": {
    key: "spital",
    title: "Tablouri Canvas Spital — Liniște și Încredere",
    shortDescription: "Tablouri liniștitoare pentru spitale.",
    seoTitle: "Tablouri Canvas Spital | Decor Medical | Prynt",
    seoDescription: "Creează o atmosferă calmă în spitale cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Îngrijire cu empatie</h2><p>Tablouri canvas care să aducă liniște pacienților.</p><ul><li>Teme calmante</li><li>Material igienic</li><li>Design subtil</li></ul>`
  },
  "scoala": {
    key: "scoala",
    title: "Tablouri Canvas Școală — Inspirație",
    shortDescription: "Tablouri motivaționale pentru școli.",
    seoTitle: "Tablouri Canvas Scoala | Decor Educational | Prynt",
    seoDescription: "Inspiră elevii cu tablouri canvas în școală.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Învățare cu pasiune</h2><p>Tablouri canvas care să motiveze și să inspire elevii.</p><ul><li>Mesaje educaționale</li><li>Design colorat</li><li>Rezistent la uzură</li></ul>`
  },
  "universitate": {
    key: "universitate",
    title: "Tablouri Canvas Universitate — Cunoaștere",
    shortDescription: "Tablouri pentru universități cu teme academice.",
    seoTitle: "Tablouri Canvas Universitate | Decor Academic | Prynt",
    seoDescription: "Adaugă prestanță universității cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Templul cunoașterii</h2><p>Tablouri canvas care să reflecte excelența academică.</p><ul><li>Teme intelectuale</li><li>Design sofisticat</li><li>Impact inspirațional</li></ul>`
  },

  // --- TEME ARTISTICE ȘI STILURI ---
  "peisaj": {
    key: "peisaj",
    title: "Tablouri Canvas Peisaj — Natură și Liniște",
    shortDescription: "Peisaje naturale pentru decor relaxant.",
    seoTitle: "Tablouri Canvas Peisaj | Natura Pe Perete | Prynt",
    seoDescription: "Adu natura în casă cu tablouri canvas peisagistice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Liniștea naturii</h2><p>Tablouri canvas cu peisaje care să aducă pace interioară.</p><ul><li>Teme naturale</li><li>Culori calmante</li><li>Design realist</li></ul>`
  },
  "oras": {
    key: "oras",
    title: "Tablouri Canvas Oraș — Viață Urbană",
    shortDescription: "Fotografii cu orașe sau arhitectură urbană.",
    seoTitle: "Tablouri Canvas Oras | Arhitectura Urbana | Prynt",
    seoDescription: "Decorează cu tablouri canvas inspirate din viața orașului.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Energia orașului</h2><p>Tablouri canvas care să captureze vibrația urbană.</p><ul><li>Teme metropolitane</li><li>Design dinamic</li><li>Impact modern</li></ul>`
  },
  "animale": {
    key: "animale",
    title: "Tablouri Canvas Animale — Prieteni Păroși",
    shortDescription: "Tablouri cu animale de companie sau sălbatice.",
    seoTitle: "Tablouri Canvas Animale | Prieteni Patrupede | Prynt",
    seoDescription: "Celebrează animalele cu tablouri canvas drăguțe.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Iubire pentru animale</h2><p>Tablouri canvas care să aducă bucurie și afecțiune.</p><ul><li>Teme animaliere</li><li>Design adorabil</li><li>Material sigur</li></ul>`
  },
  "flori": {
    key: "flori",
    title: "Tablouri Canvas Flori — Frumusețe Naturală",
    shortDescription: "Aranjamente florale sau câmpuri de flori.",
    seoTitle: "Tablouri Canvas Flori | Aranjamente Florale | Prynt",
    seoDescription: "Adaugă culoare casei cu tablouri canvas cu flori.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Frumusețe efemeră</h2><p>Tablouri canvas care să eternizeze frumusețea florilor.</p><ul><li>Teme florale</li><li>Culori vii</li><li>Design romantic</li></ul>`
  },
  "mare": {
    key: "mare",
    title: "Tablouri Canvas Mare — Relaxare Acvatică",
    shortDescription: "Peisaje marine sau plaje pentru decor.",
    seoTitle: "Tablouri Canvas Mare | Relaxare Acvatica | Prynt",
    seoDescription: "Adu marea acasă cu tablouri canvas cu teme acvatice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Liniștea oceanului</h2><p>Tablouri canvas care să evoce vacanțe și relaxare.</p><ul><li>Teme marine</li><li>Culori albastre</li><li>Design calm</li></ul>`
  },
  "munte": {
    key: "munte",
    title: "Tablouri Canvas Munte — Aventură",
    shortDescription: "Peisaje montane pentru iubitorii de natură.",
    seoTitle: "Tablouri Canvas Munte | Aventura Montana | Prynt",
    seoDescription: "Explorează munții cu tablouri canvas peisagistice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Înălțimi mărețe</h2><p>Tablouri canvas care să inspire aventuri montane.</p><ul><li>Teme alpine</li><li>Design puternic</li><li>Impact inspirațional</li></ul>`
  },
  "minimalist": {
    key: "minimalist",
    title: "Tablouri Canvas Minimaliste — Simplitate",
    shortDescription: "Design simplu, linii curate pentru interioare moderne.",
    seoTitle: "Tablouri Canvas Minimaliste | Design Simplu | Prynt",
    seoDescription: "Decorează minimalist cu tablouri canvas subtile.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Less is more</h2><p>Tablouri canvas care să aducă eleganță prin simplitate.</p><ul><li>Design curat</li><li>Culori neutre</li><li>Impact subtil</li></ul>`
  },
  "pop-art": {
    key: "pop-art",
    title: "Tablouri Canvas Pop Art — Culori Vibrante",
    shortDescription: "Stil pop art cu culori puternice și forme îndrăznețe.",
    seoTitle: "Tablouri Canvas Pop Art | Arta Moderna | Prynt",
    seoDescription: "Adaugă energie casei cu tablouri canvas pop art.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Artă vibrantă</h2><p>Tablouri canvas care să aducă culoare și personalitate.</p><ul><li>Culori puternice</li><li>Design îndrăzneț</li><li>Impact vizual</li></ul>`
  },
  "retro": {
    key: "retro",
    title: "Tablouri Canvas Retro — Nostalgie",
    shortDescription: "Design retro cu elemente din trecut.",
    seoTitle: "Tablouri Canvas Retro | Nostalgie | Prynt",
    seoDescription: "Revino în timp cu tablouri canvas retro.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Revenire în timp</h2><p>Tablouri canvas care să evoce amintiri din trecut.</p><ul><li>Teme vintage</li><li>Culori retro</li><li>Design nostalgic</li></ul>`
  },
  "fantasy": {
    key: "fantasy",
    title: "Tablouri Canvas Fantasy — Lumi Imaginare",
    shortDescription: "Tablouri cu teme fantastice sau science fiction.",
    seoTitle: "Tablouri Canvas Fantasy | Lumi Imaginare | Prynt",
    seoDescription: "Scapă în lumi fantastice cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Imaginație fără limite</h2><p>Tablouri canvas care să inspire creativitatea.</p><ul><li>Teme fantastice</li><li>Design creativ</li><li>Impact inspirațional</li></ul>`
  },

  // --- SPORT ȘI ACTIVITĂȚI ---
  "fotbal": {
    key: "fotbal",
    title: "Tablouri Canvas Fotbal — Pasiune Sportivă",
    shortDescription: "Tablouri cu meciuri sau jucători de fotbal.",
    seoTitle: "Tablouri Canvas Fotbal | Pasiune Sportiva | Prynt",
    seoDescription: "Celebrează fotbalul cu tablouri canvas tematice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Goluri și echipă</h2><p>Tablouri canvas pentru fanii fotbalului.</p><ul><li>Teme sportive</li><li>Design dinamic</li><li>Impact motivațional</li></ul>`
  },
  "tenis": {
    key: "tenis",
    title: "Tablouri Canvas Tenis — Precizie și Stil",
    shortDescription: "Tablouri cu teme de tenis pentru decor.",
    seoTitle: "Tablouri Canvas Tenis | Sport Elegant | Prynt",
    seoDescription: "Adaugă stil casei cu tablouri canvas de tenis.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Jocul eleganței</h2><p>Tablouri canvas care să celebreze tenisul.</p><ul><li>Teme atletice</li><li>Design sofisticat</li><li>Rezistent la vreme</li></ul>`
  },
  "baschet": {
    key: "baschet",
    title: "Tablouri Canvas Baschet — Energie",
    shortDescription: "Tablouri cu coșuri și jucători de baschet.",
    seoTitle: "Tablouri Canvas Baschet | Sport Dinamic | Prynt",
    seoDescription: "Inspiră cu tablouri canvas de baschet.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Coșuri și victorie</h2><p>Tablouri canvas pentru iubitorii de baschet.</p><ul><li>Design energetic</li><li>Culori vii</li><li>Impact motivațional</li></ul>`
  },
  "fitness": {
    key: "fitness",
    title: "Tablouri Canvas Fitness — Sănătate",
    shortDescription: "Tablouri motivaționale pentru sala de sport acasă.",
    seoTitle: "Tablouri Canvas Fitness | Sanatate si Miscare | Prynt",
    seoDescription: "Motivează-te cu tablouri canvas fitness.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Mișcare și vitalitate</h2><p>Tablouri canvas care să inspire fitness-ul.</p><ul><li>Mesaje motivaționale</li><li>Design puternic</li><li>Rezistent la transpirație</li></ul>`
  },
  "yoga": {
    key: "yoga",
    title: "Tablouri Canvas Yoga — Echilibru",
    shortDescription: "Tablouri relaxante pentru practicanții de yoga.",
    seoTitle: "Tablouri Canvas Yoga | Echilibru Spiritual | Prynt",
    seoDescription: "Adaugă pace casei cu tablouri canvas yoga.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Pace interioară</h2><p>Tablouri canvas pentru meditație și relaxare.</p><ul><li>Teme calmante</li><li>Culori relaxante</li><li>Design subtil</li></ul>`
  },

  // --- MUZICĂ ȘI ARTĂ ---
  "jazz": {
    key: "jazz",
    title: "Tablouri Canvas Jazz — Ritm Liber",
    shortDescription: "Tablouri inspirate din muzica jazz.",
    seoTitle: "Tablouri Canvas Jazz | Muzica Improvizata | Prynt",
    seoDescription: "Celebrează jazz-ul cu tablouri canvas artistice.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Ritmuri libere</h2><p>Tablouri canvas care să evoce muzica jazz.</p><ul><li>Teme muzicale</li><li>Design abstract</li><li>Impact artistic</li></ul>`
  },
  "rock": {
    key: "rock",
    title: "Tablouri Canvas Rock — Rebeliune",
    shortDescription: "Tablouri cu teme rock pentru decor energetic.",
    seoTitle: "Tablouri Canvas Rock | Muzica Rebelă | Prynt",
    seoDescription: "Adaugă energie cu tablouri canvas rock.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Energie și pasiune</h2><p>Tablouri canvas pentru fanii rock-ului.</p><ul><li>Design puternic</li><li>Culori intense</li><li>Impact vibrant</li></ul>`
  },
  "pop": {
    key: "pop",
    title: "Tablouri Canvas Pop — Muzică Populară",
    shortDescription: "Tablouri cu teme pop pentru decor modern.",
    seoTitle: "Tablouri Canvas Pop | Muzica Populara | Prynt",
    seoDescription: "Decorează cu tablouri canvas pop.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Melodii catchy</h2><p>Tablouri canvas inspirate din muzica pop.</p><ul><li>Teme moderne</li><li>Culori vii</li><li>Design distractiv</li></ul>`
  },
  "folk": {
    key: "folk",
    title: "Tablouri Canvas Folk — Tradiție",
    shortDescription: "Tablouri cu motive tradiționale românești.",
    seoTitle: "Tablouri Canvas Folk | Traditie Romana | Prynt",
    seoDescription: "Celebrează folclorul cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Rădăcini culturale</h2><p>Tablouri canvas cu motive populare.</p><ul><li>Teme tradiționale</li><li>Culori autentice</li><li>Design cultural</li></ul>`
  },
  "opera": {
    key: "opera",
    title: "Tablouri Canvas Operă — Măreție",
    shortDescription: "Tablouri inspirate din lumea operei.",
    seoTitle: "Tablouri Canvas Opera | Arta Lirica | Prynt",
    seoDescription: "Adaugă dramă casei cu tablouri canvas operă.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Emoție și măreție</h2><p>Tablouri canvas pentru iubitorii de operă.</p><ul><li>Teme dramatice</li><li>Design sofisticat</li><li>Impact artistic</li></ul>`
  },
  "balet": {
    key: "balet",
    title: "Tablouri Canvas Balet — Grație",
    shortDescription: "Tablouri cu dansatori de balet.",
    seoTitle: "Tablouri Canvas Balet | Dans Artistic | Prynt",
    seoDescription: "Celebrează baletul cu tablouri canvas elegante.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Grație și frumusețe</h2><p>Tablouri canvas inspirate din balet.</p><ul><li>Teme dansante</li><li>Design fluid</li><li>Impact elegant</li></ul>`
  },

  // --- SĂNĂTATE ȘI BINESTARE ---
  "meditatie": {
    key: "meditatie",
    title: "Tablouri Canvas Meditație — Pace Interioară",
    shortDescription: "Tablouri relaxante pentru meditație.",
    seoTitle: "Tablouri Canvas Meditatie | Pace Spirituala | Prynt",
    seoDescription: "Creează spațiu de meditație cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Liniște și echilibru</h2><p>Tablouri canvas care să ajute la relaxare.</p><ul><li>Teme calmante</li><li>Culori relaxante</li><li>Design subtil</li></ul>`
  },
  "sanatate": {
    key: "sanatate",
    title: "Tablouri Canvas Sănătate — Vitalitate",
    shortDescription: "Tablouri motivaționale pentru sănătate.",
    seoTitle: "Tablouri Canvas Sanatate | Vitalitate | Prynt",
    seoDescription: "Inspiră sănătatea cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Viață sănătoasă</h2><p>Tablouri canvas care să promoveze binele.</p><ul><li>Mesaje pozitive</li><li>Design energizant</li><li>Impact motivațional</li></ul>`
  },

  // --- NATURĂ ȘI MEDIU ---
  "ecologie": {
    key: "ecologie",
    title: "Tablouri Canvas Ecologie — Protecția Naturii",
    shortDescription: "Tablouri cu teme ecologice pentru decor.",
    seoTitle: "Tablouri Canvas Ecologie | Protectia Mediului | Prynt",
    seoDescription: "Promovează ecologia cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Pământul nostru</h2><p>Tablouri canvas care să sensibilizeze privind mediul.</p><ul><li>Teme verzi</li><li>Culori naturale</li><li>Design conștient</li></ul>`
  },
  "padure": {
    key: "padure",
    title: "Tablouri Canvas Pădure — Liniște Forestieră",
    shortDescription: "Peisaje forestiere pentru decor relaxant.",
    seoTitle: "Tablouri Canvas Padure | Natura Salbatica | Prynt",
    seoDescription: "Adu pădurea acasă cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Liniștea pădurii</h2><p>Tablouri canvas cu peisaje forestiere.</p><ul><li>Teme naturale</li><li>Culori verzi</li><li>Design calm</li></ul>`
  },

  // --- TEHNOLOGIE ȘI INOVARE ---
  "tech": {
    key: "tech",
    title: "Tablouri Canvas Tech — Inovație",
    shortDescription: "Tablouri cu teme digitale și futuriste.",
    seoTitle: "Tablouri Canvas Tech | Inovatie Digitala | Prynt",
    seoDescription: "Decorează modern cu tablouri canvas tech.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Viitorul digital</h2><p>Tablouri canvas inspirate din tehnologie.</p><ul><li>Teme futuriste</li><li>Design modern</li><li>Impact inovator</li></ul>`
  },
  "spatiu": {
    key: "spatiu",
    title: "Tablouri Canvas Spațiu — Explorare",
    shortDescription: "Tablouri cu stele, planete și univers.",
    seoTitle: "Tablouri Canvas Spatiu | Explorare Cosmica | Prynt",
    seoDescription: "Explorează universul cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Mistere cosmice</h2><p>Tablouri canvas care să inspire curiozitatea.</p><ul><li>Teme astronomice</li><li>Culori cosmice</li><li>Design inspirațional</li></ul>`
  },

  // --- ALTE TEME ---
  "motivatii": {
    key: "motivatii",
    title: "Tablouri Canvas Motivații — Inspirație",
    shortDescription: "Citate motivaționale pe canvas.",
    seoTitle: "Tablouri Canvas Motivatii | Citat Inspirational | Prynt",
    seoDescription: "Inspiră-te zilnic cu tablouri canvas motivaționale.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Putere interioară</h2><p>Tablouri canvas cu mesaje pozitive.</p><ul><li>Citate celebre</li><li>Design elegant</li><li>Impact motivațional</li></ul>`
  },
  "familie": {
    key: "familie",
    title: "Tablouri Canvas Familie — Legături",
    shortDescription: "Tablouri cu fotografii de familie.",
    seoTitle: "Tablouri Canvas Familie | Amintiri Dragute | Prynt",
    seoDescription: "Păstrează amintirile de familie pe perete.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Legături de sânge</h2><p>Tablouri canvas care să celebreze familia.</p><ul><li>Fotografii personale</li><li>Design emoțional</li><li>Calitate premium</li></ul>`
  },
  "prieteni": {
    key: "prieteni",
    title: "Tablouri Canvas Prieteni — Prietenie",
    shortDescription: "Tablouri cu amintiri din prietenie.",
    seoTitle: "Tablouri Canvas Prieteni | Legaturi Sociale | Prynt",
    seoDescription: "Celebrează prietenia cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Prieteni pentru totdeauna</h2><p>Tablouri canvas cu amintiri de prietenie.</p><ul><li>Momente speciale</li><li>Design distractiv</li><li>Impact social</li></ul>`
  },
  "calatorii": {
    key: "calatorii",
    title: "Tablouri Canvas Călătorii — Aventură",
    shortDescription: "Tablouri cu destinații de călătorie.",
    seoTitle: "Tablouri Canvas Calatorii | Aventura Globala | Prynt",
    seoDescription: "Revino în vacanțe cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Lumea e a ta</h2><p>Tablouri canvas care să amintească de călătorii.</p><ul><li>Destinații exotice</li><li>Design aventuros</li><li>Impact inspirațional</li></ul>`
  },
  "culori": {
    key: "culori",
    title: "Tablouri Canvas Culori — Vibrație",
    shortDescription: "Tablouri abstracte cu culori vibrante.",
    seoTitle: "Tablouri Canvas Culori | Arta Abstracta | Prynt",
    seoDescription: "Adaugă culoare vieții cu tablouri canvas.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Explozia de culori</h2><p>Tablouri canvas care să aducă bucurie vizuală.</p><ul><li>Culori vii</li><li>Design abstract</li><li>Impact energetic</li></ul>`
  },
  "lumini": {
    key: "lumini",
    title: "Tablouri Canvas Lumini — Magie",
    shortDescription: "Tablouri cu efecte de lumină și strălucire.",
    seoTitle: "Tablouri Canvas Lumini | Efecte Magice | Prynt",
    seoDescription: "Creează magie cu tablouri canvas luminoase.",
    images: ["/products/canvas/canvas-1.webp"],
    contentHtml: `<h2>Strălucire eternă</h2><p>Tablouri canvas care să lumineze camera.</p><ul><li>Efecte de lumină</li><li>Design magic</li><li>Impact vizual</li></ul>`
  }
};