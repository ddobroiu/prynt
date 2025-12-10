"use client";
import { useEffect, useMemo, useState } from "react";

type EtaResponse = {
  ok: boolean;
  county: string;
  minDate: string;
  maxDate: string;
  label: string;
  codAvailable: boolean;
};

type Props = {
  county?: string;
  className?: string;
  shippingFrom?: number;
  showCod?: boolean; // show COD badge
  showShippingFrom?: boolean; // show "de la XX RON" badge
  variant?: "default" | "minimal" | "text"; // text: inline, one-line, no pill
  icon?: string; // emoji/icon to display in minimal variant
  size?: "xs" | "sm" | "md";
};

export default function DeliveryInfo({ county, className = "", shippingFrom, showCod = true, showShippingFrom = true, variant = "default", icon = "🚚", size = "sm" }: Props) {
  const [data, setData] = useState<EtaResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => new URLSearchParams({ county: county || "" }).toString(), [county]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/eta?${query}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const label = data?.label || "1–2 zile lucrătoare";
  const badge = data?.codAvailable ? "COD disponibil" : "COD indisponibil";
  const fmt = useMemo(() => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format, []);
  const shipText = typeof shippingFrom === "number" ? `de la ${fmt(shippingFrom)}` : undefined;

  if (variant === "text") {
    const sizeCls = size === 'xs' ? 'text-[11px]' : size === 'md' ? 'text-sm' : 'text-xs';
    return (
      <span className={`whitespace-nowrap ${sizeCls} text-black dark:text-white ${className}`}>
        Livrare estimată: {loading ? "Se calculează…" : label}
      </span>
    );
  }

  if (variant === "minimal") {
    const sizeCls = size === 'xs' ? 'text-[11px] px-2.5 py-1' : size === 'md' ? 'text-sm px-3 py-1.5' : 'text-xs px-3 py-1.5';
    return (
      <div
        className={
          `inline-flex items-center gap-2 rounded-full border ${sizeCls} ${className} ` +
          // Light theme styles
          `border-indigo-500/30 bg-indigo-50 text-indigo-700 ` +
          // Dark theme overrides
          `dark:bg-indigo-900/30 dark:text-indigo-100`
        }
      >
        <span aria-hidden>{icon}</span>
        <span className="opacity-80 dark:opacity-90">Livrare estimată:</span>
        <span className="font-semibold text-indigo-900 dark:text-white">{loading ? "Se calculează…" : label}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 text-sm bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-600/10 dark:bg-green-600/20 text-green-700 dark:text-green-400">✓</span>
        <div className="leading-tight">
          <div className="font-medium text-slate-900 dark:text-white">Livrare estimată</div>
          <div className="text-slate-600 dark:text-slate-400">{loading ? "Se calculează…" : label}</div>
        </div>
      </div>
      {shipText && showShippingFrom && (
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-300 font-medium">{shipText}</span>
          </div>
        )}
    </div>
  );
}
