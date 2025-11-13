"use client";

import { useMemo, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../components/CartContext";
import { ShieldCheck, Truck, X } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = "ramburs" | "card";

type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
};

export default function CheckoutPage() {
  // Use CartProvider hook (items shape: title, price, quantity, metadata...)
  const { items = [], removeItem, isLoaded, total } = useCart();

  const [address, setAddress] = useState<Address>({
    nume_prenume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada_nr: "",
  });

  const [billing, setBilling] = useState<Billing>({
    tip_factura: "persoana_fizica",
  });

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ramburs");

  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEmbed, setShowEmbed] = useState(false);

  const firstInvalidRef = useRef<HTMLElement | null>(null);

  // Helper: normalize cart items to the shape expected by server (name, unitAmount, totalAmount, artworkUrl, textDesign, metadata)
  function normalizeCart(cart: any[]) {
    return (cart ?? []).map((it) => {
      const quantity = Number(it.quantity ?? 1) || 1;
      const unitAmount = Number(it.price ?? it.unitAmount ?? it.metadata?.price ?? 0) || 0;
      const totalAmount = Number(it.totalAmount ?? (unitAmount > 0 ? unitAmount * quantity : 0)) || 0;
      const artworkUrl = it.artworkUrl ?? it.metadata?.artworkUrl ?? it.metadata?.artworkLink ?? it.metadata?.artwork ?? null;
      const textDesign = it.textDesign ?? it.metadata?.textDesign ?? it.metadata?.text ?? null;
      const name = it.title ?? it.name ?? it.slug ?? it.metadata?.title ?? `Produs`;
      return {
        id: it.id,
        name,
        quantity,
        unitAmount,
        totalAmount,
        artworkUrl,
        textDesign,
        metadata: it.metadata ?? {},
      };
    });
  }

  // subtotal fallback: compute robustly from items (use normalized)
  const subtotal = useMemo(() => {
    const norm = normalizeCart(items);
    return norm.reduce((s, it) => s + Number(it.totalAmount || it.unitAmount * it.quantity || 0), 0);
  }, [items]);

  const costLivrare = (items ?? []).length > 0 ? 19.99 : 0;
  const totalPlata = (items ?? []).length > 0 ? subtotal + costLivrare : 0;
  const isEmpty = isLoaded && (items ?? []).length === 0;

  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2,
  }).format;

  function validate(): { ok: boolean; errs: Record<string, string> } {
    const e: Record<string, string> = {};

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRe = /^[0-9+()\-\s]{7,}$/;

    if (!address.nume_prenume.trim()) e["address.nume_prenume"] = "Nume și prenume obligatoriu";
    if (!emailRe.test(address.email)) e["address.email"] = "Email invalid";
    if (!telRe.test(address.telefon)) e["address.telefon"] = "Telefon invalid";
    if (!address.judet) e["address.judet"] = "Alege județul";
    if (!address.localitate.trim()) e["address.localitate"] = "Localitate obligatorie";
    if (!address.strada_nr.trim()) e["address.strada_nr"] = "Stradă și număr obligatorii";

    if (billing.tip_factura === "persoana_juridica") {
      if (!billing.denumire_companie?.trim())
        e["billing.denumire_companie"] = "Denumire companie obligatorie";
      if (!billing.cui?.trim()) e["billing.cui"] = "CUI/CIF obligatoriu";
    }

    if (!sameAsDelivery) {
      if (!billing.judet) e["billing.judet"] = "Alege județul (facturare)";
      if (!billing.localitate?.trim())
        e["billing.localitate"] = "Localitate facturare obligatorie";
      if (!billing.strada_nr?.trim())
        e["billing.strada_nr"] = "Stradă și număr facturare obligatorii";
    }

    if ((items ?? []).length === 0) e["cart.empty"] = "Coșul este gol";

    return { ok: Object.keys(e).length === 0, errs: e };
  }

  async function placeOrder() {
    if (placing) return;
    setPlacing(true);
    setErrors({});
    firstInvalidRef.current = null;

    const { ok, errs } = validate();
    if (!ok) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      if (el) {
        firstInvalidRef.current = el;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setPlacing(false);
      return;
    }

    // Normalized cart (robust)
    const normalizedCart = normalizeCart(items);

    // Capture simple marketing info (UTM, referrer)
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const params = url ? Object.fromEntries(url.searchParams.entries()) : {} as any;
    const marketing = {
      utmSource: params.utm_source || '',
      utmMedium: params.utm_medium || '',
      utmCampaign: params.utm_campaign || '',
      utmContent: params.utm_content || '',
      utmTerm: params.utm_term || '',
      gclid: params.gclid || '',
      fbclid: params.fbclid || '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      landingPage: url ? url.pathname + (url.search || '') : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    const orderData = {
      cart: normalizedCart,
      address,
      billing: {
        ...billing,
        ...(sameAsDelivery
          ? {
              judet: address.judet,
              localitate: address.localitate,
              strada_nr: address.strada_nr,
            }
          : {}),
      },
      marketing,
    };

    try {
      if (paymentMethod === "ramburs") {
        const res = await fetch("/api/order/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Eroare la crearea comenzii.");
        }
        window.location.href = "/checkout/success";
        return;
      }

      // Card: send normalizedCart to Stripe session endpoint
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok || !data?.clientSecret) {
        throw new Error(data?.error || "Nu s-a putut inițializa plata cu cardul.");
      }

      setShowEmbed(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe nu a putut fi inițializat.");

      const embeddedCheckout = await stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret,
      });
      embeddedCheckout.mount("#stripe-embedded");
    } catch (err: any) {
      console.error("[placeOrder] error:", err?.message || err);
      alert(err?.message || "A apărut o eroare. Reîncearcă.");
      setShowEmbed(false);
    } finally {
      setPlacing(false);
    }
  }

  function buildItemDetailsText(item: any) {
    const meta = item.metadata ?? {};
    const parts: string[] = [];
    // Size
    const width = item.width ?? item.width_cm ?? meta.width_cm ?? meta.width;
    const height = item.height ?? item.height_cm ?? meta.height_cm ?? meta.height;
    if (width || height) parts.push(`Dimensiune: ${width ?? "—"} x ${height ?? "—"} cm`);

    // Fonduri EU readable selection
    const isFonduri = (item?.slug === 'fonduri-eu') || (item?.productId === 'fonduri-eu');
    if (isFonduri && typeof meta.selectedReadable === 'string' && meta.selectedReadable.trim()) {
      parts.push(`Opțiuni selectate: ${meta.selectedReadable}`);
    }

    const labelForKey: Record<string, string> = {
      width: "Lățime (cm)", height: "Înălțime (cm)", width_cm: "Lățime (cm)", height_cm: "Înălțime (cm)",
      totalSqm: "Suprafață totală (m²)", sqmPerUnit: "m²/buc", pricePerSqm: "Preț pe m² (RON)",
      materialId: "Material", material: "Material", laminated: "Laminare", designOption: "Grafică",
      proDesignFee: "Taxă grafică Pro (RON)", want_adhesive: "Adeziv", want_hem_and_grommets: "Tiv și capse",
      want_wind_holes: "Găuri pentru vânt", shape_diecut: "Tăiere la contur", productType: "Tip panou",
      thickness_mm: "Grosime (mm)", sameGraphicFrontBack: "Aceeași grafică față/spate", framed: "Șasiu",
      sizeKey: "Dimensiune preset", mode: "Mod canvas", orderNotes: "Observații",
    };
    const prettyValue = (k: string, v: any) => {
      const yesNo = (x: any) => (typeof x === 'boolean' ? (x ? 'Da' : 'Nu') : String(x));
      if (k === 'materialId') return v === 'frontlit_510' ? 'Frontlit 510g' : v === 'frontlit_440' ? 'Frontlit 440g' : String(v);
      if (k === 'productType') return v === 'alucobond' ? 'Alucobond' : v === 'polipropilena' ? 'Polipropilenă' : v === 'pvc-forex' ? 'PVC Forex' : String(v);
      if (k === 'designOption') return v === 'pro' ? 'Pro' : v === 'upload' ? 'Am fișier' : v === 'text_only' ? 'Text' : String(v);
      if (k === 'framed' || typeof v === 'boolean') return yesNo(v);
      return String(v);
    };
    const exclude = new Set(["price","totalAmount","qty","quantity","artwork","artworkUrl","artworkLink","text","textDesign","selectedReadable","selections","title","name"]);
    Object.keys(meta).forEach((k) => {
      if (exclude.has(k)) return;
      if (!(k in labelForKey)) return; // only known keys to keep PDF concise
      if (k === 'proDesignFee') {
        const num = Number(meta[k]);
        if (!isFinite(num) || num <= 0) return;
      }
      const val = meta[k];
      if (val === null || val === undefined) return;
      if (typeof val === 'number' && val === 0) return;
      if (typeof val === 'string' && val.trim() === '') return;
      parts.push(`${labelForKey[k]}: ${prettyValue(k, val)}`);
    });
    return parts.join(" \u2022 "); // bullet separator
  }

  async function exportOfferPdf() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const fetchImageAsDataUrl = async (src: string) => {
      try {
        const res = await fetch(src, { cache: 'no-store' });
        const blob = await res.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch {
        return '';
      }
    };

    // Header with logo + company block
    const logoData = await fetchImageAsDataUrl('/logo.png');
    const headerY = margin;
    const logoSize = 64;
    if (logoData) {
      doc.addImage(logoData, 'PNG', margin, headerY, logoSize, logoSize);
    }

    const rightX = margin + logoSize + 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CULOAREA DIN VIATA SA SRL', rightX, headerY + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('CUI: 44820819', rightX, headerY + 36);
    doc.text('Nr. Reg. Com.: J2021001108100', rightX, headerY + 54);

    // Offer title + date aligned to the right
    const date = new Date().toLocaleDateString('ro-RO');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const title = 'Ofertă';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, pageWidth - margin - titleWidth, headerY + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const dateText = `Data: ${date}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - margin - dateWidth, headerY + 36);

    // Separator line
    doc.setDrawColor(230);
    doc.line(margin, headerY + logoSize + 16, pageWidth - margin, headerY + logoSize + 16);

    // Build table rows
    const rows = (items ?? []).map((it: any) => {
      const title = it.title ?? it.name ?? it.slug ?? 'Produs';
      const qty = Number(it.quantity ?? 1) || 1;
      const unit = Number(it.price ?? it.unitAmount ?? 0) || 0;
      const lineTotal = unit > 0 ? unit * qty : Number(it.totalAmount ?? 0) || 0;
      const details = buildItemDetailsText(it);
      return [title, details || '-', String(qty), unit ? unit.toFixed(2) : '-', lineTotal.toFixed(2)];
    });

    const startY = headerY + logoSize + 32;
    autoTable(doc, {
      startY,
      head: [["Produs", "Detalii", "Cant.", "Preț unitar (RON)", "Total (RON)"]],
      body: rows,
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 6, overflow: 'linebreak' },
      headStyles: { fillColor: [67, 56, 202], textColor: 255, halign: 'left' },
      bodyStyles: { valign: 'top' },
      tableWidth: pageWidth - margin * 2,
      columnStyles: {
        0: { cellWidth: 180 },
        1: { cellWidth: 250 },
        2: { halign: 'right', cellWidth: 50 },
        3: { halign: 'right', cellWidth: 90 },
        4: { halign: 'right', cellWidth: 90 },
      },
      didDrawPage: (data) => {
        // Optional: page footer with page numbers
        const page = doc.getNumberOfPages();
        const str = `Pagina ${page}`;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(130);
        doc.text(str, pageWidth - margin - doc.getTextWidth(str), pageHeight - 20);
      },
    });

    // Totals box (right aligned)
    const afterTableY = (doc as any).lastAutoTable?.finalY || startY;
    const fmtNum = (v: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(v);
    const boxWidth = 260;
    const boxX = pageWidth - margin - boxWidth;
    let y = afterTableY + 20;
    const boxHeight = 90;
    doc.setDrawColor(220);
    doc.setFillColor(248, 249, 251);
    doc.roundedRect(boxX, y, boxWidth, boxHeight, 6, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Rezumat', boxX + 12, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Produse: ${fmtNum(subtotal)}`, boxX + 12, y + 38);
    doc.text(`Livrare: ${fmtNum(costLivrare)}`, boxX + 12, y + 56);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${fmtNum(totalPlata)}`, boxX + 12, y + 76);

    // Footer note
    const noteY = y + boxHeight + 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('Oferta este valabilă 7 zile și nu reprezintă o factură fiscală.', margin, noteY);

    doc.save(`oferta-${date}.pdf`);
  }

  return (
  <main className="bg-ui min-h-screen">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Coșul tău</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportOfferPdf}
              disabled={(items ?? []).length === 0}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition disabled:opacity-60"
            >
              Exportă ofertă în PDF
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
            >
              Continuă cumpărăturile
            </a>
          </div>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <SummaryCard
                subtotal={subtotal}
                shipping={costLivrare}
                total={totalPlata}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onPlaceOrder={placeOrder}
                placing={placing}
              />
            </aside>

            <section className={`order-2 lg:order-1 lg:col-span-2 space-y-6 ${showEmbed ? "hidden" : ""}`}>
              <CartItems items={items} onRemove={removeItem} />

              <CheckoutForm
                address={address}
                setAddress={(updater) => setAddress((prev) => updater(prev))}
                billing={billing}
                setBilling={(updater) => setBilling((prev) => updater(prev))}
                sameAsDelivery={sameAsDelivery}
                setSameAsDelivery={setSameAsDelivery}
                errors={errors}
              />
            </section>
          </div>
        )}
      </div>

      {showEmbed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-950 p-4">
            <div className="mb-3 text-center text-muted">Finalizează plata în siguranță</div>
            <div id="stripe-embedded" />
            <div className="mt-3 text-center text-xs text-muted">
              După finalizare, vei fi redirecționat înapoi pentru confirmare.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyCart() {
  return (
  <div className="rounded-2xl border card-bg p-8 text-center text-ui">
      <h2 className="text-xl font-bold mb-2">Coșul tău este gol</h2>
  <p className="text-muted mb-6">Adaugă produse pentru a continua.</p>
      <a
        href="/"
  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition"
      >
        Continuă cumpărăturile
      </a>
    </div>
  );
}

function SummaryCard({
  subtotal,
  shipping,
  total,
  paymentMethod,
  setPaymentMethod,
  onPlaceOrder,
  placing,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "ramburs" | "card";
  setPaymentMethod: (v: "ramburs" | "card") => void;
  onPlaceOrder: () => void;
  placing: boolean;
}) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  return (
  <div className="lg:sticky lg:top-6 rounded-2xl border card-bg p-5 text-ui">
      <h2 className="text-xl font-bold mb-4">Sumar comandă</h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Produse</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted">
            <Truck size={16} className="text-muted" />
            Livrare
          </span>
          <span className="font-semibold">{fmt(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-ui font-semibold">Total</span>
          <span className="text-2xl font-extrabold">{fmt(total)}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex gap-3">
          <button
            onClick={() => setPaymentMethod("ramburs")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              paymentMethod === "ramburs" ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Ramburs
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              paymentMethod === "card" ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Card online
          </button>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={placing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
        >
          <ShieldCheck size={16} />
          {placing ? "Se procesează..." : "Plasează comanda"}
        </button>

  <p className="mt-2 text-[11px] text-muted text-center">
          Plata cu cardul este securizată. Pentru ramburs, plătești la curier.
        </p>
      </div>
    </div>
  );
}

function CartItems({ items, onRemove }: { items: Array<any> | undefined; onRemove: (id: string) => void }) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  // Map chei metadata -> etichete prietenoase
  const labelForKey: Record<string, string> = {
    width: "Lățime (cm)",
    height: "Înălțime (cm)",
    width_cm: "Lățime (cm)",
    height_cm: "Înălțime (cm)",
    totalSqm: "Suprafață totală (m²)",
    sqmPerUnit: "m²/buc",
    pricePerSqm: "Preț pe m² (RON)",
    materialId: "Material",
    material: "Material",
    laminated: "Laminare",
    designOption: "Grafică",
    proDesignFee: "Taxă grafică Pro (RON)",
    want_adhesive: "Adeziv",
    want_hem_and_grommets: "Tiv și capse",
    want_wind_holes: "Găuri pentru vânt",
    shape_diecut: "Tăiere la contur",
    productType: "Tip panou",
    thickness_mm: "Grosime (mm)",
    sameGraphicFrontBack: "Aceeași grafică față/spate",
    framed: "Șasiu",
    sizeKey: "Dimensiune preset",
    mode: "Mod canvas",
    orderNotes: "Observații",
  };

  function formatYesNo(v: any) {
    if (typeof v === "boolean") return v ? "Da" : "Nu";
    if (typeof v === "string") {
      const t = v.toLowerCase();
      if (["true", "da", "yes", "y", "1"].includes(t)) return "Da";
      if (["false", "nu", "no", "n", "0"].includes(t)) return "Nu";
    }
    return String(v);
  }

  function prettyValue(k: string, v: any) {
    if (k === "materialId") return v === "frontlit_510" ? "Frontlit 510g" : v === "frontlit_440" ? "Frontlit 440g" : String(v);
    if (k === "productType") return v === "alucobond" ? "Alucobond" : v === "polipropilena" ? "Polipropilenă" : v === "pvc-forex" ? "PVC Forex" : String(v);
    if (k === "designOption") return v === "pro" ? "Pro" : v === "upload" ? "Am fișier" : v === "text_only" ? "Text" : String(v);
    if (k === "framed") return formatYesNo(v);
    if (typeof v === "boolean") return formatYesNo(v);
    return String(v);
  }

  function renderDetails(item: any) {
    const meta = item.metadata ?? {};
    const details: Array<{ label: string; value: string }> = [];

    // Dimensiuni (dacă există la top-level sau în metadata)
    const width = item.width ?? item.width_cm ?? meta.width_cm ?? meta.width;
    const height = item.height ?? item.height_cm ?? meta.height_cm ?? meta.height;
    if (width || height) {
      details.push({ label: "Dimensiune", value: `${width ?? "—"} x ${height ?? "—"} cm` });
    }

    // Fonduri EU: afișăm sumarul opțiunilor configurate
    const isFonduri = (item?.slug === 'fonduri-eu') || (item?.productId === 'fonduri-eu');
    if (isFonduri && typeof meta.selectedReadable === 'string' && meta.selectedReadable.trim().length > 0) {
      details.push({ label: 'Opțiuni selectate', value: String(meta.selectedReadable) });
    }

    // Chei cunoscute
    const knownKeys = Object.keys(labelForKey).filter((k) => meta[k] !== undefined);
    knownKeys.forEach((k) => {
      // ascundem proDesignFee dacă e 0 sau falsy
      if (k === 'proDesignFee') {
        const num = Number(meta[k]);
        if (!isFinite(num) || num <= 0) return;
      }
      const label = labelForKey[k];
      const val = prettyValue(k, meta[k]);
      details.push({ label, value: val });
    });

    // Dacă avem sqm/prices non-duplicate
    ["sqmPerUnit", "totalSqm", "pricePerSqm"].forEach((k) => {
      if (!knownKeys.includes(k) && meta[k] !== undefined) {
        const label = (labelForKey as any)[k] || k;
        details.push({ label, value: String(meta[k]) });
      }
    });

    // Leftovers (exclude chei zgomotoase)
    const exclude = new Set([
      "price",
      "totalAmount",
      "qty",
      "quantity",
      "artwork",
      "artworkUrl",
      "artworkLink",
      "text",
      "textDesign",
      "selectedReadable",
      "selections",
      "title",
      "name",
    ]);
    Object.keys(meta)
      .filter((k) => !knownKeys.includes(k) && !exclude.has(k))
      .forEach((k) => {
        // ascundem valori 0 / goale și proDesignFee=0
        const v = meta[k];
        if (k === 'proDesignFee') {
          const num = Number(v);
          if (!isFinite(num) || num <= 0) return;
        }
        if (v === null || v === undefined) return;
        if (typeof v === 'number' && v === 0) return;
        if (typeof v === 'string' && v.trim() === '') return;
        details.push({ label: k, value: String(v) });
      });

    if (details.length === 0) return null;

    return (
      <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2 text-xs text-muted">
        {details.map((d, idx) => (
          <div key={idx} className="flex gap-2 py-0.5">
            <span className="opacity-80">{d.label}:</span>
            <span className="font-medium text-ui">{d.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
  <div className="rounded-2xl border card-bg p-4 text-ui">
      <h2 className="text-xl font-bold mb-4">Produsele tale</h2>
      <ul className="divide-y divide-white/10">
        {(items ?? []).map((item) => {
          // Support both shapes:
          // - current CartProvider: { id, title, price, quantity, metadata }
          // - legacy/other: { id, name, unitAmount, totalAmount, artworkUrl, textDesign }
          const title = item.title ?? item.name ?? item.slug ?? 'Produs';
          const qty = Number(item.quantity ?? 1) || 1;
          const unit = Number(item.price ?? item.unitAmount ?? 0) || 0;
          const lineTotal = unit > 0 ? unit * qty : Number(item.totalAmount ?? 0) || 0;
          return (
            <li key={item.id} className="py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold truncate pr-2">{title}</p>
                  <span className="text-muted text-sm">x{qty}</span>
                </div>
                {renderDetails(item)}
                <div className="mt-1 text-sm text-muted">
                  {/* detalii preț */}
                  <div className="mt-2">
                    <div className="text-xs text-muted">
                      {unit > 0 ? `Preț unitar: ${fmt(unit)}` : "Preț unitar: —"}
                    </div>
                    <div className="text-sm text-muted mt-1">{fmt(Number(lineTotal))}</div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-muted hover:bg-white/10"
                  aria-label="Elimină"
                  title="Elimină"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}