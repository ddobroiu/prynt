"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info } from "lucide-react";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/flayer/1.jpg",
  "/products/flayer/2.jpg",
  "/products/flayer/3.jpg",
  "/products/flayer/4.jpg",
] as const;

/* Formate flayer (dimensiuni în mm) */
type FlyerSize = "A6" | "A5" | "A4" | "DL";
type Orientation = "portrait" | "landscape";
type Paper = "130" | "170" | "250";
type Finish = "matte" | "gloss" | "silk";
type Lamination = "none" | "matte" | "gloss";
type Sides = 1 | 2;

const SIZE_MM: Record<FlyerSize, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  A6: { w: 105, h: 148 },
  DL: { w: 99, h: 210 },
};

/* PREȚURI: calcul pe m² cu prag minim + coeficienți specifici flayere */
type PriceInput = {
  size: FlyerSize;
  orientation: Orientation;
  paper: Paper;
  sides: Sides;
  finish: Finish;
  lamination: Lamination;
  quantity: number;
};

type PriceOutput = {
  sqm_per_unit: number;
  total_sqm_taxable: number;
  pricePerSqmBase: number;
  finalPrice: number;
};

const MINIMUM_AREA_PER_ORDER = 0.5; // m² minim taxați/comandă
const PRICING_TIERS = [
  { maxSqm: 0.5, price: 120.0 },
  { maxSqm: 1, price: 110.0 },
  { maxSqm: 2, price: 100.0 },
  { maxSqm: 5, price: 90.0 },
  { maxSqm: Infinity, price: 80.0 },
];

const SURCHARGES = {
  paper_170: 1.10,
  paper_250: 1.25,
  sides_2: 1.35,
  finish_gloss: 1.03,
  finish_silk: 1.05,
  lamination_matte: 1.12,
  lamination_gloss: 1.12,
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

const calculatePrice = (input: PriceInput): PriceOutput => {
  if (input.quantity <= 0) return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };

  // dimensiuni în metri (orientarea nu schimbă aria, e pentru afișare)
  const { w, h } = SIZE_MM[input.size];
  const sqm_per_unit = (w / 1000) * (h / 1000);

  const total_sqm = sqm_per_unit * input.quantity;
  const total_sqm_taxable = Math.max(total_sqm, MINIMUM_AREA_PER_ORDER);

  let base = PRICING_TIERS.find((t) => total_sqm_taxable <= t.maxSqm)?.price ?? PRICING_TIERS.at(-1)!.price;

  let mult = 1;
  if (input.paper === "170") mult *= SURCHARGES.paper_170;
  if (input.paper === "250") mult *= SURCHARGES.paper_250;
  if (input.sides === 2) mult *= SURCHARGES.sides_2;
  if (input.finish === "gloss") mult *= SURCHARGES.finish_gloss;
  if (input.finish === "silk") mult *= SURCHARGES.finish_silk;
  if (input.lamination === "matte") mult *= SURCHARGES.lamination_matte;
  if (input.lamination === "gloss") mult *= SURCHARGES.lamination_gloss;

  const adj = base * mult;
  const final = total_sqm_taxable * adj;

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm_taxable: roundMoney(total_sqm_taxable),
    pricePerSqmBase: roundMoney(adj),
    finalPrice: roundMoney(final),
  };
};

/* GRAFICĂ */
type DesignOption = "upload" | "pro" | "text_only";
const PRO_DESIGN_FEE = 50;

export default function FlayerPage() {
  const { addItem, items } = useCart();

  const [input, setInput] = useState<PriceInput>({
    size: "A5",
    orientation: "portrait",
    paper: "170",
    sides: 2,
    finish: "silk",
    lamination: "none",
    quantity: 1000,
  });

  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const hasProDesign = items.some((i) => i.id === "design-pro");

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(Number.isFinite(v) ? v : 1)));

  const price = useMemo(() => calculatePrice(input), [input]);
  const pricePerUnit =
    input.quantity > 0 && price.finalPrice > 0 ? roundMoney(price.finalPrice / input.quantity) : 0;

  // Upload la Cloudinary prin /api/upload
  const onUpload = async (file: File | null) => {
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload eșuat");
      setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (price.finalPrice <= 0) return;

    const uniqueId = [
      "flayer",
      input.size,
      input.orientation,
      input.paper,
      `${input.sides}f`,
      input.finish,
      input.lamination,
      designOption,
    ].join("-");

    addItem({
      id: uniqueId,
      name: `Flayer ${input.size} ${input.orientation === "portrait" ? "Portret" : "Peisaj"} • ${input.paper}g • ${input.sides} fețe`,
      quantity: input.quantity,
      unitAmount: pricePerUnit,
      totalAmount: roundMoney(pricePerUnit * input.quantity),
      artworkUrl: artworkUrl ?? undefined,
      textDesign: designOption === "text_only" ? textDesign : undefined,
    });

    if (designOption === "pro" && !hasProDesign) {
      addItem({
        id: "design-pro",
        name: "Serviciu grafică profesională",
        quantity: 1,
        unitAmount: PRO_DESIGN_FEE,
        totalAmount: PRO_DESIGN_FEE,
      });
    }

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  };

  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2,
  });

  return (
    <main className="min-h-screen">
      {/* TOAST VERDE */}
      <div
        id="added-toast"
        className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        aria-live="polite"
      >
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Flayer</h1>
            <p className="mt-2 text-white/70">
              Alege formatul, orientarea, hârtia, fețele, finisajul/laminarea și partea de grafică (încărcare fișier / text / serviciu pro).
            </p>
          </div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
            <Info size={18} />
            <span className="ml-2">Mai multe detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* STÂNGA — configurator */}
          <div className="lg:col-span-3 space-y-8">
            <ConfigSection icon={<Ruler />} title="1. Format, Orientare și Cantitate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Formate */}
                <SelectCard
                  active={input.size === "A6"}
                  onClick={() => updateInput("size", "A6")}
                  title="A6"
                  subtitle="105 × 148 mm"
                />
                <SelectCard
                  active={input.size === "A5"}
                  onClick={() => updateInput("size", "A5")}
                  title="A5"
                  subtitle="148 × 210 mm"
                />
                <SelectCard
                  active={input.size === "A4"}
                  onClick={() => updateInput("size", "A4")}
                  title="A4"
                  subtitle="210 × 297 mm"
                />
                <SelectCard
                  active={input.size === "DL"}
                  onClick={() => updateInput("size", "DL")}
                  title="DL"
                  subtitle="99 × 210 mm"
                />

                {/* Orientare */}
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  <SelectCard
                    active={input.orientation === "portrait"}
                    onClick={() => updateInput("orientation", "portrait")}
                    title="Portret"
                    subtitle="Înalt"
                  />
                  <SelectCard
                    active={input.orientation === "landscape"}
                    onClick={() => updateInput("orientation", "landscape")}
                    title="Peisaj"
                    subtitle="Lat"
                  />
                </div>

                {/* Cantitate */}
                <div className="md:col-span-3">
                  <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={(v) => setQty(v)} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[100, 250, 500, 1000, 2500, 5000].map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={`px-3 py-1 rounded-md border text-sm ${
                          input.quantity === q ? "border-indigo-500 bg-white/10" : "border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => updateInput("quantity", q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ConfigSection>

            <ConfigSection icon={<Layers />} title="2. Hârtie, Fețe, Finisaj">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hârtie */}
                <MaterialOption
                  title="Hârtie 130 g/mp"
                  description="Economic, foarte răspândit"
                  selected={input.paper === "130"}
                  onClick={() => updateInput("paper", "130")}
                />
                <MaterialOption
                  title="Hârtie 170 g/mp"
                  description="Echilibru rigiditate/greutate"
                  selected={input.paper === "170"}
                  onClick={() => updateInput("paper", "170")}
                />
                <MaterialOption
                  title="Hârtie 250 g/mp"
                  description="Rigid, premium"
                  selected={input.paper === "250"}
                  onClick={() => updateInput("paper", "250")}
                />
              </div>

              {/* Fețe */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={input.sides === 1}
                  onClick={() => updateInput("sides", 1)}
                  title="1 față"
                  subtitle="Print simplu"
                />
                <SelectCard
                  active={input.sides === 2}
                  onClick={() => updateInput("sides", 2)}
                  title="2 fețe"
                  subtitle="Informație dublă"
                />
              </div>

              {/* Finisaj & Laminare */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={input.finish === "matte"}
                  onClick={() => updateInput("finish", "matte")}
                  title="Mat"
                  subtitle="Aspect mat, lizibil"
                />
                <SelectCard
                  active={input.finish === "gloss"}
                  onClick={() => updateInput("finish", "gloss")}
                  title="Lucios"
                  subtitle="Culori intense"
                />
                <SelectCard
                  active={input.finish === "silk"}
                  onClick={() => updateInput("finish", "silk")}
                  title="Satinat"
                  subtitle="Premium, fără reflexii"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={input.lamination === "none"}
                  onClick={() => updateInput("lamination", "none")}
                  title="Fără laminare"
                  subtitle="Standard"
                />
                <SelectCard
                  active={input.lamination === "matte"}
                  onClick={() => updateInput("lamination", "matte")}
                  title="Laminare mată"
                  subtitle="Protecție + aspect mat"
                />
                <SelectCard
                  active={input.lamination === "gloss"}
                  onClick={() => updateInput("lamination", "gloss")}
                  title="Laminare lucioasă"
                  subtitle="Protecție + luciu"
                />
              </div>
            </ConfigSection>

            <ConfigSection icon={<CheckCircle />} title="3. Grafică">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={designOption === "upload"}
                  onClick={() => setDesignOption("upload")}
                  title="Am grafică"
                  subtitle="Încarcă fișierul (PDF, AI, PSD, JPG, PNG)"
                />
                <SelectCard
                  active={designOption === "text_only"}
                  onClick={() => setDesignOption("text_only")}
                  title="Flayer cu text"
                  subtitle="Scriem noi aranjarea textului"
                />
                <SelectCard
                  active={designOption === "pro"}
                  onClick={() => setDesignOption("pro")}
                  title="Grafică profesională"
                  subtitle={`+${PRO_DESIGN_FEE} RON o singură dată`}
                />
              </div>

              {designOption === "upload" && (
                <div className="panel p-4 mt-4">
                  <label className="field-label">Încarcă fișier</label>
                  <input
                    type="file"
                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                    onChange={(e) => onUpload(e.target.files?.[0] || null)}
                    className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-500"
                  />
                  <div className="mt-3 text-sm">
                    {uploading && <span className="text-white/80">Se încarcă...</span>}
                    {uploadError && <span className="text-red-400">Eroare: {uploadError}</span>}
                    {artworkUrl && (
                      <span className="text-emerald-400">
                        Încărcat:{" "}
                        <a className="underline" href={artworkUrl} target="_blank" rel="noopener noreferrer">
                          deschide fișier
                        </a>
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-white/60">Linkul fișierului ajunge automat în emailul de comandă.</p>
                </div>
              )}

              {designOption === "text_only" && (
                <div className="panel p-4 mt-4">
                  <label className="field-label">Text pentru flayer</label>
                  <textarea
                    value={textDesign}
                    onChange={(e) => setTextDesign(e.target.value)}
                    rows={4}
                    placeholder="Ex.: OFERTĂ • Reduceri lunare • www.site.ro"
                    className="input resize-y min-h-[120px]"
                  />
                  <p className="mt-2 text-xs text-white/60">
                    Gratuit: scrie textul, iar designerii noștri îl așază clar și lizibil. Pentru machetare avansată, alege “Grafică profesională”.
                  </p>
                </div>
              )}

              {designOption === "pro" && (
                <div className="panel p-4 mt-4">
                  <p className="text-sm text-white/80">
                    Un designer te va contacta după plasarea comenzii. Taxa se aplică o singură dată (+{PRO_DESIGN_FEE} RON) per comandă.
                  </p>
                  {hasProDesign && <p className="text-xs text-white/60 mt-2">Taxa este deja în coș.</p>}
                </div>
              )}
            </ConfigSection>
          </div>

          {/* DREAPTA — SUMAR + GALERIE */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Flayer preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src) => (
                    <button
                      key={src}
                      onClick={() => setActiveImage(src)}
                      className={`relative overflow-hidden rounded-md border transition ${
                        activeImage === src ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"
                      }`}
                      aria-label="Previzualizare"
                    >
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Sumar Comandă</h2>

                <div className="space-y-2 text-white/80 text-sm">
                  <p>
                    Format:{" "}
                    <span className="text-white font-semibold">
                      {input.size} {input.orientation === "portrait" ? "(Portret)" : "(Peisaj)"}
                    </span>
                  </p>
                  <p>
                    Cantitate: <span className="text-white font-semibold">{input.quantity} buc</span>
                  </p>
                  <p>
                    Hârtie: <span className="text-white font-semibold">{input.paper} g/mp</span>
                  </p>
                  <p>
                    Fețe: <span className="text-white font-semibold">{input.sides} {input.sides === 1 ? "față" : "fețe"}</span>
                  </p>
                  <p>
                    Finisaj:{" "}
                    <span className="text-white font-semibold">
                      {input.finish === "matte" ? "Mat" : input.finish === "gloss" ? "Lucios" : "Satinat"}
                    </span>
                  </p>
                  <p>
                    Laminare:{" "}
                    <span className="text-white font-semibold">
                      {input.lamination === "none" ? "Fără" : input.lamination === "matte" ? "Mată" : "Lucioasă"}
                    </span>
                  </p>

                  {artworkUrl && (
                    <p className="text-xs">
                      Fișier încărcat:{" "}
                      <a className="underline text-indigo-300" href={artworkUrl} target="_blank" rel="noopener noreferrer">
                        deschide
                      </a>
                    </p>
                  )}
                  {designOption === "text_only" && textDesign && (
                    <div className="text-xs text-white/70">
                      Text: <span className="text-white">{textDesign}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 mt-4 pt-4">
                  {price.sqm_per_unit > 0 && (
                    <p className="text-xs text-white/60 mb-2">
                      Suprafață/pcs: {price.sqm_per_unit} m² · Taxabil: {price.total_sqm_taxable} m² · Tarif: {price.pricePerSqmBase} RON/m²
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-extrabold">
                        {price.finalPrice > 0 ? `${fmt.format(price.finalPrice)}` : "—"}
                      </div>
                      {price.finalPrice > 0 && (
                        <div className="text-xs text-white/60">
                          ~{fmt.format(price.finalPrice / Math.max(1, input.quantity))} / buc
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={price.finalPrice <= 0}
                      onClick={handleAddToCart}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 font-semibold"
                    >
                      <ShoppingCart size={18} />
                      Adaugă în coș
                    </button>
                  </div>
                </div>
              </div>

              {/* DETALII PRODUS */}
              {detailsOpen && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Detalii flayere</h3>
                    <button className="btn-outline text-xs" onClick={() => setDetailsOpen(false)}>
                      Închide
                    </button>
                  </div>

                  <section>
                    <h4 className="font-semibold text-white mb-1">Formate standard</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>A6: 105 × 148 mm</li>
                      <li>A5: 148 × 210 mm</li>
                      <li>A4: 210 × 297 mm</li>
                      <li>DL: 99 × 210 mm</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Hârtie & fețe</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>130/170/250 g/mp în funcție de rigiditate dorită.</li>
                      <li>1 față sau 2 fețe, color CMYK.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Finisaje</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Mat, lucios sau satinat. Laminare (mată/lucioasă) disponibilă opțional.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Fișiere/Grafică</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Acceptăm: PDF, AI, PSD, JPG, PNG (profil CMYK recomandat).</li>
                      <li>“Flayer cu text”: scrie textul, îl aranjăm gratuit.</li>
                      <li>Pentru grafică complexă, alege “Grafică profesională”.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Producție & livrare</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Producție uzuală: 1–3 zile lucrătoare (în funcție de tiraj).</li>
                      <li>Livrare națională prin curier (DPD).</li>
                      <li>Comanda minimă: {MINIMUM_AREA_PER_ORDER} m² total taxabil/comandă.</li>
                    </ul>
                  </section>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* UI mici și reutilizabile (stil identic cu celelalte pagini) */
function ConfigSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-indigo-400">{icon}</div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center">
        <button onClick={() => inc(-1)} className="p-3 bg-white/10 rounded-l-md hover:bg-white/15" aria-label="Decrement">
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="input text-lg font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-y-0 rounded-none"
        />
        <button onClick={() => inc(1)} className="p-3 bg-white/10 rounded-r-md hover:bg-white/15" aria-label="Increment">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function MaterialOption({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left p-4 rounded-lg transition-all ${
        selected
          ? "border-2 border-indigo-500 bg-indigo-900/30 ring-4 ring-indigo-500/20"
          : "border border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 badge badge-success">
          <CheckCircle size={12} className="mr-1" /> Selectat
        </span>
      )}
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}

function SelectCard({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        active ? "border-indigo-500 ring-2 ring-indigo-500/40 bg-white/10" : "border-white/10 hover:border-white/30"
      }`}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-white/70">{subtitle}</div>
    </button>
  );
}