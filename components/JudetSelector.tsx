"use client";
import { useEffect, useMemo, useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  disabled?: boolean;
};

const DEFAULT_JUDETE = [
  "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani","Brasov","Braila",
  "Bucuresti","Buzau","Caras-Severin","Calarasi","Cluj","Constanta","Covasna","Dambovita",
  "Dolj","Galati","Giurgiu","Gorj","Harghita","Hunedoara","Ialomita","Iasi","Ilfov",
  "Maramures","Mehedinti","Mures","Neamt","Olt","Prahova","Satu Mare","Salaj","Sibiu",
  "Suceava","Teleorman","Timis","Tulcea","Vaslui","Valcea","Vrancea",
];

export default function JudetSelector({ label = "Județ", value, onChange, options, disabled }: Props) {
  const [remote, setRemote] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (options && options.length) return; // caller-provided list has priority
      setLoading(true);
      try {
        const res = await fetch("/api/dpd/judete", { cache: "force-cache" });
        const data = await res.json().catch(() => null);
        if (!cancelled && data?.ok && Array.isArray(data.judete)) {
          setRemote(data.judete as string[]);
        }
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [options]);

  const list = useMemo(() => {
    if (options && Array.isArray(options) && options.length) return options;
    if (remote && remote.length) return remote;
    return DEFAULT_JUDETE;
  }, [options, remote]);

  return (
    <label className="text-sm block">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="select disabled:opacity-60"
      >
        <option value="" disabled>— selectează un județ —</option>
        {list.map((judet) => (
          <option key={judet} value={judet}>{judet}</option>
        ))}
      </select>
    </label>
  );
}