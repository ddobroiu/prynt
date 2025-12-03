# Window Graphics Configurator

## Descriere
Configurator pentru folie PVC perforată pentru ferestre și vitrine. Oferă vizibilitate unidirecțională perfectă - permite vedere dinspre interior spre exterior, dar oferă suprafață printabilă pe exterior.

## Caracteristici Tehnice

### Material
- **Tip**: Folie PVC specială cu perforații
- **Grosime**: 140 microni
- **Suport**: Hârtie siliconată 135 g/mp
- **Suprafață**: Albă lucioasă (exterior) / Neagră (interior)
- **Raport perforații**: 50% printabil / 50% transparent
- **Adeziv**: Poliacrilic removabil, transparent, pe bază de solvent
- **Durabilitate**: Până la 3 ani
- **Dimensiuni rolă**: Lățime 137cm × Lungime 50m
- **Aplicare**: Doar uscat (fără apă)

## Pricing

### Prețuri pe Bandă (lei/mp)
- **<1 mp**: 250 lei/mp
- **1-5 mp**: 200 lei/mp
- **5-20 mp**: 170 lei/mp
- **>20 mp**: 150 lei/mp

### Opțiuni Grafică
- **Grafică proprie**: Gratuit (upload PDF, JPG, PNG, AI, CDR)
- **Design Pro**: +100 lei (echipa noastră creează design-ul)

## Exemple Prețuri

### Exemplu 1: Vitrină mică
- Dimensiuni: 100cm × 150cm = 1.5 mp
- Cantitate: 1 buc
- Preț/mp: 200 lei
- **Total**: 300 lei

### Exemplu 2: Fereastră birouri
- Dimensiuni: 200cm × 150cm = 3 mp
- Cantitate: 3 buc = 9 mp total
- Preț/mp: 170 lei (bandă 5-20 mp)
- **Total**: 1,530 lei

### Exemplu 3: Autovehicul comercial
- Dimensiuni: 120cm × 80cm = 0.96 mp
- Cantitate: 2 buc = 1.92 mp total
- Preț/mp: 200 lei
- **Total**: 384 lei

### Exemplu 4: Campanie mare
- Dimensiuni: 300cm × 200cm = 6 mp
- Cantitate: 4 buc = 24 mp total
- Preț/mp: 150 lei (bandă >20 mp)
- **Total**: 3,600 lei

## Aplicații

1. **Vitrine magazine și showroom-uri**
   - Publicitate vizibilă din exterior
   - Păstrează vizibilitatea din interior
   - Branding profesional

2. **Ferestre birouri și sedii**
   - Privacy parțial
   - Identitate corporativă
   - Reducere căldură solară

3. **Autovehicule comerciale**
   - Geamuri laterale și spate
   - Publicitate mobilă
   - Vizibilitate șofer păstrată

4. **Publicitate outdoor**
   - Campanii pe termen scurt/mediu
   - Removabil fără urme
   - Rezistent la UV

## Structura Configuratorului

### Step 1: Dimensiuni & Cantitate
- Input lungime (cm)
- Input înălțime (cm)
- Selector cantitate (min 1 buc)

### Step 2: Grafică
- **Opțiune 1**: Upload fișier propriu
  - Acceptă: PDF, JPG, PNG, AI, CDR, SVG
  - Fără cost adițional
  
- **Opțiune 2**: Design Pro
  - Cost fix: 100 lei
  - Design creat de echipă

## Calcul Preț

```typescript
// Formula de bază
total_sqm = (width_cm × height_cm × quantity) / 10000

// Găsire preț/mp pe bandă
if (total_sqm <= 1) pricePerSqm = 250
else if (total_sqm <= 5) pricePerSqm = 200
else if (total_sqm <= 20) pricePerSqm = 170
else pricePerSqm = 150

// Preț final
finalPrice = total_sqm × pricePerSqm + designFee
```

## Files Modified/Created

### New Files
- `components/WindowGraphicsConfigurator.tsx` - Componenta principală
- `app/window-graphics/page.tsx` - Pagina Next.js
- `public/products/window-graphics/` - Folder imagini

### Modified Files
- `lib/pricing.ts` - Adăugat `WINDOW_GRAPHICS_CONSTANTS` și `calculateWindowGraphicsPrice()`
- `lib/siteConfig.ts` - Adăugat în meniu "Publicitar" și footer

## SEO & Marketing

### Keywords
- window graphics
- folie perforată ferestre
- folie vitrine
- publicitate geamuri
- folie one-way vision
- autocolante ferestre
- folie perforată PVC
- publicitate outdoor

### Meta Description
"Folie PVC perforată pentru ferestre și vitrine. Vizibilitate unidirecțională perfectă, aplicare uscată, durabilitate până la 3 ani. Publicitate outdoor profesională."

## Navigation
- **Header**: Meniu "Publicitar" → "Window Graphics"
- **Footer**: Secțiunea "Materiale" → "Window Graphics"
- **URL**: `/window-graphics`

## Notes
- Imaginile placeholder trebuie înlocuite cu fotografii reale ale produsului
- Considerați adăugarea unui video demonstrativ pentru aplicare
- Poate beneficia de galerie foto cu proiecte finalizate
