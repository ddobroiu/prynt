// Script rapid pentru restaurare images bannere CU LITERE MICI
const fs = require('fs');

// Map cu TOATE pozele custom - TOATE CU LITERE MICI
const customImages = {
  "curatenie-profesionala": "curatenie-profesionala.webp",
  "magazin-second-hand": "magazin-second-hand.webp",
  "magazin-electrocasnice": "magazin-electrocasnice.webp",
  "magazin-gsm": "reparam-telefoane.webp",
  "service-telefoane": "reparam-telefoane.webp",
  "magazin-piese-auto": "piese-auto.webp",
  "magazin-decoratiuni": "magazin-decoratiuni.webp",
  "pet-shop": "pet-shop.webp",
  "magazin-sport": "magazin-sport.webp",
  "magazin-pescuit": "magazin-pescuit.webp",
  "magazin-mobila": "mobila-la-comanda.webp",
  "mobila-la-comanda": "mobila-la-comanda.webp",
  "panificatie": "panificatie.webp",
  "brutarie": "brutarie.webp",
  "restaurant": "restaurant.webp",
  "pizzerie": "pizzerie.webp",
  "terasa": "terasa.webp",
  "livram-la-domiciliu": "livram-la-domiciliu.webp",
  "deschis-acum": "deschis-acum.webp",
  "inchis-pentru-renovare": "inchis-pentru-renovare.webp",
  "recrutam-personal": "recrutam-personal.webp",
  "angajam": "angajam-personal.webp",
  "oferta-valabila-pana-la": "oferta-valabila-pana-la.webp",
  "noua-colectie-a-sosit": "produse-noi-disponibile.webp",
  "in-stoc-limitat": "in-stoc.webp",
  "produse-noi-disponibile": "produse-noi-disponibile.webp",
  "inchiriere-utilaje": "inchirieri-utilaje.webp",
  "tipografie": "tipografie.webp",
  "centru-de-copiere": "centru-de-copiere.webp",
  "croitorie-retusuri": "croitorie-retusari.webp",
  "curatenie-la-domiciliu": "curatenie-la-domiciliu.webp",
  "atelier-mecanic": "atelier-mecanic.webp",
  "detailing-auto": "detailing-auto.webp",
  "inchiriere-birouri": "inchiriere-birouri.webp",
  "showroom-deschis": "showroom-deschis.webp",
  "lustragiu-cizmărie": "cizmarie.webp",
  "curier-local": "curier-local.webp",
  "transport-marfa": "transport-marfa.webp",
  "livram-in-toata-tara": "livram-in-toata-tara.webp",
  "magazin-handmade": "magazin-handmade.jpg",
  "cadouri-personalizate": "cadouri-personalizate.jpg",
  "produse-bio-eco": "produse-bio-eco.jpg",
  "atelier-bijuterii": "atelier-bijuterii.jpg",
  "cofetarie-artizanala": "cofetarie-artizanala.jpg",
  "incearca-noul-produs": "incearca-noul-produs.jpg",
  "lichidare-totala": "lichidare-totala.jpg",
  "promotie-de-vara": "promotie-de-vara.jpg",
  "reduceri-de-toamna": "reduceri-de-toamna.jpg",
  "black-friday": "black-friday.jpg",
  "winter-sale": "winter-sale.jpg",
  "oferta-exclusiva": "oferta-exclusiva.jpg",
  "reparatii-laptopuri": "reparatii-laptopuri.jpg",
  "magazin-electronice": "magazin-electronice.jpg",
  "magazin-electro-it": "magazin-electro-it.jpg",
  "reparam-telefoane": "reparam-telefoane.jpg",
  "magazin-incaltaminte": "magazin-incaltaminte.jpg",
  "magazin-haine": "magazin-haine.jpg",
  "apartament-de-inchiriat": "apartament-de-inchiriat.jpg",
  "apartament-de-vanzare": "apartament-de-vanzare.jpg",
  "barbershop": "barbershop.jpg",
  "cabinet-stomatologic": "cabinet-stomatologic.jpg",
  "casa-de-inchiriat": "casa-de-inchiriat.jpg",
  "casa-de-vanzare": "casa-de-vanzare.jpg",
  "de-inchiriat": "de-inchiriat.jpg",
  "fastfood": "fastfood.jpg",
  "fructe-si-legume": "fructe-si-legume.jpg",
  "garsoniera-de-inchiriat": "garsoniera-de-inchiriat.jpg",
  "garsoniera-de-vanzare": "garsoniera-de-vanzare.jpg",
  "la-multi-ani": "la-multi-ani.jpg",
  "magazin-alimentar": "magazin-alimentar.jpg",
  "nu-blocati": "nu-blocati.jpg",
  "produs-in-romania": "produs-in-romania.jpg",
  "rent-a-car": "rent-a-car.jpg",
  "service-auto": "service-auto.jpg",
  "servicii-medicale": "servicii-medicale.jpg",
  "spalatorie-haine": "spalatorie-haine.jpg",
  "spatiu-de-inchiriat": "spatiu-de-inchiriat.jpg",
  "spatiu-de-vanzare": "spatiu-de-vanzare.jpg",
  "teren-de-inchiriat": "teren-de-inchiriat.jpg",
  "teren-de-vanzare": "teren-de-vanzare.jpg",
  "vila-de-inchiriat": "vila-de-inchiriat.jpg",
  "vila-de-vanzare": "vila-de-vanzare.jpg",
  "vulcanizare": "vulcanizare.jpg",
};

console.log("Total poze custom:", Object.keys(customImages).length);

// Citește fișierul
const filePath = 'lib/extraProducts.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Pentru fiecare produs din map, adaugă images
let addedCount = 0;
for (const [slug, imageName] of Object.entries(customImages)) {
  // Caută pattern-ul produsului
  const searchPattern = `slug: "${slug}", routeSlug: "${slug}", title:`;
  
  if (content.includes(searchPattern)) {
    // Verifică dacă NU are deja images
    const lines = content.split('\n');
    let found = false;
    let lineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchPattern)) {
        lineIndex = i;
        // Verifică dacă linia are deja images
        if (!lines[i].includes('images:')) {
          found = true;
        }
        break;
      }
    }
    
    if (found && lineIndex !== -1) {
      // Adaugă images DUPĂ description
      const line = lines[lineIndex];
      const descMatch = line.match(/description:\s*"[^"]+",/);
      
      if (descMatch) {
        const descEnd = line.indexOf(descMatch[0]) + descMatch[0].length;
        const before = line.substring(0, descEnd);
        const after = line.substring(descEnd);
        
        lines[lineIndex] = before + ` images: ["/products/banner/${imageName}"],` + after;
        addedCount++;
        console.log(`✓ Adăugat ${imageName} pentru ${slug}`);
      }
    }
    
    content = lines.join('\n');
  }
}

// Salvează fișierul
fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n✅ Terminat! Adăugate ${addedCount} poze custom.`);
