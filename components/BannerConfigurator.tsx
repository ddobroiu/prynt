"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/banner/1.webp",
  "/products/banner/2.webp",
  "/products/banner/3.webp",
  "/products/banner/4.webp",
] as const;

/* FUNCTII UTILE */
function roundMoney(num: number) {
  return Math.round(num * 100) / 100;
}

function formatMoneyDisplay(amount: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatAreaDisplay(area: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(area);
}

/* CALCULARE PRETURI (exemplu) */
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "frontlit_440" | "frontlit_510";
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};

type LocalPriceOutput = {
  finalPrice: number;
  total_sqm: number;
  pricePerSqmAfterSurcharges: number;
};

const PRO_DESIGN_FEE = 50; // Exemplu de taxă pentru design profesional

const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { finalPrice: 0, total_sqm: 0, pricePerSqmAfterSurcharges: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;

  let pricePerSqmBand = 35;
  if (total_sqm < 1) pricePerSqmBand = 100;
  else if (total_sqm <= 5) pricePerSqmBand = 75;
  else if (total_sqm <= 20) pricePerSqmBand = 60;
  else if (total_sqm <= 50) pricePerSqmBand = 45;
  else pricePerSqmBand = 35;

  let multiplier = 1;
  if (input.material === "frontlit_510") multiplier *= 1.10;
  if (input.want_hem_and_grommets) multiplier *= 1.10;
  if (input.want_wind_holes) multiplier *= 1.10;

  const pricePerSqmAfterSurcharges = roundMoney(pricePerSqmBand * multiplier);
  const final = roundMoney(total_sqm * pricePerSqmAfterSurcharges);

  return {
    finalPrice: final,
    total_sqm: roundMoney(total_sqm),
    pricePerSqmAfterSurcharges,
  };
};

/* NOU: Componentă pentru un pas de configurare */
const ConfigStep = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="p-5 border-b border-gray-200 flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* NOU: Componenta pentru Tab-uri SEO */
const ProductTabs = ({ productSlug }: { productSlug: string }) => {
  const [activeTab, setActiveTab] = useState("descriere");

  const bannerFaqs: QA[] = [
    { question: "Ce materiale sunt disponibile pentru bannere?", answer: "Oferim două tipuri principale: Frontlit 440g (Standard), ideal pentru majoritatea aplicațiilor, și Frontlit 510g (Premium), pentru o durabilitate sporită." },
    { question: "Ce înseamnă finisajele 'Tiv și Capse'?", answer: "Acesta este finisajul nostru standard, inclus în preț. Tivul este o margine întărită, iar capsele sunt inele metalice aplicate la ~50 cm distanță, pentru o prindere sigură." },
    { question: "Când am nevoie de 'Găuri pentru vânt'?", answer: "Opțiunea este recomandată pentru bannerele de mari dimensiuni expuse în zone cu vânt puternic. Perforațiile reduc presiunea asupra materialului." },
    { question: "Cum pot trimite grafica pentru imprimare?", answer: "Puteți încărca fișierul direct în configurator, adăuga un link de descărcare, sau puteți plasa comanda acum și încărca fișierul mai târziu din contul de client." }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-12">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6 px-6" aria-label="Tabs">
          <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>
            Descriere Detaliată
          </TabButtonSEO>
          <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>
            Recenzii
          </TabButtonSEO>
          <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>
            Întrebări Frecvente
          </TabButtonSEO>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === "descriere" && (
          <div className="prose max-w-none">
            <h2>Bannere Publicitare Durabile pentru Afacerea Ta</h2>
            <p>
              Fie că dorești să anunți o promoție, să îți faci brandul cunoscut sau să decorezi un spațiu comercial, bannerele
              noastre personalizate sunt soluția ideală. Imprimate la o calitate fotografică excepțională pe materiale
              rezistente, acestea garantează un impact vizual maxim și o durabilitate îndelungată.
            </p>
            <p>
              Utilizăm tehnologie de print de ultimă generație pentru a ne asigura că fiecare detaliu al graficii tale este
              redat cu acuratețe, de la culori vibrante la texte clare. Materialele, fie că alegi varianta standard sau cea
              premium, sunt selectate pentru a rezista la condiții meteo variate, de la ploaie la raze UV, asigurând o viață
              lungă produsului tău publicitar.
            </p>
          </div>
        )}
        {activeTab === "recenzii" && (
          <Reviews productSlug={productSlug} />
        )}
        {activeTab === "faq" && <FaqAccordion qa={bannerFaqs} />}
      </div>
    </div>
  );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
      active
        ? "border-indigo-500 text-indigo-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

export default function BannerConfigurator({
  productSlug,
  initialWidth: initW,
  initialHeight: initH,
  productImage,
  renderOnlyConfigurator = false,
}: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const galleryImages = productImage
    ? [productImage, "/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"]
    : ["/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const displayedTotal = useMemo(() => {
    const base = priceDetailsLocal.finalPrice || 0;
    return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base;
  }, [priceDetailsLocal, designOption]);

  const [serverPrice, setServerPrice] = useState<number | null>(null);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
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
      setArtworkLink("");
    } catch (e: any) {
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        setArtworkUrl(preview);
      } catch {}
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Te rugăm să completezi lungimea și înălțimea.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const totalForOrder = serverPrice ?? displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Prețul trebuie calculat înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = roundMoney(totalForOrder / input.quantity);
    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      designOption,
    ].join("-");
    const title = `Banner personalizat - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-generic",
      slug: productSlug ?? "generic-banner",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        artworkUrl,
        artworkLink,
        designOption,
        textDesign,
        proDesignFee: designOption === "pro" ? PRO_DESIGN_FEE : 0,
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqmAfterSurcharges,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        setActiveImage(galleryImages[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages]);

  const totalShown = serverPrice ?? displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0;

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* COL-STÂNGA: Galerie Imagini (Sticky) */}
          <div className="lg:sticky top-24 h-max">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={activeImage}
                  alt="Banner preview"
                  className="h-full w-full object-cover transition-all duration-300"
                />
              </div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {galleryImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => {
                      setActiveImage(src);
                      setActiveIndex(i);
                    }}
                    className={`relative overflow-hidden rounded-lg transition aspect-square ${
                      activeIndex === i
                        ? "ring-2 ring-offset-2 ring-indigo-500"
                        : "hover:opacity-80"
                    }`}
                  >
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COL-DREAPTA: Header & Configurator */}
          <div>
            <header className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Configurator Banner</h1>
                <BannerModeSwitchInline />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Personalizează opțiunile de mai jos.</p>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                >
                  <Info size={16} />
                  <span>Detalii Produs</span>
                </button>
              </div>
            </header>

            {/* NOU: Sumar Sticky Sus */}
            <div className="sticky top-24 z-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-5 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Preț final</p>
                  <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalShown)}</p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="btn-primary w-1/2 py-3 text-base font-bold"
                >
                  <ShoppingCart size={20} />
                  <span className="ml-2">Adaugă în Coș</span>
                </button>
              </div>
              <div className="mt-3">
                <DeliveryInfo />
              </div>
            </div>

            <div className="space-y-6">
              {/* Pas 1: Dimensiuni */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-3">1. Dimensiuni & Cantitate</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div>
                    <label className="field-label">Lungime (cm)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={lengthText}
                      onChange={(e) => onChangeLength(e.target.value)}
                      placeholder="ex: 200"
                      className="input"
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
                      placeholder="ex: 100"
                      className="input"
                    />
                  </div>
                  <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                </div>
              </section>

              {/* Pas 2: Material & Finisaje */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-3">2. Material & Finisaje</h2>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <label className="field-label mb-2">Material</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <OptionButton
                      active={input.material === "frontlit_440"}
                      onClick={() => updateInput("material", "frontlit_440")}
                      title="Frontlit 440g"
                      subtitle="Standard"
                    />
                    <OptionButton
                      active={input.material === "frontlit_510"}
                      onClick={() => updateInput("material", "frontlit_510")}
                      title="Frontlit 510g"
                      subtitle="Premium (+10%)"
                    />
                  </div>
                  <label className="field-label">Finisaje</label>
                  <div className="space-y-2 mt-2">
                    <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200 font-medium">
                      Tiv & capse — incluse
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer border border-transparent">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={input.want_wind_holes}
                        onChange={(e) => updateInput("want_wind_holes", e.target.checked)}
                      />
                      <span className="text-sm font-medium text-gray-700">Găuri pentru vânt (+10%)</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Pas 3: Grafica */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-3">3. Grafică</h2>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex border-b border-gray-200 mb-4">
                    <TabButton active={designOption === "upload"} onClick={() => setDesignOption("upload")}>
                      Am Grafică
                    </TabButton>
                    <TabButton active={designOption === "text_only"} onClick={() => setDesignOption("text_only")}>
                      Doar Text
                    </TabButton>
                    <TabButton active={designOption === "pro"} onClick={() => setDesignOption("pro")}>
                      Design Pro
                    </TabButton>
                  </div>
                  {designOption === "upload" && (
                    <div className="space-y-4">
                      <div>
                        <label className="field-label">Încarcă fișier</label>
                        <input
                          type="file"
                          accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                          onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                          className="input-file"
                        />
                      </div>
                      <div>
                        <label className="field-label">Sau adaugă un link</label>
                        <input
                          type="url"
                          value={artworkLink}
                          onChange={(e) => setArtworkLink(e.target.value)}
                          placeholder="https://..."
                          className="input"
                        />
                      </div>
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                        Nu ai grafica la îndemână? Poți plasa comanda și o încarci mai târziu din{" "}
                        <Link
                          href="/account"
                          className="font-semibold text-indigo-600 hover:underline"
                        >
                          contul tău
                        </Link>
                        .
                      </div>
                      {uploading && <p className="text-sm font-medium text-indigo-600">Se încarcă...</p>}
                      {artworkUrl && <p className="text-sm font-medium text-green-600">Fișier încărcat.</p>}
                      {uploadError && <p className="text-sm font-medium text-red-600">{uploadError}</p>}
                    </div>
                  )}
                  {designOption === "text_only" && (
                    <div>
                      <textarea
                        value={textDesign}
                        onChange={(e) => setTextDesign(e.target.value)}
                        rows={3}
                        placeholder="ex: REDUCERI -50%"
                        className="input w-full"
                      />
                    </div>
                  )}
                  {designOption === "pro" && (
                    <p className="text-sm text-gray-600">
                      Un designer te va contacta după plasarea comenzii. (+{PRO_DESIGN_FEE} RON)
                    </p>
                  )}
                </div>
              </section>

              {/* NOU: Tab-uri SEO */}
            </div>
          </div>
        </div>

        {/* NOU: Secțiunea de Tab-uri SEO, sub configurator */}
        <div className="mt-16">
          <ProductTabs productSlug={productSlug || 'banner'} />
        </div>
      </div>

      {/* Footer pentru mobil */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t-2 border-gray-200 py-4 lg:hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{formatMoneyDisplay(totalShown)}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="btn-primary w-1/2 py-3 text-base font-bold"
            >
              <ShoppingCart size={20} />
              <span className="ml-2">Adaugă</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detalii */}
      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalii Produs & Comandă</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <b>Materiale:</b> Folosim materiale durabile, rezistente la condiții meteo. Opțiunea Premium (510g) oferă o
                rezistență sporită.
              </p>
              <p>
                <b>Finisaje Standard:</b> Toate bannerele vin cu tiv pentru extra-rezistență și capse metalice pentru
                prindere ușoară, incluse în preț.
              </p>
              <p>
                <b>Găuri pentru vânt:</b> Această opțiune este recomandată pentru bannerele de mari dimensiuni expuse în
                zone cu vânt puternic. Adaugă un cost de 10%.
              </p>
              <p>
                <b>Grafică Profesională:</b> Dacă alegi această opțiune (+{PRO_DESIGN_FEE} RON), un designer grafic te va
                contacta pentru a crea un design personalizat conform indicațiilor tale.
              </p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setDetailsOpen(false)} className="btn-primary">
                Am înțeles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div
        id="added-toast"
        className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        aria-live="polite"
      >
        Produs adăugat în coș
      </div>
      {errorToast && (
        <div
          className={`toast-error ${errorToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          aria-live="assertive"
        >
          {errorToast}
        </div>
      )}
    </main>
  );
}

/* Inline ModeSwitch - reintegrat */
function BannerModeSwitchInline() {
  const pathname = usePathname();
  const router = useRouter();
  const isDouble = pathname?.startsWith("/banner-verso");
  const goSingle = () => {
    if (isDouble) router.push("/banner");
  };
  const goDouble = () => {
    if (!isDouble) router.push("/banner-verso");
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={goSingle}
        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          !isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-pressed={!isDouble}
      >
        O față
      </button>
      <button
        type="button"
        onClick={goDouble}
        className={`ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-pressed={isDouble}
      >
        Față-verso
      </button>
    </div>
  );
}

/* UI Helpers modernizați */
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex">
        <button
          onClick={() => inc(-1)}
          className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200 transition-colors"
          aria-label="Decrement"
        >
          <Minus size={16} className="text-gray-600" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="input text-center w-full rounded-none border-x-0 [appearance:textfield]"
        />
        <button
          onClick={() => inc(1)}
          className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200 transition-colors"
          aria-label="Increment"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
        active
          ? "border-indigo-600 bg-indigo-50 shadow-sm"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <div className="font-bold text-gray-800">{title}</div>
      {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${
        active
          ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

type DesignOption = "upload" | "pro" | "text_only";

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
  productImage?: string;
  renderOnlyConfigurator?: boolean;
};
