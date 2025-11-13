"use client";
import React, { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import DeliveryInfo from "@/components/DeliveryInfo";

/**
 * Helper: returnează un number sigur.
 * - v poate fi number | undefined | null | string
 * - fallback este valoarea returnată dacă v nu e "valid number"
 */
function safeNumber(v: any, fallback: number): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export default function ProductClient({
  product,
  initialWidth,
  initialHeight,
}: {
  product: Product;
  initialWidth?: number | null;
  initialHeight?: number | null;
}) {
  const { addItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);

  // fallback-uri logice: folosim initialWidth/initialHeight dacă există,
  // altfel product.width_cm / product.minWidthCm / 120 (sau alt fallback)
  const defaultWidthFallback = 120;
  const defaultHeightFallback = 60;

  const computedInitialWidth = safeNumber(
    initialWidth ?? product.width_cm ?? product.minWidthCm,
    defaultWidthFallback
  );

  const computedInitialHeight = safeNumber(
    initialHeight ?? product.height_cm ?? product.minHeightCm,
    defaultHeightFallback
  );

  const [materialId, setMaterialId] = useState<string>(product.materials?.[0]?.id ?? "");
  const [side, setSide] = useState<"single" | "double">("single");

  // Folosim numai numere sigure.
  const [width, setWidth] = useState<number>(() => Math.max(computedInitialWidth, product.minWidthCm ?? computedInitialWidth));
  const [height, setHeight] = useState<number>(() => Math.max(computedInitialHeight, product.minHeightCm ?? computedInitialHeight));

  // Price poate fi calculat ulterior; inițial folosim priceBase fallback
  const [price, setPrice] = useState<number>(() => safeNumber(product.priceBase, 0));

  // Exemplu simplu: adăugare în coș (normalizăm forma)
  function handleAddToCart() {
    // recalculăm unitPrice/total etc. (aici folosește logica ta de calcul)
    const qty = 1;
    const unitPrice = Math.max(0, price);

    const id = `banner-${product.slug}-${materialId}-${width}x${height}-${side}`;

    addItem({
      id,
      productId: product.id,
      slug: product.slug,
      title: `${product.title} - ${width}x${height} cm`,
      price: unitPrice,
      quantity: qty,
      currency: product.currency ?? "RON",
      metadata: {
        width_cm: width,
        height_cm: height,
        materialId,
        side,
      },
    });
    // feedback uniform: toast de succes
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  return (
    <div className="product-client">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Lățime (cm)</label>
        <input
          type="number"
          value={String(width)}
          onChange={(e) => setWidth(Math.max(1, safeNumber(e.target.value, computedInitialWidth)))}
          className="input"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Înălțime (cm)</label>
        <input
          type="number"
          value={String(height)}
          onChange={(e) => setHeight(Math.max(1, safeNumber(e.target.value, computedInitialHeight)))}
          className="input"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Material</label>
        <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="input">
          {product.materials?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          )) ?? <option value="">Standard</option>}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button className="btn-primary" onClick={handleAddToCart}>
          Adaugă în coș — {price.toFixed(2)} {product.currency ?? "RON"}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <DeliveryInfo shippingFrom={19.99} />
      </div>
    </div>
  );
}