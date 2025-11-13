"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Localitate = { id: number; name: string; municipality?: string; region?: string; postCode?: string };

type Props = {
  judet: string;
  value: string;
  onChange: (v: string) => void;
  onPostCodeChange?: (pc: string) => void;
  label?: string;
  disabled?: boolean;
};

export default function LocalitateSelector({ judet, value, onChange, onPostCodeChange, label = "Localitate", disabled }: Props) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Localitate[]>([]);
  const [loading, setLoading] = useState(false);
  const lastJudet = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!judet) { setItems([]); return; }
      setLoading(true);
      try {
        const params = new URLSearchParams({ judet });
        if (q.trim()) params.set('q', q.trim());
        const res = await fetch(`/api/dpd/localitati?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (!cancelled && data?.ok && Array.isArray(data.localitati)) {
          setItems(data.localitati as Localitate[]);
        }
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [judet, q]);

  // când se schimbă județul, resetăm căutarea și valoarea selectată
  useEffect(() => {
    if (lastJudet.current !== judet) {
      setQ("");
      onChange("");
      onPostCodeChange?.("");
      lastJudet.current = judet;
    }
  }, [judet]);

  const displayItems = useMemo(() => items, [items]);
  const selected = useMemo(() => displayItems.find(i => i.name === value) || null, [displayItems, value]);

  useEffect(() => {
    if (selected?.postCode) onPostCodeChange?.(selected.postCode);
  }, [selected?.postCode]);

  return (
    <div className="text-sm">
      <label className="block">
        <span className="field-label">{label}</span>
        <input
          className="input w-full mb-1"
          placeholder="Caută localitate..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={!judet || disabled}
        />
        <select
          className="select disabled:opacity-60 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!judet || disabled || loading}
        >
          <option value="" disabled>— selectează o localitate —</option>
          {displayItems.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}{loc.postCode ? ` (CP ${loc.postCode})` : ""}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
