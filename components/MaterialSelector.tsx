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
        {materials.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange?.(m.key)}
            className={`p-3 rounded-md text-left border ${value === m.key ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}
            type="button"
            aria-pressed={value === m.key}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{m.label}</div>
                {m.description && <div className="text-xs text-white/60 mt-1">{m.description}</div>}
              </div>
              {m.priceModifier ? <div className="text-sm text-white/80">+{(m.priceModifier * 100).toFixed(0)}%</div> : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}