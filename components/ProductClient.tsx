"use client";
import React, { useState } from "react";
import DimensionEditor from "./DimensionEditor";
import MaterialSelector from "./MaterialSelector";
import SideSelector from "./SideSelector";
import GraphicUpload from "./GraphicUpload";
import type { Product } from "@/lib/products";
import { useCart } from "./CartContext";

type Props = { product: Product; initialWidth?: number; initialHeight?: number };

export default function ProductClient({ product, initialWidth, initialHeight }: Props) {
  const { addItem } = useCart();
  const [materialId, setMaterialId] = useState<string>(product.materials?.[0]?.id ?? "");
  const [side, setSide] = useState<"single" | "double">("single");
  const [width, setWidth] = useState<number>(initialWidth ?? Math.max(product.minWidthCm, 120));
  const [height, setHeight] = useState<number>(initialHeight ?? Math.max(product.minHeightCm, 60));
  const [price, setPrice] = useState<number | null>(null);
  const [graphicFile, setGraphicFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    try {
      const res = await fetch("/api/calc-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widthCm: width, heightCm: height, slug: product.slug, materialId, side }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPrice(data.price);
      } else {
        alert(data.message || "Eroare calcul");
      }
    } catch (e) {
      alert("Eroare rețea");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(file: File | null, url?: string | null) {
    setGraphicFile(file);
    setPreviewUrl(url ?? null);
  }

  function handleAddToCart() {
    if (price == null) {
      alert("Calculează prețul mai întâi");
      return;
    }
    const id = `${product.id}-${width}x${height}-${materialId}-${side}`;
    addItem({
      id,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      width,
      height,
      price,
      quantity: 1,
      currency: product.currency,
    });
    alert("Produs adăugat în coș");
  }

  return (
    <div>
      <MaterialSelector materials={product.materials ?? []} value={materialId} onChange={setMaterialId} />
      {product.bothSidesSupported && <SideSelector value={side} onChange={setSide} />}

      <DimensionEditor
        minWidth={product.minWidthCm}
        maxWidth={product.maxWidthCm}
        minHeight={product.minHeightCm}
        maxHeight={product.maxHeightCm}
        width={width}
        height={height}
        onWidthChange={setWidth}
        onHeightChange={setHeight}
      />

      <GraphicUpload onChange={handleFile} initialPreview={product.images?.[0]} />

      <div style={{ marginTop: 12 }}>
        <button onClick={calculate} disabled={loading} style={{ marginRight: 8 }}>
          {loading ? "Se calculează…" : "Calculează preț"}
        </button>
        {price !== null && <strong>Preț: {price.toFixed(2)} {product.currency}</strong>}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleAddToCart} style={{ background: "#0ea5a4", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
          Adaugă în coș
        </button>
      </div>
    </div>
  );
}