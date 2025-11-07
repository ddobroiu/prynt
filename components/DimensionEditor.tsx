"use client";
import React, { useState } from "react";

type Props = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onPriceChange?: (price: number) => void;
  onAddToCart?: (payload: { width: number; height: number; price: number }) => void;
};

export default function DimensionEditor({
  minWidth = 10,
  maxWidth = 500,
  minHeight = 10,
  maxHeight = 300,
  onPriceChange,
  onAddToCart,
}: Props) {
  const [width, setWidth] = useState<number>(120);
  const [height, setHeight] = useState<number>(60);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function calculate() {
    setError(null);
    if (width < minWidth || width > maxWidth || height < minHeight || height > maxHeight) {
      setError(`Dimensiuni invalide. Lățime ${minWidth}-${maxWidth} cm, Înălțime ${minHeight}-${maxHeight} cm.`);
      setPrice(null);
      onPriceChange?.(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/calc-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widthCm: width, heightCm: height }),
      });
      const data = await res.json();
      if (res.ok) {
        setPrice(data.price);
        onPriceChange?.(data.price);
      } else {
        setError(data?.message || "Eroare la calcul preț");
      }
    } catch (e) {
      setError("Eroare de rețea");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div>
        <label>
          Lățime (cm):
          <input
            type="number"
            value={width}
            min={minWidth}
            max={maxWidth}
            onChange={(e) => setWidth(Number(e.target.value))}
            style={{ marginLeft: 8, width: 100 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Înălțime (cm):
          <input
            type="number"
            value={height}
            min={minHeight}
            max={maxHeight}
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ marginLeft: 8, width: 100 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={calculate} disabled={loading}>
          {loading ? "Calcul..." : "Calculează preț"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {price !== null && (
        <div style={{ marginTop: 12 }}>
          <strong>Preț estimat: </strong>
          {price.toFixed(2)} RON
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => {
            if (price == null) return;
            onAddToCart?.({ width, height, price });
            alert("Produs adăugat în coș (simulat)");
          }}
        >
          Adaugă în coș
        </button>
      </div>
    </div>
  );
}