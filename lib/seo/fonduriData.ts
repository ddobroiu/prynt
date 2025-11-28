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
  }
};