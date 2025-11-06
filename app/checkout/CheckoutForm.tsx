"use client";

import JudetSelector from "../../components/JudetSelector";

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

export default function CheckoutForm({
  address,
  setAddress,
  billing,
  setBilling,
  sameAsDelivery,
  setSameAsDelivery,
  errors,
}: {
  address: Address;
  setAddress: (updater: (a: Address) => Address) => void;
  billing: Billing;
  setBilling: (updater: (b: Billing) => Billing) => void;
  sameAsDelivery: boolean;
  setSameAsDelivery: (v: boolean) => void;
  errors: Record<string, string>;
}) {
  const onAddr = (k: keyof Address, v: string) => setAddress((a) => ({ ...a, [k]: v }));
  const onBill = <K extends keyof Billing>(k: K, v: Billing[K]) => setBilling((b) => ({ ...b, [k]: v }));

  return (
    <div className="space-y-6">
      {/* LIVRARE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-bold mb-3">Date livrare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id="address.nume_prenume" label="Nume și prenume" error={errors["address.nume_prenume"]}>
            <input
              data-field="address.nume_prenume"
              className={inputCls(errors["address.nume_prenume"])}
              value={address.nume_prenume}
              onChange={(e) => onAddr("nume_prenume", e.target.value)}
            />
          </Field>

          <Field id="address.telefon" label="Telefon" error={errors["address.telefon"]}>
            <input
              data-field="address.telefon"
              className={inputCls(errors["address.telefon"])}
              value={address.telefon}
              onChange={(e) => onAddr("telefon", e.target.value)}
            />
          </Field>

          <Field id="address.email" label="Email" error={errors["address.email"]}>
            <input
              data-field="address.email"
              className={inputCls(errors["address.email"])}
              value={address.email}
              onChange={(e) => onAddr("email", e.target.value)}
            />
          </Field>

          <div data-field="address.judet">
            <JudetSelector
              label="Județ"
              value={address.judet}
              onChange={(v) => onAddr("judet", v)}
            />
            {errors["address.judet"] && <p className="mt-1 text-xs text-red-400">{errors["address.judet"]}</p>}
          </div>

          <Field id="address.localitate" label="Localitate" error={errors["address.localitate"]}>
            <input
              data-field="address.localitate"
              className={inputCls(errors["address.localitate"])}
              value={address.localitate}
              onChange={(e) => onAddr("localitate", e.target.value)}
            />
          </Field>

          <Field id="address.strada_nr" label="Stradă, nr." error={errors["address.strada_nr"]}>
            <input
              data-field="address.strada_nr"
              className={inputCls(errors["address.strada_nr"])}
              value={address.strada_nr}
              onChange={(e) => onAddr("strada_nr", e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* FACTURARE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Facturare</h2>
          <label className="flex select-none items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sameAsDelivery}
              onChange={(e) => setSameAsDelivery(e.target.checked)}
            />
            <span className="text-white/80">Adresa de facturare este aceeași</span>
          </label>
        </div>

        {/* Tip facturare */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onBill("tip_factura", "persoana_fizica")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              billing.tip_factura === "persoana_fizica"
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Persoană fizică
          </button>
          <button
            type="button"
            onClick={() => onBill("tip_factura", "persoana_juridica")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              billing.tip_factura === "persoana_juridica"
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Persoană juridică
          </button>
        </div>

        {/* Date companie (vizibile doar pentru juridică) */}
        {billing.tip_factura === "persoana_juridica" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field id="billing.denumire_companie" label="Denumire companie" error={errors["billing.denumire_companie"]}>
              <input
                data-field="billing.denumire_companie"
                className={inputCls(errors["billing.denumire_companie"])}
                value={billing.denumire_companie ?? ""}
                onChange={(e) => onBill("denumire_companie", e.target.value)}
              />
            </Field>
            <Field id="billing.cui" label="CUI/CIF" error={errors["billing.cui"]}>
              <input
                data-field="billing.cui"
                className={inputCls(errors["billing.cui"])}
                value={billing.cui ?? ""}
                onChange={(e) => onBill("cui", e.target.value)}
              />
            </Field>
            <Field id="billing.reg_com" label="Nr. Reg. Com. (opțional)">
              <input
                className={inputCls(undefined)}
                value={billing.reg_com ?? ""}
                onChange={(e) => onBill("reg_com", e.target.value)}
              />
            </Field>
          </div>
        )}

        {/* Adresă facturare (dezactivată dacă e “aceeași”) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div data-field="billing.judet" className={sameAsDelivery ? "opacity-60" : ""}>
            <JudetSelector
              label="Județ (facturare)"
              value={billing.judet ?? ""}
              onChange={(v) => onBill("judet", v)}
              disabled={sameAsDelivery}
            />
            {errors["billing.judet"] && <p className="mt-1 text-xs text-red-400">{errors["billing.judet"]}</p>}
          </div>

          <Field id="billing.localitate" label="Localitate (facturare)" error={errors["billing.localitate"]} disabled={sameAsDelivery}>
            <input
              data-field="billing.localitate"
              className={inputCls(errors["billing.localitate"], sameAsDelivery)}
              value={billing.localitate ?? ""}
              onChange={(e) => onBill("localitate", e.target.value)}
              disabled={sameAsDelivery}
            />
          </Field>

          <Field id="billing.strada_nr" label="Stradă, nr. (facturare)" error={errors["billing.strada_nr"]} disabled={sameAsDelivery}>
            <input
              data-field="billing.strada_nr"
              className={inputCls(errors["billing.strada_nr"], sameAsDelivery)}
              value={billing.strada_nr ?? ""}
              onChange={(e) => onBill("strada_nr", e.target.value)}
              disabled={sameAsDelivery}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
  disabled,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label htmlFor={id} className={`text-sm block ${disabled ? "opacity-60" : ""}`}>
      <span className="mb-1 block text-white/70">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}

function inputCls(hasError?: string, disabled?: boolean) {
  const base =
    "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 bg-gray-900/40 border-white/10 focus:ring-indigo-500/40";
  return `${base} ${hasError ? "border-red-500/70 ring-1 ring-red-500/40" : ""} ${
    disabled ? "opacity-60" : ""
  }`;
}