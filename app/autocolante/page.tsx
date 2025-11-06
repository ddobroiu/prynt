"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, Square, Circle, Scissors } from "lucide-react";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/autocolante/1.jpg",
  "/products/autocolante/2.jpg",
  "/products/autocolante/3.jpg",
  "/products/autocolante/4.jpg",
] as const;

/* LOGICA PREȚ (specific autocolante) */
type StickerShape = "rect" | "circle";
type StickerMaterial = "vinyl_white" | "vinyl_clear" | "vinyl_polymeric";
type Lamination = "none" | "matte" | "gloss";
type CutType = "kiss" | "die" | "sheet";

type PriceInput = {
  shape: StickerShape;
  width_cm: number;   // la circle: folosit ca diametru
  height_cm: number;  // ignorat la circle
  quantity: number;
  material: StickerMaterial;
  lamination: Lamination;
  cut: CutType;
};

type PriceOutput = {
  sqm_per_unit: number;
  total_sqm_taxable: number;
  pricePerSqmBase: number;
  finalPrice: number;
};

const MINIMUM_AREA_PER_ORDER = 0.2; // minim 0.2 m² per comandă
const PRICING_TIERS = [
  { maxSqm: 1, price: 75.0 },
  { maxSqm: 5, price: 70.0 },
  { maxSqm: 10, price: 65.0 },
  { maxSqm: 20, price: 60.0 },
  { maxSqm: Infinity, price: 55.0 },
];
const SURCHARGES = {
  vinyl_clear: 1.10,
  vinyl_polymeric: 1.20,
  lamination_matte: 1.15,
  lamination_gloss: 1.15,
  cut_die: 1.10,
  cut_sheet: 1.05,
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

const calculatePrice = (input: PriceInput): PriceOutput => {
  if (input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
  }
  let sqm_per_unit = 0;
  if (input.shape === "rect") {
    if (input.width_cm <= 0 || input.height_cm <= 0) {
      return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
    }
    sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  } else {
    // circle: width_cm = diametru
    if (input.width_cm <= 0) {
      return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
    }
    const r_m = (input.width_cm / 100) / 2;
    sqm_per_unit = Math.PI * r_m * r_m;
  }

  const total_sqm = sqm_per_unit * input.quantity;
  const total_sqm_taxable = Math.max(total_sqm, MINIMUM_AREA_PER_ORDER);

  let base = PRICING_TIERS.find((t) => total_sqm_taxable <= t.maxSqm)?.price ?? PRICING_TIERS.at(-1)!.price;

  let mult = 1;
  if (input.material === "vinyl_clear") mult *= SURCHARGES.vinyl_clear;
  if (input.material === "vinyl_polymeric") mult *= SURCHARGES.vinyl_polymeric;
  if (input.lamination === "matte") mult *= SURCHARGES.lamination_matte;
  if (input.lamination === "gloss") mult *= SURCHARGES.lamination_gloss;
  if (input.cut === "die") mult *= SURCHARGES.cut_die;
  if (input.cut === "sheet") mult *= SURCHARGES.cut_sheet;

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

export default function StickersPage() {
  const { addItem, items } = useCart();

  const [input, setInput] = useState<PriceInput>({
    shape: "rect",
    width_cm: 0,
    height_cm: 0,
    quantity: 100,
    material: "vinyl_white",
    lamination: "none",
    cut: "kiss",
  });

  // controale text pt input-uri numerice (ca la banner)
  const [lengthText, setLengthText] = useState("");
  const [heightText, setHeightText] = useState("");
  const [diameterText, setDiameterText] = useState(""); // pt. circle
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);

  const onChangeNumber = (text: string, setter: (t: string) => void, onValid: (n: number) => void) => {
    const cleaned = text.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setter(cleaned);
    const n = parseFloat(cleaned);
    if (!Number.isNaN(n)) onValid(n);
  };

  const onChangeWidth = (t: string) => {
    if (input.shape === "circle") {
      onChangeNumber(t, setDiameterText, (n) => setInput((p) => ({ ...p, width_cm: n })));
    } else {
      onChangeNumber(t, setLengthText, (n) => setInput((p) => ({ ...p, width_cm: n })));
    }
  };
  const onChangeHeight = (t: string) => onChangeNumber(t, setHeightText, (n) => setInput((p) => ({ ...p, height_cm: n })));

  const setQty = (q: number) => setInput((p) => ({ ...p, quantity: Math.max(1, Math.round(q)) }));

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const price = useMemo(() => calculatePrice(input), [input]);

  const hasProDesign = useMemo(() => items.some((i) => i.id === "service_design_pro"), [items]);

  const onUpload = async (f: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload eșuat");
      setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message || "Upload eșuat");
    } finally {
      setUploading(false);
    }
  };

  const addToCart = () => {
    if (price.finalPrice <= 0) return;

    const dims =
      input.shape === "circle"
        ? `Ø${diameterText || input.width_cm}cm`
        : `${lengthText || input.width_cm}x${heightText || input.height_cm}cm`;

    const id = `stickers_${input.shape}_${dims}_${input.material}_${input.lamination}_${input.cut}`;
    const name = `Autocolante ${input.shape === "circle" ? "rotunde" : "dreptunghiulare"} (${dims})`;

    const unit = roundMoney(price.finalPrice / input.quantity);
    addItem({
      id,
      name,
      quantity: input.quantity,
      unitAmount: unit,
      totalAmount: roundMoney(unit * input.quantity),
      artworkUrl: artworkUrl ?? undefined,
      textDesign: designOption === "text_only" ? textDesign : undefined,
    });

    if (designOption === "pro" && !hasProDesign) {
      addItem({
        id: "service_design_pro",
        name: "Serviciu grafică profesională",
        quantity: 1,
        unitAmount: PRO_DESIGN_FEE,
        totalAmount: PRO_DESIGN_FEE,
      });
    }

    // feedback simplu
    alert("Produs adăugat în coș");
  };

  const unitLabel = input.shape === "circle" ? "Diametru (cm)" : "Lungime (cm) / Înălțime (cm)";

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {price.finalPrice > 0 ? "Calculat preț autocolante" : "Aștept date pentru calcul"}
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Autocolante</h1>
            <p className="mt-2 text-white/70">
              Alege forma, dimensiunile, materialul, laminarea, tipul de tăiere și partea de grafică (încărcare fișier / text simplu / serviciu pro).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="btn-outline text-sm self-start"
          >
            <Info size={18} />
            <span className="ml-2">Mai multe detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* STÂNGA — configurator */}
          <div className="lg:col-span-3 space-y-8">
            <ConfigSection icon={<Ruler />} title="1. Formă, Dimensiuni și Cantitate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 grid grid-cols-3 gap-3">
                  <SelectCard
                    active={input.shape === "rect"}
                    onClick={() => {
                      updateInput("shape", "rect");
                      setDiameterText("");
                    }}
                    title="Dreptunghi/pătrat"
                    subtitle="Lățime x Înălțime"
                  />
                  <SelectCard
                    active={input.shape === "circle"}
                    onClick={() => {
                      updateInput("shape", "circle");
                      setLengthText("");
                      setHeightText("");
                    }}
                    title="Cerc"
                    subtitle="Diametru"
                  />
                  <div className="hidden md:block" />
                </div>

                {input.shape === "rect" ? (
                  <>
                    <div>
                      <label className="field-label">Lungime (cm)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={lengthText}
                        onChange={(e) => onChangeWidth(e.target.value)}
                        placeholder="ex: 10"
                        className="input text-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="field-label">Înălțime (cm)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={heightText}
                        onChange={(e) => onChangeHeight(e.target.value)}
                        placeholder="ex: 5"
                        className="input text-lg font-semibold"
                      />
                    </div>
                    <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={setQty} />
                  </>
                ) : (
                  <>
                    <div>
                      <label className="field-label">Diametru (cm)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={diameterText}
                        onChange={(e) => onChangeWidth(e.target.value)}
                        placeholder="ex: 5"
                        className="input text-lg font-semibold"
                      />
                    </div>
                    <div className="md:col-span-1" />
                    <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={setQty} />
                  </>
                )}
              </div>
            </ConfigSection>

            <ConfigSection icon={<Layers />} title="2. Material și Laminare">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaterialOption
                  title="Vinil alb monomeric"
                  description="Standard, interior/exterior"
                  selected={input.material === "vinyl_white"}
                  onClick={() => updateInput("material", "vinyl_white")}
                />
                <MaterialOption
                  title="Vinil transparent"
                  description="Efect clear, necesită grafica potrivită"
                  selected={input.material === "vinyl_clear"}
                  onClick={() => updateInput("material", "vinyl_clear")}
                />
                <MaterialOption
                  title="Vinil polimeric"
                  description="Calitate superioară, durabilitate mai mare"
                  selected={input.material === "vinyl_polymeric"}
                  onClick={() => updateInput("material", "vinyl_polymeric")}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={input.lamination === "none"}
                  onClick={() => updateInput("lamination", "none")}
                  title="Fără laminare"
                  subtitle="Utilizare standard"
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

            <ConfigSection icon={<Scissors />} title="3. Tip tăiere">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectCard
                  active={input.cut === "kiss"}
                  onClick={() => updateInput("cut", "kiss")}
                  title="Kiss-cut"
                  subtitle="Tăiere în folie, ușor de dezlipit"
                />
                <SelectCard
                  active={input.cut === "die"}
                  onClick={() => updateInput("cut", "die")}
                  title="Die-cut individual"
                  subtitle="Tăiere completă, stickere separate"
                />
                <SelectCard
                  active={input.cut === "sheet"}
                  onClick={() => updateInput("cut", "sheet")}
                  title="Pe coală"
                  subtitle="Mai multe stickere pe o coală"
                />
              </div>
            </ConfigSection>

            <ConfigSection icon={<CheckCircle />} title="4. Grafică">
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
                  title="Sticker cu text"
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
                    className="file:mr-3 file:rounded-md file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-1 file:text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUpload(f);
                    }}
                  />
                  {uploading && <p className="text-sm text-white/60 mt-2">Se încarcă...</p>}
                  {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
                  {artworkUrl && (
                    <p className="text-sm text-green-400 mt-2">
                      Încărcat:{" "}
                      <a className="underline" href={artworkUrl} target="_blank" rel="noreferrer">
                        vezi fișier
                      </a>
                    </p>
                  )}
                </div>
              )}

              {designOption === "text_only" && (
                <div className="panel p-4 mt-4">
                  <label className="field-label">Text pentru autocolant</label>
                  <textarea
                    value={textDesign}
                    onChange={(e) => setTextDesign(e.target.value)}
                    rows={4}
                    placeholder="Ex.: LOGO • WWW.SITE.RO • Slogan"
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
                  <img src={activeImage} alt="Sticker preview" className="h-full w-full object-cover" loading="eager" />
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
                    Formă:{" "}
                    <span className="text-white font-semibold">
                      {input.shape === "circle" ? "Cerc" : "Dreptunghi/pătrat"}
                    </span>
                  </p>
                  <p>
                    Dimensiuni:{" "}
                    <span className="text-white font-semibold">
                      {input.shape === "circle"
                        ? `Ø ${diameterText || input.width_cm || "—"} cm`
                        : `${lengthText || input.width_cm || "—"} x ${heightText || input.height_cm || "—"} cm`}
                    </span>
                  </p>
                  <p>
                    Cantitate: <span className="text-white font-semibold">{input.quantity} buc</span>
                  </p>
                  <p>
                    Material:{" "}
                    <span className="text-white font-semibold">
                      {input.material === "vinyl_white" ? "Vinil alb" : input.material === "vinyl_clear" ? "Vinil transparent" : "Vinil polimeric"}
                    </span>
                  </p>
                  <p>
                    Laminare:{" "}
                    <span className="text-white font-semibold">
                      {input.lamination === "none" ? "Fără" : input.lamination === "matte" ? "Mată" : "Lucioasă"}
                    </span>
                  </p>
                  <p>
                    Tăiere:{" "}
                    <span className="text-white font-semibold">
                      {input.cut === "kiss" ? "Kiss-cut" : input.cut === "die" ? "Die-cut individual" : "Pe coală"}
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

                <div className="mt-4 border-t border-white/10 pt-4">
                  {price.sqm_per_unit > 0 && (
                    <p className="text-xs text-white/60 mb-2">
                      Suprafață/pcs: {price.sqm_per_unit} m² · Taxabil: {price.total_sqm_taxable} m² · Tarif: {price.pricePerSqmBase} RON/m²
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-extrabold">
                        {price.finalPrice > 0 ? `${price.finalPrice.toFixed(2)} RON` : "—"}
                      </div>
                      {price.finalPrice > 0 && (
                        <div className="text-xs text-white/60">
                          ~{(price.finalPrice / Math.max(1, input.quantity)).toFixed(2)} RON/buc
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={price.finalPrice <= 0}
                      onClick={addToCart}
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
                    <h3 className="text-lg font-bold">Detalii autocolante</h3>
                    <button className="btn-outline text-xs" onClick={() => setDetailsOpen(false)}>Închide</button>
                  </div>

                  <section>
                    <h4 className="font-semibold text-white mb-1">Materiale</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Vinil alb: standard, interior/exterior.</li>
                      <li>Vinil transparent: pentru efect clear (atenție la opacitate/contrast).</li>
                      <li>Vinil polimeric: stabilitate și durabilitate superioară.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Laminare</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Mată / Lucioasă: protecție UV și la zgârieturi, aspect premium.</li>
                      <li>Fără laminare: suficient pentru utilizări standard pe termen scurt/mediu.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Tăiere</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Kiss-cut: tăiere la folie, stickerul rămâne pe suport.</li>
                      <li>Die-cut: tăiere completă, fiecare sticker separat.</li>
                      <li>Pe coală: mai multe stickere pe o coală (economic la volume mari).</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Fișiere/Grafică</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Acceptăm: PDF, AI, PSD, JPG, PNG (profil CMYK recomandat).</li>
                      <li>Pentru “Sticker cu text”: scrie textul, ne ocupăm noi de așezare (gratis).</li>
                      <li>Pentru grafică complexă, alege “Grafică profesională”.</li>
                    </ul>
                  </section>

                  <section className="mt-3">
                    <h4 className="font-semibold text-white mb-1">Producție & livrare</h4>
                    <ul className="list-disc pl-5 space-y-1 text-white/80">
                      <li>Producție uzuală: 1–2 zile lucrătoare.</li>
                      <li>Livrare națională prin curier (DPD).</li>
                    </ul>
                  </section>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/* UI mici și reutilizabile (stil identic cu pagina Banner) */
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
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-outline"
          onClick={() => onChange(Math.max(1, value - 1))}
          aria-label="Scade"
        >
          <Minus size={16} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^\d]/g, "");
            const n = parseInt(cleaned || "0", 10);
            onChange(Number.isNaN(n) ? 0 : n);
          }}
          className="input text-lg font-semibold text-center w-full"
        />
        <button
          type="button"
          className="btn-outline"
          onClick={() => onChange(value + 1)}
          aria-label="Crește"
        >
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
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-4 transition ${
        selected ? "border-indigo-500 ring-2 ring-indigo-500/40 bg-white/10" : "border-white/10 hover:border-white/30"
      }`}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-white/70">{description}</div>
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