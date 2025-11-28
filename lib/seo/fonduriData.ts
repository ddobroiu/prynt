// lib/seo/fonduriData.ts
import type { LandingInfo } from "../landingData";

export const FONDURI_DATA: Record<string, LandingInfo> = {
  // --- PNRR (Planul Național de Redresare și Reziliență) ---
  "pnrr": {
    key: "pnrr",
    title: "Kit Vizibilitate PNRR — Plăci & Autocolante",
    shortDescription: "Materiale obligatorii pentru proiecte PNRR: plăci permanente, autocolante, comunicate.",
    seoTitle: "Kit Vizibilitate PNRR | Placi si Autocolante | Prynt",
    seoDescription: "Comandă online kitul complet de vizibilitate PNRR. Respectă manualul de identitate vizuală (MIV). Livrare rapidă.",
    images: ["/products/banner/produs-in-romania.webp"], // Poți folosi o imagine generică sau specifică dacă ai
    contentHtml: `<h2>Vizibilitate obligatorie pentru proiectele PNRR</h2><p>Beneficiarii PNRR au obligația de a asigura vizibilitatea fondurilor primite. Oferim pachete complete care respectă strict noile reglementări grafice.</p>`
  },
  "digitalizare-imm": {
    key: "digitalizare-imm",
    title: "Kit PNRR Digitalizare IMM",
    shortDescription: "Autocolante pentru echipamente IT și placă A3 pentru sediu.",
    seoTitle: "Vizibilitate PNRR Digitalizare IMM | Autocolante Laptop | Prynt",
    seoDescription: "Kit specific pentru programul Digitalizare IMM. Stickere pentru laptopuri/PC și placă permanentă.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Etichetează echipamentele achiziționate</h2><p>Pentru programul de digitalizare, este esențial să aplici autocolantele specifice PNRR pe fiecare echipament (laptop, server, imprimantă) cumpărat.</p>`
  },
  "placa-permanenta-pnrr": {
    key: "placa-permanenta-pnrr",
    title: "Placă Permanentă PNRR (După Finalizare)",
    shortDescription: "Placă rigidă 30x20cm sau 50x30cm pentru afișare permanentă la locație.",
    seoTitle: "Placa Permanenta PNRR | Panou Vizibilitate | Prynt",
    seoDescription: "Placă permanentă PNRR din material rigid (Forex sau Bond). Rezistentă la exterior, conformă MIV.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Semnalizare pe termen lung</h2><p>La finalizarea proiectului, panoul temporar trebuie înlocuit cu o placă permanentă care să ateste finanțarea.</p>`
  },

  // --- FONDURI NAȚIONALE (Start-Up Nation, Femeia Antreprenor) ---
  "start-up-nation": {
    key: "start-up-nation",
    title: "Kit Vizibilitate Start-Up Nation",
    shortDescription: "Placă informativă A4/A3 pentru beneficiarii Start-Up Nation.",
    seoTitle: "Placa Start-Up Nation | Kit Vizibilitate | Prynt",
    seoDescription: "Plăci și autocolante pentru Start-Up Nation. Respectă cerințele programului național. Comandă online.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Nu risca eligibilitatea cheltuielilor</h2><p>Asigură-te că afișezi corect elementele de identitate vizuală Start-Up Nation la locația implementării.</p>`
  },
  "femeia-antreprenor": {
    key: "femeia-antreprenor",
    title: "Kit Femeia Antreprenor — Vizibilitate",
    shortDescription: "Materiale de vizibilitate pentru programul Femeia Antreprenor.",
    seoTitle: "Placa Femeia Antreprenor | Vizibilitate Proiect | Prynt",
    seoDescription: "Panouri și plăci pentru proiecte Femeia Antreprenor. Livrare rapidă și factură pentru decont.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Vizibilitate proiecte naționale</h2><p>Pachetul conține placa informativă obligatorie și autocolante pentru mijloacele fixe achiziționate.</p>`
  },

  // --- FONDURI REGIO (POR) ---
  "regio": {
    key: "regio",
    title: "Panouri Temporare REGIO (POR)",
    shortDescription: "Panouri de șantier sau temporare pentru proiecte finanțate prin POR.",
    seoTitle: "Panou Temporar Regio | POR Vizibilitate | Prynt",
    seoDescription: "Panouri temporare pentru proiecte de infrastructură sau construcții finanțate prin Regio.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Semnalizare șantier Regio</h2><p>Panouri de dimensiuni mari (2x3m, 3x2m) pentru proiecte de investiții. Material rezistent la exterior (Banner sau Bond).</p>`
  },
  "panou-temporar": {
    key: "panou-temporar",
    title: "Panou Temporar Investiție",
    shortDescription: "Panou de șantier pentru perioada de implementare a proiectului.",
    seoTitle: "Panou Temporar Investitie | Fonduri Europene | Prynt",
    seoDescription: "Panou obligatoriu pe durata lucrărilor. Print UV rezistent pe material rigid sau banner.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Afișare pe durata lucrărilor</h2><p>Semnalizează șantierul conform regulilor de vizibilitate ale programului de finanțare.</p>`
  },

  // --- PNRR SUPLIMENTARE ---
  "pnrr-sanatate": {
    key: "pnrr-sanatate",
    title: "Kit Vizibilitate PNRR Sănătate",
    shortDescription: "Materiale pentru proiecte PNRR în domeniul sănătății.",
    seoTitle: "Kit PNRR Sanatate | Vizibilitate Proiecte Medicale | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR sănătate. Respectă MIV.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Vizibilitate în spitale și clinici</h2><p>Asigură vizibilitatea fondurilor PNRR în proiectele de sănătate cu materiale conforme.</p><ul><li>Plăci permanente</li><li>Autocolante echipamente</li><li>Respectare reglementări</li></ul>`
  },
  "pnrr-educatie": {
    key: "pnrr-educatie",
    title: "Kit Vizibilitate PNRR Educație",
    shortDescription: "Materiale pentru proiecte PNRR în școli și universități.",
    seoTitle: "Kit PNRR Educatie | Vizibilitate Scolara | Prynt",
    seoDescription: "Plăci și panouri pentru proiecte PNRR educație. Livrare rapidă.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Educație finanțată european</h2><p>Promovează proiectele PNRR în educație cu materiale de vizibilitate obligatorii.</p><ul><li>Panouri școlare</li><li>Autocolante echipamente</li><li>Conformitate MIV</li></ul>`
  },
  "pnrr-transport": {
    key: "pnrr-transport",
    title: "Kit Vizibilitate PNRR Transport",
    shortDescription: "Materiale pentru proiecte PNRR în transporturi.",
    seoTitle: "Kit PNRR Transport | Vizibilitate Infrastructura | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR transport. Rezistente la vreme.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Infrastructură modernă</h2><p>Asigură vizibilitatea fondurilor PNRR în proiectele de transport cu materiale durabile.</p><ul><li>Panouri mari</li><li>Autocolante vehicule</li><li>Rezistente la exterior</li></ul>`
  },
  "pnrr-agricultura": {
    key: "pnrr-agricultura",
    title: "Kit Vizibilitate PNRR Agricultură",
    shortDescription: "Materiale pentru proiecte PNRR agricole.",
    seoTitle: "Kit PNRR Agricultura | Vizibilitate Fermieri | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR agricultură. Conforme cu regulile.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Dezvoltare rurală</h2><p>Promovează proiectele PNRR în agricultură cu materiale de vizibilitate esențiale.</p><ul><li>Plăci ferme</li><li>Autocolante utilaje</li><li>Rezistente la intemperii</li></ul>`
  },
  "pnrr-energie": {
    key: "pnrr-energie",
    title: "Kit Vizibilitate PNRR Energie",
    shortDescription: "Materiale pentru proiecte PNRR în energie regenerabilă.",
    seoTitle: "Kit PNRR Energie | Vizibilitate Verda | Prynt",
    seoDescription: "Plăci și panouri pentru proiecte PNRR energie. Materiale ecologice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Energie sustenabilă</h2><p>Asigură vizibilitatea fondurilor PNRR în proiectele de energie cu materiale conforme.</p><ul><li>Panouri solare</li><li>Autocolante echipamente</li><li>Design ecologic</li></ul>`
  },
  "pnrr-turism": {
    key: "pnrr-turism",
    title: "Kit Vizibilitate PNRR Turism",
    shortDescription: "Materiale pentru proiecte PNRR turistice.",
    seoTitle: "Kit PNRR Turism | Vizibilitate Hoteluri | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR turism. Atractive vizual.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Turism european</h2><p>Promovează proiectele PNRR în turism cu materiale de vizibilitate elegante.</p><ul><li>Plăci hoteluri</li><li>Panouri turistice</li><li>Design atractiv</li></ul>`
  },
  "pnrr-digital": {
    key: "pnrr-digital",
    title: "Kit Vizibilitate PNRR Digitalizare",
    shortDescription: "Materiale pentru proiecte PNRR de digitalizare.",
    seoTitle: "Kit PNRR Digital | Vizibilitate Tehnologie | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR digitalizare. Moderne.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Transformare digitală</h2><p>Asigură vizibilitatea fondurilor PNRR în proiectele digitale cu materiale inovatoare.</p><ul><li>Autocolante IT</li><li>Plăci birouri</li><li>Design tech</li></ul>`
  },
  "pnrr-mediu": {
    key: "pnrr-mediu",
    title: "Kit Vizibilitate PNRR Mediu",
    shortDescription: "Materiale pentru proiecte PNRR de mediu.",
    seoTitle: "Kit PNRR Mediu | Vizibilitate Ecologica | Prynt",
    seoDescription: "Plăci și panouri pentru proiecte PNRR mediu. Materiale sustenabile.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Protecția mediului</h2><p>Promovează proiectele PNRR de mediu cu materiale de vizibilitate ecologice.</p><ul><li>Panouri verzi</li><li>Autocolante sustenabile</li><li>Rezistente la vreme</li></ul>`
  },
  "pnrr-cultură": {
    key: "pnrr-cultură",
    title: "Kit Vizibilitate PNRR Cultură",
    shortDescription: "Materiale pentru proiecte PNRR culturale.",
    seoTitle: "Kit PNRR Cultura | Vizibilitate Artistica | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte PNRR cultură. Creativ.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cultură europeană</h2><p>Asigură vizibilitatea fondurilor PNRR în proiectele culturale cu materiale artistice.</p><ul><li>Plăci muzee</li><li>Panouri evenimente</li><li>Design cultural</li></ul>`
  },

  // --- FONDURI NAȚIONALE SUPLIMENTARE ---
  "antreprenoriat": {
    key: "antreprenoriat",
    title: "Kit Vizibilitate Antreprenoriat",
    shortDescription: "Materiale pentru programe naționale de antreprenoriat.",
    seoTitle: "Kit Antreprenoriat | Vizibilitate Proiecte | Prynt",
    seoDescription: "Plăci și autocolante pentru programe de antreprenoriat. Profesionale.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Susținere pentru afaceri</h2><p>Promovează proiectele de antreprenoriat cu materiale de vizibilitate esențiale.</p><ul><li>Plăci firme</li><li>Autocolante echipamente</li><li>Design corporativ</li></ul>`
  },
  "inovare": {
    key: "inovare",
    title: "Kit Vizibilitate Inovație",
    shortDescription: "Materiale pentru proiecte de inovare naționale.",
    seoTitle: "Kit Inovare | Vizibilitate Tehnologica | Prynt",
    seoDescription: "Plăci și panouri pentru proiecte de inovare. Inovatoare.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Inovație românească</h2><p>Asigură vizibilitatea proiectelor de inovare cu materiale moderne.</p><ul><li>Panouri tech</li><li>Autocolante gadgeturi</li><li>Rezistente la uzură</li></ul>`
  },
  "agricultura-nationala": {
    key: "agricultura-nationala",
    title: "Kit Vizibilitate Agricultură Națională",
    shortDescription: "Materiale pentru programe agricole naționale.",
    seoTitle: "Kit Agricultura Nationala | Vizibilitate Fermieri | Prynt",
    seoDescription: "Plăci și autocolante pentru agricultură. Rezistente la vreme.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Susținere rurală</h2><p>Promovează programele agricole naționale cu materiale durabile.</p><ul><li>Plăci ferme</li><li>Autocolante tractoare</li><li>Conformitate standarde</li></ul>`
  },
  "turism-national": {
    key: "turism-national",
    title: "Kit Vizibilitate Turism Național",
    shortDescription: "Materiale pentru proiecte turistice naționale.",
    seoTitle: "Kit Turism National | Vizibilitate Destinatii | Prynt",
    seoDescription: "Plăci și panouri pentru turism. Atractive.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Turism românesc</h2><p>Asigură vizibilitatea proiectelor turistice cu materiale vizuale.</p><ul><li>Panouri hoteluri</li><li>Plăci pensiuni</li><li>Design turistic</li></ul>`
  },
  "sanatate-nationala": {
    key: "sanatate-nationala",
    title: "Kit Vizibilitate Sănătate Națională",
    shortDescription: "Materiale pentru programe de sănătate naționale.",
    seoTitle: "Kit Sanatate Nationala | Vizibilitate Medicala | Prynt",
    seoDescription: "Plăci și autocolante pentru sănătate. Igienice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Sănătate pentru toți</h2><p>Promovează proiectele de sănătate cu materiale de vizibilitate esențiale.</p><ul><li>Plăci clinici</li><li>Autocolante echipamente</li><li>Materiale sigure</li></ul>`
  },
  "educatie-nationala": {
    key: "educatie-nationala",
    title: "Kit Vizibilitate Educație Națională",
    shortDescription: "Materiale pentru proiecte educaționale naționale.",
    seoTitle: "Kit Educatie Nationala | Vizibilitate Scolara | Prynt",
    seoDescription: "Plăci și panouri pentru educație. Educative.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Educație de calitate</h2><p>Asigură vizibilitatea proiectelor educaționale cu materiale inspiratoare.</p><ul><li>Panouri școli</li><li>Plăci universități</li><li>Design motivațional</li></ul>`
  },
  "cultura-nationala": {
    key: "cultura-nationala",
    title: "Kit Vizibilitate Cultură Națională",
    shortDescription: "Materiale pentru proiecte culturale naționale.",
    seoTitle: "Kit Cultura Nationala | Vizibilitate Artistica | Prynt",
    seoDescription: "Plăci și autocolante pentru cultură. Artistice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cultură românească</h2><p>Promovează proiectele culturale cu materiale de vizibilitate creative.</p><ul><li>Plăci teatre</li><li>Panouri muzee</li><li>Design cultural</li></ul>`
  },
  "sport-national": {
    key: "sport-national",
    title: "Kit Vizibilitate Sport Național",
    shortDescription: "Materiale pentru proiecte sportive naționale.",
    seoTitle: "Kit Sport National | Vizibilitate Atletica | Prynt",
    seoDescription: "Plăci și panouri pentru sport. Energetice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Sport pentru toți</h2><p>Asigură vizibilitatea proiectelor sportive cu materiale dinamice.</p><ul><li>Panouri stadioane</li><li>Autocolante echipamente</li><li>Design sportiv</li></ul>`
  },
  "mediu-national": {
    key: "mediu-national",
    title: "Kit Vizibilitate Mediu Național",
    shortDescription: "Materiale pentru programe de mediu naționale.",
    seoTitle: "Kit Mediu National | Vizibilitate Ecologica | Prynt",
    seoDescription: "Plăci și autocolante pentru mediu. Ecologice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Protecția naturii</h2><p>Promovează proiectele de mediu cu materiale sustenabile.</p><ul><li>Panouri verzi</li><li>Plăci parcuri</li><li>Materiale eco</li></ul>`
  },
  "transport-national": {
    key: "transport-national",
    title: "Kit Vizibilitate Transport Național",
    shortDescription: "Materiale pentru proiecte de transport naționale.",
    seoTitle: "Kit Transport National | Vizibilitate Infrastructura | Prynt",
    seoDescription: "Plăci și autocolante pentru transport. Rezistente.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Transport modern</h2><p>Asigură vizibilitatea proiectelor de transport cu materiale durabile.</p><ul><li>Panouri drumuri</li><li>Autocolante vehicule</li><li>Rezistente la vreme</li></ul>`
  },

  // --- FONDURI REGIO SUPLIMENTARE ---
  "regio-sanatate": {
    key: "regio-sanatate",
    title: "Panouri Temporare REGIO Sănătate",
    shortDescription: "Panouri pentru proiecte REGIO în sănătate.",
    seoTitle: "Panou Regio Sanatate | Vizibilitate Medicala | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO sănătate. Rezistente.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Sănătate regională</h2><p>Promovează proiectele REGIO în sănătate cu panouri vizibile.</p><ul><li>Panouri mari</li><li>Rezistente la vreme</li><li>Conformitate POR</li></ul>`
  },
  "regio-educatie": {
    key: "regio-educatie",
    title: "Panouri Temporare REGIO Educație",
    shortDescription: "Panouri pentru proiecte REGIO educaționale.",
    seoTitle: "Panou Regio Educatie | Vizibilitate Scolara | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO educație. Educative.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Educație regională</h2><p>Asigură vizibilitatea proiectelor REGIO în educație cu panouri informative.</p><ul><li>Panouri școlare</li><li>Design educațional</li><li>Rezistente la exterior</li></ul>`
  },
  "regio-transport": {
    key: "regio-transport",
    title: "Panouri Temporare REGIO Transport",
    shortDescription: "Panouri pentru proiecte REGIO de transport.",
    seoTitle: "Panou Regio Transport | Vizibilitate Infrastructura | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO transport. Mari.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Transport regional</h2><p>Promovează proiectele REGIO de transport cu panouri vizibile.</p><ul><li>Panouri mari</li><li>Rezistente la vreme</li><li>Conformitate standarde</li></ul>`
  },
  "regio-agricultura": {
    key: "regio-agricultura",
    title: "Panouri Temporare REGIO Agricultură",
    shortDescription: "Panouri pentru proiecte REGIO agricole.",
    seoTitle: "Panou Regio Agricultura | Vizibilitate Fermieri | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO agricultură. Durabile.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Agricultură regională</h2><p>Asigură vizibilitatea proiectelor REGIO în agricultură cu panouri esențiale.</p><ul><li>Panouri ferme</li><li>Rezistente la intemperii</li><li>Design rural</li></ul>`
  },
  "regio-turism": {
    key: "regio-turism",
    title: "Panouri Temporare REGIO Turism",
    shortDescription: "Panouri pentru proiecte REGIO turistice.",
    seoTitle: "Panou Regio Turism | Vizibilitate Destinatii | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO turism. Atractive.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Turism regional</h2><p>Promovează proiectele REGIO turistice cu panouri vizuale.</p><ul><li>Panouri turistice</li><li>Design atractiv</li><li>Rezistente la vreme</li></ul>`
  },
  "regio-mediu": {
    key: "regio-mediu",
    title: "Panouri Temporare REGIO Mediu",
    shortDescription: "Panouri pentru proiecte REGIO de mediu.",
    seoTitle: "Panou Regio Mediu | Vizibilitate Ecologica | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO mediu. Ecologice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Mediu regional</h2><p>Asigură vizibilitatea proiectelor REGIO de mediu cu panouri sustenabile.</p><ul><li>Panouri verzi</li><li>Materiale eco</li><li>Conformitate POR</li></ul>`
  },
  "regio-cultură": {
    key: "regio-cultură",
    title: "Panouri Temporare REGIO Cultură",
    shortDescription: "Panouri pentru proiecte REGIO culturale.",
    seoTitle: "Panou Regio Cultura | Vizibilitate Artistica | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO cultură. Creative.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cultură regională</h2><p>Promovează proiectele REGIO culturale cu panouri artistice.</p><ul><li>Panouri culturale</li><li>Design creativ</li><li>Rezistente la exterior</li></ul>`
  },
  "regio-sport": {
    key: "regio-sport",
    title: "Panouri Temporare REGIO Sport",
    shortDescription: "Panouri pentru proiecte REGIO sportive.",
    seoTitle: "Panou Regio Sport | Vizibilitate Atletica | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO sport. Energetice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Sport regional</h2><p>Asigură vizibilitatea proiectelor REGIO sportive cu panouri dinamice.</p><ul><li>Panouri stadioane</li><li>Design sportiv</li><li>Rezistente la vreme</li></ul>`
  },
  "regio-digital": {
    key: "regio-digital",
    title: "Panouri Temporare REGIO Digital",
    shortDescription: "Panouri pentru proiecte REGIO digitale.",
    seoTitle: "Panou Regio Digital | Vizibilitate Tehnologica | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO digital. Moderne.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Digital regional</h2><p>Promovează proiectele REGIO digitale cu panouri inovatoare.</p><ul><li>Panouri tech</li><li>Design modern</li><li>Conformitate POR</li></ul>`
  },
  "regio-energie": {
    key: "regio-energie",
    title: "Panouri Temporare REGIO Energie",
    shortDescription: "Panouri pentru proiecte REGIO de energie.",
    seoTitle: "Panou Regio Energie | Vizibilitate Verda | Prynt",
    seoDescription: "Panouri temporare pentru proiecte REGIO energie. Ecologice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Energie regională</h2><p>Asigură vizibilitatea proiectelor REGIO de energie cu panouri sustenabile.</p><ul><li>Panouri verzi</li><li>Rezistente la vreme</li><li>Design ecologic</li></ul>`
  },

  // --- ALTE FONDURI ȘI PROGRAME ---
  "fonduri-structurale": {
    key: "fonduri-structurale",
    title: "Kit Vizibilitate Fonduri Structurale",
    shortDescription: "Materiale pentru fonduri structurale europene.",
    seoTitle: "Kit Fonduri Structurale | Vizibilitate Europeana | Prynt",
    seoDescription: "Plăci și autocolante pentru fonduri structurale. Profesionale.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Dezvoltare structurală</h2><p>Promovează proiectele cu fonduri structurale cu materiale conforme.</p><ul><li>Plăci permanente</li><li>Autocolante echipamente</li><li>Rezistente la vreme</li></ul>`
  },
  "fonduri-cooperare": {
    key: "fonduri-cooperare",
    title: "Kit Vizibilitate Fonduri Cooperare",
    shortDescription: "Materiale pentru programe de cooperare.",
    seoTitle: "Kit Fonduri Cooperare | Vizibilitate Internationala | Prynt",
    seoDescription: "Plăci și panouri pentru cooperare. Internaționale.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cooperare europeană</h2><p>Asigură vizibilitatea proiectelor de cooperare cu materiale esențiale.</p><ul><li>Panouri mari</li><li>Design internațional</li><li>Conformitate standarde</li></ul>`
  },
  "fonduri-inovare": {
    key: "fonduri-inovare",
    title: "Kit Vizibilitate Fonduri Inovație",
    shortDescription: "Materiale pentru programe de inovare.",
    seoTitle: "Kit Fonduri Inovare | Vizibilitate Tehnologica | Prynt",
    seoDescription: "Plăci și autocolante pentru inovare. Inovatoare.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Inovație europeană</h2><p>Promovează proiectele de inovare cu materiale moderne.</p><ul><li>Autocolante tech</li><li>Plăci laboratoare</li><li>Design futurist</li></ul>`
  },
  "fonduri-startup": {
    key: "fonduri-startup",
    title: "Kit Vizibilitate Fonduri Startup",
    shortDescription: "Materiale pentru programe startup.",
    seoTitle: "Kit Fonduri Startup | Vizibilitate Antreprenoriala | Prynt",
    seoDescription: "Plăci și panouri pentru startup-uri. Dynamice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Startup-uri finanțate</h2><p>Asigură vizibilitatea startup-urilor cu materiale atractive.</p><ul><li>Panouri office</li><li>Autocolante echipamente</li><li>Design modern</li></ul>`
  },
  "fonduri-ngo": {
    key: "fonduri-ngo",
    title: "Kit Vizibilitate Fonduri ONG",
    shortDescription: "Materiale pentru organizații neguvernamentale.",
    seoTitle: "Kit Fonduri ONG | Vizibilitate Comunitara | Prynt",
    seoDescription: "Plăci și autocolante pentru ONG-uri. Sociale.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Societate civilă</h2><p>Promovează proiectele ONG cu materiale de vizibilitate esențiale.</p><ul><li>Plăci organizații</li><li>Panouri evenimente</li><li>Design comunitar</li></ul>`
  },
  "fonduri-educatie-superioara": {
    key: "fonduri-educatie-superioara",
    title: "Kit Vizibilitate Fonduri Educație Superioară",
    shortDescription: "Materiale pentru universități și cercetare.",
    seoTitle: "Kit Fonduri Educatie Superioara | Vizibilitate Academica | Prynt",
    seoDescription: "Plăci și autocolante pentru educație superioară. Academice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cunoaștere avansată</h2><p>Asigură vizibilitatea proiectelor universitare cu materiale profesionale.</p><ul><li>Plăci universități</li><li>Autocolante laboratoare</li><li>Design academic</li></ul>`
  },
  "fonduri-cercetare": {
    key: "fonduri-cercetare",
    title: "Kit Vizibilitate Fonduri Cercetare",
    shortDescription: "Materiale pentru proiecte de cercetare.",
    seoTitle: "Kit Fonduri Cercetare | Vizibilitate Stiintifica | Prynt",
    seoDescription: "Plăci și panouri pentru cercetare. Științifice.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Cercetare europeană</h2><p>Promovează proiectele de cercetare cu materiale inovatoare.</p><ul><li>Panouri laboratoare</li><li>Autocolante echipamente</li><li>Design științific</li></ul>`
  },
  "fonduri-tineret": {
    key: "fonduri-tineret",
    title: "Kit Vizibilitate Fonduri Tineret",
    shortDescription: "Materiale pentru programe pentru tineret.",
    seoTitle: "Kit Fonduri Tineret | Vizibilitate Juvenila | Prynt",
    seoDescription: "Plăci și autocolante pentru tineret. Tineret.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Viitorul tinerilor</h2><p>Asigură vizibilitatea proiectelor pentru tineret cu materiale atractive.</p><ul><li>Panouri evenimente</li><li>Plăci centre</li><li>Design dinamic</li></ul>`
  },
  "fonduri-femei": {
    key: "fonduri-femei",
    title: "Kit Vizibilitate Fonduri Femei",
    shortDescription: "Materiale pentru programe dedicate femeilor.",
    seoTitle: "Kit Fonduri Femei | Vizibilitate Egalitate | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte pentru femei. Empowering.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Egalitate de gen</h2><p>Promovează proiectele pentru femei cu materiale inspiratoare.</p><ul><li>Plăci centre</li><li>Panouri evenimente</li><li>Design empowering</li></ul>`
  },
  "fonduri-rural": {
    key: "fonduri-rural",
    title: "Kit Vizibilitate Fonduri Rurale",
    shortDescription: "Materiale pentru dezvoltare rurală.",
    seoTitle: "Kit Fonduri Rurale | Vizibilitate Rurala | Prynt",
    seoDescription: "Plăci și autocolante pentru proiecte rurale. Durabile.",
    images: ["/products/banner/produs-in-romania.webp"],
    contentHtml: `<h2>Dezvoltare rurală</h2><p>Asigură vizibilitatea proiectelor rurale cu materiale rezistente.</p><ul><li>Panouri ferme</li><li>Autocolante utilaje</li><li>Rezistente la vreme</li></ul>`
  }
};