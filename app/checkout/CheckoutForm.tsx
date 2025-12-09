"use client";

import { useEffect } from "react";
import Link from "next/link"; 
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
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
};

type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  name?: string;
  email?: string;
  telefon?: string;
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
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

  // 1) Sincronizare când “aceeași adresă” este bifat
  useEffect(() => {
    if (!sameAsDelivery) return;
    setBilling((b) => {
      const alreadySame =
        b.judet === address.judet &&
        b.localitate === address.localitate &&
        b.strada_nr === address.strada_nr &&
        b.postCode === address.postCode &&
        (b.name || "") === (address.nume_prenume || "");
      if (alreadySame) return b;
      return {
        ...b,
        name: address.nume_prenume,
        judet: address.judet,
        localitate: address.localitate,
        strada_nr: address.strada_nr,
        postCode: address.postCode,
      };
    });
  }, [sameAsDelivery, address.nume_prenume, address.judet, address.localitate, address.strada_nr, address.postCode]);

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
      <div className="card p-4 border border-[--border] bg-surface rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-ui">Date livrare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Field id="address.strada_nr" label="Adresă" error={errors["address.strada_nr"]}>
            <input
              data-field="address.strada_nr"
              className={inputCls(errors["address.strada_nr"])}
              value={address.strada_nr}
              onChange={(e) => onAddr("strada_nr", e.target.value)}
              autoComplete="section-shipping street-address"
              placeholder="Stradă, număr, bloc, sc., etaj, ap."
            />
          </Field>
          
          <Field id="address.postCode" label="Cod poștal">
            <div className="md:w-32">
              <input
                data-field="address.postCode"
                className={inputCls(undefined)}
                value={address.postCode ?? ""}
                onChange={(e) => onAddr("postCode", e.target.value)}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="000000"
              />
            </div>
          </Field>
        </div>
      </div>



      {/* FACTURARE */}
      <div className="card p-4 border border-[--border] bg-surface rounded-xl shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-bold text-ui">Facturare</h2>

          {billing.tip_factura === 'persoana_fizica' && (
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="flex select-none items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsDelivery}
                  onChange={(e) => setSameAsDelivery(e.target.checked)}
                  className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-600 bg-slate-800"
                />
                <span className="text-muted">Aceeași cu livrarea</span>
              </label>

              {!sameAsDelivery && (
                <button
                  type="button"
                  onClick={copyBillingFromDeliveryOnce}
                  className="rounded-md border border-[--border] bg-white/5 px-3 py-1.5 text-xs font-semibold text-ui hover:bg-white/10 transition"
                >
                  Copiază din livrare
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tip facturare */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => onBill("tip_factura", "persoana_fizica")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border transition-colors ${
              billing.tip_factura === "persoana_fizica"
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                : "border-[--border] bg-white/5 hover:bg-white/10 text-muted"
            }`}
          >
            Persoană fizică
          </button>
          <button
            type="button"
            onClick={() => onBill("tip_factura", "persoana_juridica")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border transition-colors ${
              billing.tip_factura === "persoana_juridica"
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                : "border-[--border] bg-white/5 hover:bg-white/10 text-muted"
            }`}
          >
            Persoană juridică
          </button>
        </div>

        {/* Date companie - câmpuri minime pentru Oblio */}
        {billing.tip_factura === "persoana_juridica" && (
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-4 mb-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date pentru factură</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="billing.cui" label="CUI/CIF *" error={errors["billing.cui"]}>
                <input
                  data-field="billing.cui"
                  className={inputCls(errors["billing.cui"])}
                  value={billing.cui ?? ""}
                  onChange={(e) => onBill("cui", e.target.value)}
                  autoComplete="off"
                  placeholder="RO12345678"
                />
              </Field>
              <Field id="billing.denumire_companie" label="Denumire companie *" error={errors["billing.denumire_companie"]}>
                <input
                  className={inputCls(errors["billing.denumire_companie"])}
                  value={billing.denumire_companie ?? ""}
                  onChange={(e) => onBill("denumire_companie", e.target.value)}
                  autoComplete="organization"
                  placeholder="Numele companiei cum apare în actele oficiale"
                />
              </Field>
              <Field id="billing.email" label="Email companie *" error={errors["billing.email"]}>
                <input
                  data-field="billing.email"
                  type="email"
                  className={inputCls(errors["billing.email"])}
                  value={billing.email ?? ""}
                  onChange={(e) => onBill("email", e.target.value)}
                  autoComplete="section-billing email"
                  placeholder="contact@companie.ro"
                />
              </Field>
              <Field id="billing.telefon" label="Telefon companie *" error={errors["billing.telefon"]}>
                <input
                  data-field="billing.telefon"
                  type="tel"
                  className={inputCls(errors["billing.telefon"])}
                  value={billing.telefon ?? ""}
                  onChange={(e) => onBill("telefon", e.target.value)}
                  autoComplete="section-billing tel"
                  placeholder="0712345678"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Adresă facturare pentru persoane fizice */}
        {!sameAsDelivery && billing.tip_factura === 'persoana_fizica' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                <div className="md:col-span-2">
                  <Field id="billing.name" label="Nume pe factură" error={errors["billing.name"]}>
                    <input
                      data-field="billing.name"
                      className={inputCls(errors["billing.name"])}
                      value={billing.name ?? ""}
                      onChange={(e) => onBill("name", e.target.value)}
                      autoComplete="section-billing name"
                    />
                  </Field>
                </div>
                
                <Field id="billing.email" label="Email (facturare) *" error={errors["billing.email"]}>
                  <input
                    data-field="billing.email"
                    type="email"
                    className={inputCls(errors["billing.email"])}
                    value={billing.email ?? ""}
                    onChange={(e) => onBill("email", e.target.value)}
                    autoComplete="section-billing email"
                    placeholder="email@exemplu.ro"
                  />
                </Field>
                
                <Field id="billing.telefon" label="Telefon (facturare) *" error={errors["billing.telefon"]}>
                  <input
                    data-field="billing.telefon"
                    type="tel"
                    className={inputCls(errors["billing.telefon"])}
                    value={billing.telefon ?? ""}
                    onChange={(e) => onBill("telefon", e.target.value)}
                    autoComplete="section-billing tel"
                    placeholder="0712345678"
                  />
                </Field>

             <div data-field="billing.judet">
                <JudetSelector
                  label="Județ (facturare)"
                  value={billing.judet ?? ""}
                  onChange={(v) => onBill("judet", v)}
                />
                {errors["billing.judet"] && <p className="mt-1 text-xs text-red-400">{errors["billing.judet"]}</p>}
             </div>

             <div>
                <LocalitateSelector
                  judet={billing.judet ?? ""}
                  value={billing.localitate ?? ""}
                  onChange={(v) => onBill("localitate", v)}
                  onPostCodeChange={(pc) => onBill("postCode", pc)}
                  label="Localitate (facturare)"
                />
                {errors["billing.localitate"] && <p className="mt-1 text-xs text-red-400">{errors["billing.localitate"]}</p>}
             </div>

             <div className="md:col-span-2">
                <Field id="billing.strada_nr" label="Adresă (facturare)" error={errors["billing.strada_nr"]}>
                  <input
                    data-field="billing.strada_nr"
                    className={inputCls(errors["billing.strada_nr"])}
                    value={billing.strada_nr ?? ""}
                    onChange={(e) => onBill("strada_nr", e.target.value)}
                    autoComplete="section-billing street-address"
                    placeholder="Adresa completă pentru facturare..."
                  />
                </Field>
             </div>
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
    <label htmlFor={id} className={`text-sm block ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
      <span className="mb-1 block font-medium text-ui">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}

function inputCls(hasError?: string, disabled?: boolean) {
  const base =
    "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 bg-black/20 text-white border-white/10 focus:ring-indigo-500/50 placeholder-gray-500 transition-all";
  return `${base} ${hasError ? "border-red-500/50 ring-1 ring-red-500/20" : ""} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;
}