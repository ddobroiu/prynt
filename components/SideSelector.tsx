"use client";
import React from "react";

export default function SideSelector({ value, onChange }: { value: "single" | "double"; onChange: (v: "single" | "double") => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label>Față / Verso</label>
      <select value={value} onChange={(e) => onChange(e.target.value as "single" | "double")} style={{ marginLeft: 8 }}>
        <option value="single">Față (single)</option>
        <option value="double">Față + Verso</option>
      </select>
    </div>
  );
}