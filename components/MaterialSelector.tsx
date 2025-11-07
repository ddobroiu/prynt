"use client";
import React from "react";
import type { MaterialOption } from "@/lib/products";

export default function MaterialSelector({ materials, value, onChange }: { materials: MaterialOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", marginBottom: 6 }}>Material</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
        {materials.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}