"use client";
import React, { useState, useMemo } from 'react';

// --- LOGICĂ DE PREȚ (Integrată din BannerConfigurator.tsx) ---

// Tipuri de date pentru material și intrarea în funcția de preț
type BannerMaterial = "frontlit_440" | "frontlit_510";

type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean; // Tiv + capse
};

// Structura de return
type PriceOutput = {
  sqm_per_unit: number; // Suprafața unei singure unități (m²)
  total_sqm_calculated: number; // Suprafața totală reală (m²)
  total_sqm_taxable: number; // Suprafața taxabilă (m²), cu min. 1m²
  pricePerSqmBase: number; // Prețul de bază/mp pentru acel prag de cantitate (inclusiv multiplicatorii)
  totalBasePrice: number; // Preț total înainte de TVA
  finalPrice: number; // Preț final cu TVA
  isMinAreaApplied: boolean; // Indicator dacă a fost aplicat minimum 1m²
};


// Constante
const TVA = 0.19;
const MINIMUM_AREA_PER_ORDER = 1.0; // Suprafața minimă taxabilă (în m²)

// Prețurile de BAZĂ (Frontlit 440g) în RON, pe prag de suprafață totală taxabilă (fără finisaje/TVA)
const TIERED_PRICES: { maxSqm: number, price: number }[] = [
    { maxSqm: MINIMUM_AREA_PER_ORDER, price: 150.00 }, // Preț special pentru aria minima (dacă se ajunge la 1mp taxabil)
    { maxSqm: 5, price: 100.00 },
    { maxSqm: 20, price: 75.00 },
    { maxSqm: Infinity, price: 50.00 }, // Peste 20 mp
];

// Supra-taxe (multiplicator)
const SURCHARGES = {
    // Frontlit 510g este cu 15% mai scump
    frontlit_510: 1.15,
    // Găuri de vânt (adaugă 5% la costul de bază al suprafeței)
    wind_holes: 1.05,
    // Tiv + Capse (adaugă 10% la costul de bază al suprafeței)
    hem_and_grommets: 1.10,
    // TVA
    tva_multiplier: 1 + TVA
};

/**
 * Rotunjeste suma la 2 zecimale.
 */
function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Calculează prețul de bază pe metru pătrat în funcție de suprafața totală taxabilă.
 */
function getTierPricePerSqm(sqm: number): number {
    for (const tier of TIERED_PRICES) {
        if (sqm <= tier.maxSqm) {
            return tier.price;
        }
    }
    return TIERED_PRICES[TIERED_PRICES.length - 1].price;
}

/**
 * Calculează prețul total al comenzii de bannere.
 */
function computeBannerPrice(input: PriceInput): PriceOutput {
    // 1. Suprafața pe unitate (în m²). Presupunem lățimea și înălțimea > 0 pentru calcul.
    const w_m = Math.max(0, input.width_cm) / 100;
    const h_m = Math.max(0, input.height_cm) / 100;
    const sqm_per_unit = w_m * h_m;

    // 2. Suprafața totală reală (brută)
    const total_sqm_calculated = sqm_per_unit * input.quantity;

    // 3. Suprafața totală taxabilă (Minim 1m² regula)
    const total_sqm_taxable = Math.max(total_sqm_calculated, MINIMUM_AREA_PER_ORDER);
    const isMinAreaApplied = roundMoney(total_sqm_taxable) > roundMoney(total_sqm_calculated); // Comparăm rotunjit

    // 4. Prețul de bază pe metru pătrat (din tier-ul de cantitate)
    let pricePerSqmBase = getTierPricePerSqm(total_sqm_taxable);

    // 5. Aplicarea Multiplicatorilor (Surcharges)
    let totalMultiplier = 1;
    
    // Multiplicator Material
    if (input.material === "frontlit_510") {
        totalMultiplier *= SURCHARGES.frontlit_510;
    }

    // Multiplicator Finisaj (se pot aplica ambele, cumulativ)
    if (input.want_wind_holes) {
        totalMultiplier *= SURCHARGES.wind_holes;
    }
    if (input.want_hem_and_grommets) {
        totalMultiplier *= SURCHARGES.hem_and_grommets;
    }
    
    // 6. Preț total FĂRĂ TVA
    const totalBasePrice = total_sqm_taxable * pricePerSqmBase * totalMultiplier;

    // 7. Preț total CU TVA
    const finalPrice = totalBasePrice * SURCHARGES.tva_multiplier;
    
    // Prețul final per mp, ajustat cu toate supra-taxele, folosit pentru afișarea detaliată
    const adjustedPricePerSqm = pricePerSqmBase * totalMultiplier;

    return {
        sqm_per_unit: roundMoney(sqm_per_unit),
        total_sqm_calculated: roundMoney(total_sqm_calculated),
        total_sqm_taxable: roundMoney(total_sqm_taxable),
        pricePerSqmBase: roundMoney(adjustedPricePerSqm), 
        totalBasePrice: roundMoney(totalBasePrice),
        finalPrice: roundMoney(finalPrice),
        isMinAreaApplied: isMinAreaApplied,
    };
}
// --- SFÂRȘIT LOGICĂ DE PREȚ ---

// Funcție de formatare RON (pentru a fi self-contained)
const money = (amount: number) => `${roundMoney(amount).toFixed(2)} RON`; 

// Iconițe (pentru a fi self-contained)
const Check = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const AlertCircle = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const Ruler = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path><path d="M15 7H9"></path></svg>;
const ImageGrid = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="21"></line></svg>;


// --- DATE CONFIGURARE PENTRU CONFIGURATOR ---
const MATERIALS: { value: BannerMaterial; label: string; desc: string }[] = [
  { value: "frontlit_440", label: "Frontlit 440 g/mp", desc: "Standard, preț de bază" },
  { value: "frontlit_510", label: "Frontlit 510 g/mp", desc: "Premium, +15% rezistență" },
];

const FINISHES: { label: string; field: keyof PriceInput; desc: string }[] = [
  { label: "Tiv + Capse la 50 cm", field: "want_hem_and_grommets", desc: "Recomandat, +10% la preț" },
  { label: "Găuri de vânt (pentru exterior)", field: "want_wind_holes", desc: "Pentru zone expuse, +5% la preț" },
];

// --- COMPONENTE INTERNE PENTRU CONFIGURATOR ---
const SelectCard = ({ label, desc, value, currentSelection, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 
            ${currentSelection === value 
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20' 
                : 'border-white/10 bg-gray-700/50 hover:border-white/20'
            }`
        }
    >
        <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{label}</span>
            {currentSelection === value && <Check className="w-5 h-5 text-indigo-400" />}
        </div>
        <p className="text-xs text-white/60 mt-0.5">{desc}</p>
    </button>
);

const CheckboxOption = ({ label, desc, checked, onChange }) => (
    <label className="flex items-start p-3 rounded-lg border border-white/10 bg-gray-700/50 cursor-pointer hover:bg-gray-600/50 transition-colors">
        <input 
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mt-1 w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 shrink-0"
        />
        <div className="ml-3">
            <span className="text-sm font-medium text-white/90">{label}</span>
            <p className="text-xs text-white/60">{desc}</p>
        </div>
    </label>
);

// --- COMPONENTA CONFIGURATOR (Integrată) ---
function BannerConfigurator() {
  const [widthInput, setWidthInput] = useState('100');
  const [heightInput, setHeightInput] = useState('50');
  const [qty, setQty] = useState(1);
  
  const [material, setMaterial] = useState<BannerMaterial>('frontlit_440');
  const [wantWindHoles, setWantWindHoles] = useState<boolean>(false); 
  const [wantHemAndGrommets, setWantHemAndGrommets] = useState<boolean>(true); // Implicit, recomandat

  const width = parseFloat(widthInput) || 0;
  const height = parseFloat(heightInput) || 0;
  const quantity = Math.max(1, qty);
  
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // Calculul Prețului
  const price: PriceOutput = useMemo(() => {
    return computeBannerPrice({
        width_cm: width,
        height_cm: height,
        quantity: quantity,
        material: material,
        want_hem_and_grommets: wantHemAndGrommets,
        want_wind_holes: wantWindHoles,
    });
  }, [quantity, width, height, material, wantHemAndGrommets, wantWindHoles]);


  // Handler pentru a permite ștergerea completă a valorii din input
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    // Permitem input gol sau numere pozitive
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setter(value);
    }
  };

  const handleAddToCart = () => {
    // Aici se adaugă logica de adăugare în coș (simulată)
    console.log("Adaugă în coș: ", { qty: quantity, width, height, material, wantHemAndGrommets, wantWindHoles, price });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 3000);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-indigo-400">Configurează Produsul</h2>
      
      {/* 1. Dimensiuni și Cantitate */}
      <div className="space-y-4 p-4 rounded-xl bg-gray-900 border border-white/10 shadow-inner">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-white/90">
            <Ruler className="w-5 h-5 text-indigo-400" /> Dimensiuni & Cantitate
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Lățime (cm)</label>
            <input 
              type="number" 
              value={widthInput} 
              onChange={(e) => handleDimensionChange(e, setWidthInput)}
              min={0} 
              placeholder="100"
              className="w-full rounded-lg bg-gray-800 border border-white/20 p-2.5 text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Înălțime (cm)</label>
            <input 
              type="number" 
              value={heightInput} 
              onChange={(e) => handleDimensionChange(e, setHeightInput)}
              min={0} 
              placeholder="50"
              className="w-full rounded-lg bg-gray-800 border border-white/20 p-2.5 text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-white/70">Bucăți</label>
          <input 
            type="number" 
            value={qty} 
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            min={1} 
            className="w-full rounded-lg bg-gray-800 border border-white/20 p-2.5 text-white text-base focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
      </div>


      {/* 2. Opțiuni Material */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-white/90">Alege Materialul</label>
        <div className="grid grid-cols-2 gap-3">
          {MATERIALS.map(opt => (
            <SelectCard 
                key={opt.value} 
                label={opt.label} 
                desc={opt.desc}
                value={opt.value} 
                currentSelection={material} 
                onClick={setMaterial} 
            />
          ))}
        </div>
      </div>

      {/* 3. Opțiuni Finisaj */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-white/90">Alege Finisajul</label>
        <div className="space-y-3">
          <CheckboxOption 
            label={FINISHES[0].label}
            desc={FINISHES[0].desc}
            checked={wantHemAndGrommets}
            onChange={() => setWantHemAndGrommets(!wantHemAndGrommets)}
          />
          <CheckboxOption 
            label={FINISHES[1].label}
            desc={FINISHES[1].desc}
            checked={wantWindHoles}
            onChange={() => setWantWindHoles(!wantWindHoles)}
          />
        </div>
      </div>
      
      {/* 4. PRICING BANNER / REZUMAT PREȚ FINAL */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        
        {/* Detalii de calcul (Mini Banner) */}
        <div className="text-sm space-y-1 p-3 rounded-xl bg-indigo-900/40 border border-indigo-500/50 shadow-lg shadow-indigo-900/20">
            {price.isMinAreaApplied && (
                <div className="flex items-center justify-between text-yellow-300 font-semibold pb-2 border-b border-indigo-400/30">
                    <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4"/> ATENȚIE: Suprafață Minimă Taxabilă</span>
                    <span>{price.total_sqm_taxable.toFixed(4)} mp</span>
                </div>
            )}
            
            <div className="flex justify-between items-center text-white/80">
                <span>Suprafață reală ({quantity} buc):</span>
                <span className={`${price.isMinAreaApplied ? 'line-through opacity-70' : 'text-indigo-300'}`}>
                    {price.total_sqm_calculated.toFixed(4)} mp
                </span>
            </div>
            
            <div className="flex justify-between items-center text-white/80 font-medium pt-1">
                <span>Preț final / mp (inclusiv finisaje):</span>
                <span>{money(price.pricePerSqmBase)}</span>
            </div>
        </div>

        {/* Preț Final Mare */}
        <div className="text-center bg-indigo-700/60 p-4 rounded-xl shadow-2xl shadow-indigo-900/50">
            <p className="text-lg font-normal text-white/80">Total de Plată (TVA inclus 19%)</p>
            <span className="text-5xl font-extrabold text-white block mt-1 tracking-tight">
                {money(price.finalPrice)}
            </span>
        </div>

        {/* Butoane CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
                className="w-full px-5 py-3 rounded-xl bg-indigo-600/90 text-white font-extrabold text-lg hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/40"
                onClick={handleAddToCart}
            >
                Adaugă în coș
            </button>
        </div>
        
        {/* Feedback adăugare */}
        {justAdded && (
          <div className="mt-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-sm text-emerald-300">
            Produsul a fost adăugat în coș.
          </div>
        )}
      </div>
    </div>
  );
}


// --- COMPONENTE PENTRU PAGINA DE PRODUS ---
// Mini Componentă Galerie (pentru a simula)
const ProductGallery = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]);
    return (
        <div className="space-y-4">
            {/* Imagine principală */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl">
                <img 
                    src={mainImage.src} 
                    alt={mainImage.alt} 
                    className="w-full h-full object-cover" 
                />
            </div>
            {/* Thumbs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                    <button 
                        key={index} 
                        onClick={() => setMainImage(img)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors 
                            ${mainImage.src === img.src ? 'border-indigo-400' : 'border-white/10 hover:border-white/30'}`
                        }
                    >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- COMPONENTA PAGINĂ PRINCIPALĂ ---
export default function BannerPage() {
    
    // Simulare de date
    const images = [
        // Am folosit un placeholder comun în loc de path-uri absolute /products/banner/1.jpg
        { src: "https://placehold.co/800x450/1e293b/a5b4fc?text=Banner+Exterior", alt: "Banner exterior" },
        { src: "https://placehold.co/800x450/1e293b/a5b4fc?text=Print+Calitate+UV", alt: "Print calitate UV" },
        { src: "https://placehold.co/800x450/1e293b/a5b4fc?text=Tiv+%26+Capse+Detalii", alt: "Detaliu tiv și capse" },
    ];

    const features = [
        "Print UV rezistent la intemperii",
        "Culoare bogată, nefadeată",
        "Livrare rapidă",
        "Opțiuni: găuri de vânt, tiv + capse",
    ];

    const badges = [
        { title: "Livrare 24–48h", desc: "în funcție de cantitate" },
        { title: "Plată sigură", desc: "card / OP / ramburs" },
        { title: "Garanția calității", desc: "verificare fișier" },
    ];


  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      {/* Container Principal */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-extrabold text-white mb-8">Banner Personalizat</h1>
        
        <div className="grid lg:grid-cols-5 gap-8">
            
          {/* Col stânga (60%): Galerie și Detalii Produs */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Galerie */}
            <ProductGallery images={images} />
            
            {/* Detalii și Beneficii */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">De ce să alegi bannerele noastre</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>

            {/* Descriere detaliată */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white/90">
                <ImageGrid className="w-5 h-5 text-indigo-400" /> Detalii & Specificații
              </h3>
              <p className="text-white/80">
                Bannerul este tipărit digital pe materiale Frontlit de înaltă calitate, care asigură o excelentă rezistență la intemperii, raze UV și diferențe de temperatură. 
                Sistemul nostru de calcul ia în considerare dimensiunile (lățimea și înălțimea) în centimetri pentru a determina suprafața totală (mp) și a aplica prețul corespunzător.
                Pentru o durată de viață maximă, recomandăm alegerea opțiunii *Tiv + Capse*, care rigidizează marginile și previne ruperea materialului în jurul capselor.
              </p>
            </div>

            {/* Badge-uri încredere */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {badges.map((b, i) => (
                <div key={i} className="rounded-xl border-2 border-indigo-700/50 bg-gray-900 p-4 shadow-lg text-center">
                  <div className="text-lg font-bold text-indigo-300">{b.title}</div>
                  <div className="text-sm text-white/70">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col dreapta (40%): configurator sticky */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border-2 border-indigo-500/50 bg-gray-900 p-6 shadow-xl shadow-indigo-900/50">
                <BannerConfigurator />
              </div>
            </div>
          </aside>

        </div>
      </section>
      
      {/* Footer-ul este de obicei inclus separat, dar îl omitem aici pentru simplitate */}
    </main>
  );
}
