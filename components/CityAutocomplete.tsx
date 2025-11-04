'use client';

import { useEffect, useRef, useState } from 'react';

type Item = { city: string; county?: string; postalCode?: string };

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Localitate',
}: {
  value: string;
  onChange: (v: { city: string; county?: string; postalCode?: string }) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(value ?? '');
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (q.trim().length < 2) {
        setItems([]);
        return;
      }
      const res = await fetch(`/api/dpd/localities?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setOpen(true);
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <input
        className="border rounded-lg px-3 py-2 w-full"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
      />
      {open && items.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto bg-white border rounded-md shadow">
          {items.map((it, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQ(it.city);
                setOpen(false);
                onChange(it);
              }}
              className="w-full text-left px-3 py-2 hover:bg-neutral-100"
            >
              <div className="font-medium">{it.city}</div>
              <div className="text-xs text-neutral-600">
                {it.county ? `Județ: ${it.county}` : ''} {it.postalCode ? `• CP: ${it.postalCode}` : ''}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
