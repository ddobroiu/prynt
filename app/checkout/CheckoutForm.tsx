"use client";

import { useEffect } from "react";
import JudetSelector from "../../components/JudetSelector";
import { Address, Billing } from "../../types";

export default function CheckoutForm({
  address,
  setAddress,
  billing,
  setBilling,
  sameAsDelivery,
  setSameAsDelivery,
}: {
  address: Address;
  setAddress: (updater: (a: Address) => Address) => void;
  billing: Billing;
  setBilling: (updater: (b: Billing) => Billing) => void;
  sameAsDelivery: boolean;
  setSameAsDelivery: (v: boolean) => void;
}) {
  // când bifa e activă, sincronizează adresa de facturare cu livrarea
  useEffect(() => {
    if (sameAsDelivery) {
      setBilling((b) => ({
        ...b,
        judet: address.judet,
        localitate: address.localitate,
        strada_nr: address.strada_nr,
      }));
    }
  }, [sameAsDelivery, address.judet, address.localitate, address.strada_nr, setBilling]);

  const onAddr = (k: keyof Address, v: string) => setAddress((a) => ({ ...a, [k]: v }));
  const onBill = <K extends keyof Billing>(k: K, v: Billing[K]) => setBilling((b) => ({ ...b, [k]: v }));

  return (
    <div className="space-y-6">
      {/* LIVRARE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-bold mb-3">Date livrare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Nume și prenume" value={address.nume_prenume} onChange={(v) => onAddr("nume_prenume", v)} />
          <Input label="Telefon" value={address.telefon} onChange={(v) => onAddr("telefon", v)} />
          <Input label="Email" value={address.email} onChange={(v) => onAddr("email", v)} />
          <JudetSelector label="Județ" value={address.judet} onChange={(v) => onAddr("judet", v)} />
          <Input label="Localitate" value={address.localitate} onChange={(v) => onAddr("localitate", v)} />
          <Input label="Stradă, nr." value={address.strada_nr} onChange={(v) => onAddr("strada_nr", v)} />
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
            <span className="text-white/80">Adresa de facturare este aceeași cu adresa de livrare</span>
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
            <Input
              label="Denumire companie"
              value={billing.denumire_companie ?? ""}
              onChange={(v) => onBill("denumire_companie", v)}
            />
            <Input
              label="CUI/CIF"
              value={billing.cui ?? ""}
              onChange={(v) => onBill("cui", v)}
            />
            <Input
              label="Nr. Reg. Com. (opțional)"
              value={billing.reg_com ?? ""}
              onChange={(v) => onBill("reg_com", v)}
            />
          </div>
        )}

        {/* Adresă facturare (dezactivată dacă e “aceeași”) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <JudetSelector
            label="Județ (facturare)"
            value={billing.judet ?? ""}
            onChange={(v) => onBill("judet", v)}
            disabled={sameAsDelivery}
          />
          <Input
            label="Localitate (facturare)"
            value={billing.localitate ?? ""}
            onChange={(v) => onBill("localitate", v)}
            disabled={sameAsDelivery}
          />
          <Input
            label="Stradă, nr. (facturare)"
            value={billing.strada_nr ?? ""}
            onChange={(v) => onBill("strada_nr", v)}
            disabled={sameAsDelivery}
          />
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="text-sm block">
      <span className="mb-1 block text-white/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-white/10 bg-gray-900/40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
      />
    </label>
  );
}