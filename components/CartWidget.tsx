"use client";
import React from "react";
import { useCart } from "./CartProvider";

function formatRon(value: number) {
  return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " RON";
}

export default function CartWidget() {
  const { items, removeItem, total, isLoaded } = useCart();

  if (!isLoaded) return null; // așteptăm încărcarea din localStorage
  if (!items || items.length === 0) return <div>Coș gol</div>;

  return (
    <div style={{ maxWidth: 320 }}>
      {items.map((item) => {
        const title = item.title || item.slug || "Produs fără nume";
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        const lineTotal = price * qty;

        return (
          <div key={item.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{title}</div>
            <div style={{ color: "#666", fontSize: 13 }}>
              {formatRon(price)} × {qty} = <strong>{formatRon(lineTotal)}</strong>
            </div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => removeItem(item.id)} style={{ color: "#c00", background: "transparent", border: "none", cursor: "pointer" }}>
                Șterge
              </button>
            </div>
          </div>
        );
      })}

      <hr />
      <div style={{ marginTop: 8, fontWeight: 700 }}>
        Total: {formatRon(Number(total) || 0)}
      </div>
    </div>
  );
}