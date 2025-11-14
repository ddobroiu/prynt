"use client";

import { useEffect } from "react";
import JudetSelector from "../../components/JudetSelector";
import LocalitateSelector from "../../components/LocalitateSelector";

type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
};

type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  name?: string; // nume pentru facturare (PF)
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
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

  // 1) Sincronizare când “aceeași adresă” este bifat – evităm bucla infinită
  useEffect(() => {
    if (!sameAsDelivery) return;
    setBilling((b) => {
      const alreadySame =
        b.judet === address.judet &&
        b.localitate === address.localitate &&
        b.strada_nr === address.strada_nr &&
        b.postCode === address.postCode &&
        (b.name || "") === (address.nume_prenume || "");
      if (alreadySame) return b; // nu setează din nou => evită re-randări infinite
      return {
        ...b,
        name: address.nume_prenume,
        judet: address.judet,
        localitate: address.localitate,
        strada_nr: address.strada_nr,
        postCode: address.postCode,
      };
    });
  }, [sameAsDelivery, address.nume_prenume, address.judet, address.localitate, address.strada_nr, address.postCode, setBilling]);

  // 2) Copiere one-click când bifa e debifată (prefill fără a bloca editarea)
  function copyBillingFromDeliveryOnce() {
    setBilling((b) => ({
      ...b,
      name: address.nume_prenume,
      judet: address.judet,
      localitate: address.localitate,
      strada_nr: address.strada_nr,
      postCode: address.postCode,
    }));
  }

  return (
    <div className="space-y-6">
      {/* LIVRARE */}
  <div className="card p-4">
        <h2 className="text-xl font-bold mb-3">Date livrare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id="address.nume_prenume" label="Nume și prenume" error={errors["address.nume_prenume"]}>
            <input
              data-field="address.nume_prenume"
              className={inputCls(errors["address.nume_prenume"])}
              value={address.nume_prenume}
              onChange={(e) => onAddr("nume_prenume", e.target.value)}
              autoComplete="section-shipping name"
            />
          </Field>

          <Field id="address.telefon" label="Telefon" error={errors["address.telefon"]}>
            <input
              data-field="address.telefon"
              className={inputCls(errors["address.telefon"])}
              value={address.telefon}
              onChange={(e) => onAddr("telefon", e.target.value)}
              autoComplete="section-shipping tel"
              inputMode="tel"
            />
          </Field>

          <Field id="address.email" label="Email" error={errors["address.email"]}>
            <input
              data-field="address.email"
              className={inputCls(errors["address.email"])}
              value={address.email}
              onChange={(e) => onAddr("email", e.target.value)}
              autoComplete="section-shipping email"
              inputMode="email"
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

          <div>
            <LocalitateSelector
              judet={address.judet}
              value={address.localitate}
              onChange={(v) => onAddr("localitate", v)}
              onPostCodeChange={(pc) => onAddr("postCode", pc)}
              label="Localitate"
            />
            {errors["address.localitate"] && <p className="mt-1 text-xs text-red-400">{errors["address.localitate"]}</p>}
          </div>

          <Field id="address.strada_nr" label="Stradă, nr." error={errors["address.strada_nr"]}>
            <input
              data-field="address.strada_nr"
              className={inputCls(errors["address.strada_nr"])}
              value={address.strada_nr}
              onChange={(e) => onAddr("strada_nr", e.target.value)}
              autoComplete="section-shipping street-address"
            />
          </Field>

          <Field id="address.postCode" label="Cod poștal">
            <input
              data-field="address.postCode"
              className={inputCls(undefined)}
              value={address.postCode ?? ""}
              onChange={(e) => onAddr("postCode", e.target.value)}
              autoComplete="postal-code"
              inputMode="numeric"
            />
          </Field>
        </div>
      </div>

      {/* FACTURARE */}
  <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Facturare</h2>

          {billing.tip_factura === 'persoana_fizica' && (
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="flex select-none items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sameAsDelivery}
                  onChange={(e) => setSameAsDelivery(e.target.checked)}
                />
                <span className="text-muted">Adresa de facturare este aceeași</span>
              </label>

              {!sameAsDelivery && (
                <button
                  type="button"
                  onClick={copyBillingFromDeliveryOnce}
                  className="rounded-md border border-[--border] bg-surface px-3 py-1.5 text-xs font-semibold text-ui hover:bg-white/10 transition"
                  title="Completează câmpurile de mai jos cu adresa de livrare"
                >
                  Completează automat din livrare
                </button>
              )}
            </div>
          )}
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
            <Field id="billing.cui" label="CUI/CIF" error={errors["billing.cui"]}>
              <input
                data-field="billing.cui"
                className={inputCls(errors["billing.cui"])}
                value={billing.cui ?? ""}
                onChange={(e) => onBill("cui", e.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field id="billing.denumire_companie" label="Denumire companie (opțional)">
              <input
                className={inputCls(undefined)}
                value={billing.denumire_companie ?? ""}
                onChange={(e) => onBill("denumire_companie", e.target.value)}
                autoComplete="organization"
              />
            </Field>
          </div>
        )}

        {/* Adresă facturare (dezactivată dacă e “aceeași”) */}
        {billing.tip_factura === 'persoana_fizica' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field id="billing.name" label="Nume pentru facturare (PF)" error={errors["billing.name"]} disabled={sameAsDelivery}>
            <input
              data-field="billing.name"
              className={inputCls(errors["billing.name"], sameAsDelivery)}
              value={billing.name ?? ""}
              onChange={(e) => onBill("name", e.target.value)}
              disabled={sameAsDelivery}
              autoComplete="section-billing name"
            />
          </Field>
          <div data-field="billing.judet" className={sameAsDelivery ? "opacity-60" : ""}>
            <JudetSelector
              label="Județ (facturare)"
              value={billing.judet ?? ""}
              onChange={(v) => onBill("judet", v)}
              disabled={sameAsDelivery}
            />
            {errors["billing.judet"] && <p className="mt-1 text-xs text-red-400">{errors["billing.judet"]}</p>}
          </div>

          <div className={sameAsDelivery ? "opacity-60" : ""}>
            <LocalitateSelector
              judet={billing.judet ?? ""}
              value={billing.localitate ?? ""}
              onChange={(v) => onBill("localitate", v)}
              onPostCodeChange={(pc) => onBill("postCode", pc)}
              label="Localitate (facturare)"
              disabled={sameAsDelivery}
            />
            {errors["billing.localitate"] && <p className="mt-1 text-xs text-red-400">{errors["billing.localitate"]}</p>}
          </div>

          <Field id="billing.strada_nr" label="Stradă, nr. (facturare)" error={errors["billing.strada_nr"]} disabled={sameAsDelivery}>
            <input
              data-field="billing.strada_nr"
              className={inputCls(errors["billing.strada_nr"], sameAsDelivery)}
              value={billing.strada_nr ?? ""}
              onChange={(e) => onBill("strada_nr", e.target.value)}
              disabled={sameAsDelivery}
              autoComplete="section-billing street-address"
            />
          </Field>
        </div>
        )}

        {billing.tip_factura === 'persoana_fizica' && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field id="billing.postCode" label="Cod poștal (facturare)" disabled={sameAsDelivery}>
              <input
                data-field="billing.postCode"
                className={inputCls(undefined, sameAsDelivery)}
                value={billing.postCode ?? ""}
                onChange={(e) => onBill("postCode", e.target.value)}
                disabled={sameAsDelivery}
                autoComplete="postal-code"
                inputMode="numeric"
              />
            </Field>
          </div>
        )}
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
  <span className="mb-1 block text-ui">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}

function inputCls(hasError?: string, disabled?: boolean) {
  const base =
    "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 bg-surface border-[--border] text-ui focus:ring-indigo-500/40";
  return `${base} ${hasError ? "border-red-500/70 ring-1 ring-red-500/40" : ""} ${
    disabled ? "opacity-60" : ""
  }`;
}