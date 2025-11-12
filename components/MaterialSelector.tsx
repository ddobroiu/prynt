"use client";
import React from "react";
import type { MaterialOption } from "@/lib/products";

type MaterialSelectorProps = {
  materials: MaterialOption[];
  value?: string;
  onChange?: (v: string) => void;
};

export default function MaterialSelector({ materials, value, onChange }: MaterialSelectorProps) {
  return (
    <div>
      <label className="field-label">Material</label>
      <div className="grid grid-cols-1 gap-2">
        {materials.map((m) => {
          // ensure we always pass a string to onChange: use m.id (guaranteed string)
          const id = m.id ?? (m.key ?? "");
          return (
            <button
              key={id}
              onClick={() => onChange?.(id)}
              className={`p-3 rounded-md text-left border ${value === id ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}
              type="button"
              aria-pressed={value === id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ui">{m.label}</div>
                  {m.description && <div className="text-xs text-muted mt-1">{m.description}</div>}
                </div>
                {typeof m.priceModifier === "number" ? (
                  <div className="text-sm text-muted">{m.priceModifier > 0 ? `+${Math.round(m.priceModifier * 100)}%` : ""}</div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}