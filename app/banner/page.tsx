"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart } from "lucide-react";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/banner/1.jpg",
  "/products/banner/2.jpg",
  "/products/banner/3.jpg",
  "/products/banner/4.jpg",
] as const;

/* LOGICA PREȚ (integrată) */
type BannerMaterial = "frontlit_440" | "frontlit_510";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};
type PriceOutput = {
  sqm_per_unit: number;
  total_sqm_taxable: number;
  pricePerSqmBase: number;
  finalPrice: number;
};

const MINIMUM_AREA_PER_ORDER = 1.0;
const PRICING_TIERS = [
  { maxSqm: 5, price: 35.0 },
  { maxSqm: 10, price: 32.0 },
  { maxSqm: 20, price: 30.0 },
  { maxSqm: 50, price: 28.0 },
  { maxSqm: Infinity, price: 26.0 },
];
const SURCHARGES = { frontlit_510: 1.15, wind_holes: 1.05, hem_and_grommets: 1.10 };
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const calculatePrice = (input: PriceInput): PriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
  }
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;
  const total_sqm_taxable = Math.max(total_sqm, MINIMUM_AREA_PER_ORDER);
  let base = PRICING_TIERS.find((t) => total_sqm_taxable <= t.maxSqm)?.price ?? PRICING_TIERS.at(-1)!.price;
  let mult = 1;
  if (input.material === "frontlit_510") mult *= SURCHARGES.frontlit_510;
  if (input.want_wind_holes) mult *= SURCHARGES.wind_holes;
  if (input.want_hem_and_grommets) mult *= SURCHARGES.hem_and_grommets;
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
type DesignOption = "upload" | "pro";
const PRO_DESIGN_FEE = 50;

export default function BannerPage() {
  const { addItem, items } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: 0,
    height_cm: 0,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const [lengthText, setLengthText] = useState("");
  const [heightText, setHeightText] = useState("");
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasProDesign = items.some((i) => i.id === "design-pro");

  const priceDetails = useMemo(() => calculatePrice(input), [input]);
  const pricePerUnit =
    input.quantity > 0 && priceDetails.finalPrice > 0
      ? roundMoney(priceDetails.finalPrice / input.quantity)
      : 0;

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const setQty = (v: number) =>
    updateInput("quantity", Math.max(1, Math.floor(Number.isFinite(v) ? v : 1)));

  const onChangeLength = (v: string) => {
    const d = v.replace(/\D/g, "");
    setLengthText(d);
    updateInput("width_cm", d === "" ? 0 : parseInt(d, 10));
  };
  const onChangeHeight = (v: string) => {
    const d = v.replace(/\D/g, "");
    setHeightText(d);
    updateInput("height_cm", d === "" ? 0 : parseInt(d, 10));
  };

  // Upload la Cloudinary prin /api/upload
  const handleArtworkFileInput = async (file: File | null) => {
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!priceDetails || priceDetails.finalPrice <= 0) return;

    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      input.want_hem_and_grommets ? "c" : "f",
    ].join("-");

    const unitAmount = pricePerUnit;
    const totalAmount = roundMoney(unitAmount * input.quantity);

    addItem({
      id: uniqueId,
      name: `Banner ${input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"} - ${input.width_cm}x${input.height_cm}cm${artworkUrl ? " (cu grafică încărcată)" : ""}`,
      quantity: input.quantity,
      unitAmount,
      totalAmount,
      artworkUrl: artworkUrl ?? undefined,
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

    const toast = document.getElementById("added-toast");
    if (toast) {
      toast.style.opacity = "1";
      setTimeout(() => (toast.style.opacity = "0"), 1400);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div
        id="added-toast"
        className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white shadow-2xl shadow-emerald-900/40 opacity-0 transition-opacity"
      >
        Produs adăugat în coș
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Banner</h1>
          <p className="mt-2 text-white/70">Alege lungimea, înălțimea, materialul, finisajele și încarcă grafica (opțional).</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <ConfigSection icon={<Ruler />} title="1. Dimensiuni și Cantitate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lungime (cm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={lengthText}
                    onChange={(e) => onChangeLength(e.target.value)}
                    placeholder="ex: 100"
                    className="w-full bg-gray-800 border border-gray-700 py-2.5 px-3 text-lg font-semibold rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Înălțime (cm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={heightText}
                    onChange={(e) => onChangeHeight(e.target.value)}
                    placeholder="ex: 100"
                    className="w-full bg-gray-800 border border-gray-700 py-2.5 px-3 text-lg font-semibold rounded-md"
                  />
                </div>
                <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={(v) => setQty(v)} />
              </div>
            </ConfigSection>

            <ConfigSection icon={<Layers />} title="2. Material Banner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaterialOption
                  title="Frontlit 440g/mp"
                  description="Standard, echilibru bun calitate-preț"
                  selected={input.material === "frontlit_440"}
                  onClick={() => updateInput("material", "frontlit_440")}
                />
                <MaterialOption
                  title="Frontlit 510g/mp"
                  description="Premium, mai rigid și mai durabil"
                  selected={input.material === "frontlit_510"}
                  onClick={() => updateInput("material", "frontlit_510")}
                />
              </div>
            </ConfigSection>

            <ConfigSection icon={<CheckCircle />} title="3. Finisaje">
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={input.want_hem_and_grommets}
                    onChange={(e) => updateInput("want_hem_and_grommets", e.target.checked)}
                  />
                  <span className="text-sm">Tiv și capse (standard)</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={input.want_wind_holes}
                    onChange={(e) => updateInput("want_wind_holes", e.target.checked)}
                  />
                  <span className="text-sm">Găuri pentru vânt (mesh-look)</span>
                </label>
              </div>
            </ConfigSection>

            <ConfigSection icon={<CheckCircle />} title="4. Grafică">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDesignOption("upload")}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    designOption === "upload" ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-white">Am grafică</div>
                  <div className="text-xs text-white/70">Încarcă fișierul tău (PDF, AI, PSD, JPG, PNG)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDesignOption("pro")}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    designOption === "pro" ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-white">Cumpără grafică profesională</div>
                  <div className="text-xs text-white/70">+{PRO_DESIGN_FEE} RON (o singură dată/comandă)</div>
                </button>
              </div>

              {designOption === "upload" && (
                <div className="rounded-lg mt-4 p-4 bg-gray-800/60 border border-gray-700">
                  <label className="block text-sm font-medium text-white/80 mb-2">Încarcă fișier</label>
                  <input
                    type="file"
                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                    onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
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
                  <p className="mt-2 text-xs text-white/60">
                    Linkul fișierului ajunge automat în emailul de comandă.
                  </p>
                </div>
              )}

              {designOption === "pro" && (
                <div className="rounded-lg mt-4 p-4 bg-gray-800/60 border border-gray-700">
                  <p className="text-sm text-white/80">
                    Un designer te va contacta după plasarea comenzii. Taxa se aplică o singură dată (+{PRO_DESIGN_FEE} RON).
                  </p>
                  {hasProDesign && <p className="text-xs text-white/60 mt-2">Taxa este deja în coș.</p>}
                </div>
              )}
            </ConfigSection>
          </div>

          {/* DREAPTA: SUMAR + GALERIE */}
          <div className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="rounded-2xl bg-gray-900/50 border border-gray-700/60 p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Banner preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src) => (
                    <button
                      key={src}
                      onClick={() => setActiveImage(src)}
                      className={`overflow-hidden rounded-md border transition ${
                        activeImage === src ? "border-indigo-500" : "border-white/10 hover:border-white/30"
                      }`}
                      aria-label="Previzualizare"
                    >
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-900/50 border border-gray-700/60 p-6">
                <h2 className="text-xl font-bold border-b border-gray-700 pb-4 mb-4">Sumar Comandă</h2>

                <div className="space-y-2 text-white/80 text-sm">
                  <p>
                    Dimensiuni: <span className="text-white font-semibold">{lengthText || "—"} x {heightText || "—"} cm</span>
                  </p>
                  <p>Cantitate: <span className="text-white font-semibold">{input.quantity} buc</span></p>
                  <p>Material: <span className="text-white font-semibold">{input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"}</span></p>
                  {artworkUrl && (
                    <p className="text-xs">
                      Fișier încărcat:{" "}
                      <a className="underline text-indigo-300" href={artworkUrl} target="_blank" rel="noopener noreferrer">
                        deschide
                      </a>
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4">
                  <p className="text-white/60 text-sm">Preț total</p>
                  <p className="text-4xl font-extrabold text-white my-2">{priceDetails?.finalPrice.toFixed(2)} RON</p>
                  {pricePerUnit > 0 && <p className="text-xs text-white/60">{pricePerUnit.toFixed(2)} RON / buc</p>}
                  {designOption === "pro" && !hasProDesign && (
                    <p className="text-xs text-white/80 mt-2">+ {PRO_DESIGN_FEE.toFixed(2)} RON (grafică profesională — se va adăuga o singură dată)</p>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!priceDetails || priceDetails.finalPrice <= 0}
                  className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 text-lg rounded-lg hover:bg-indigo-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Adaugă în coș
                </button>
              </div>

              <div className="rounded-2xl bg-gray-900/40 border border-gray-700/50 p-4 text-xs text-white/60">
                Print durabil. Livrare rapidă. Suport: contact@prynt.ro
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ConfigSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
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
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center">
        <button onClick={() => inc(-1)} className="p-3 bg-gray-700 rounded-l-md hover:bg-gray-600">
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full text-center bg-gray-800 border-y border-gray-700 py-2.5 text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button onClick={() => inc(1)} className="p-3 bg-gray-700 rounded-r-md hover:bg-gray-600">
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
      className={`text-left p-4 rounded-lg border-2 transition-all ${
        selected ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
      }`}
    >
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}