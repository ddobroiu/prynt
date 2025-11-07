"use client";
import React, { useEffect, useState } from "react";

export default function GraphicUpload({ onChange, initialPreview }: { onChange: (file: File | null, previewUrl?: string | null) => void; initialPreview?: string }) {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);

  useEffect(() => {
    return () => {
      // cleanup object URLs if created
    };
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setPreview(initialPreview ?? null);
      onChange(null, initialPreview ?? null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
    onChange(f, url);
  }

  return (
    <div style={{ marginTop: 12 }}>
      <label>Încarcă grafică (opțional)</label>
      <input type="file" accept="image/*,application/pdf" onChange={handleFile} style={{ display: "block", marginTop: 8 }} />
      {preview && <div style={{ marginTop: 8 }}><img src={preview} alt="preview" style={{ maxWidth: 240 }} /></div>}
    </div>
  );
}