"use client";
import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function CartWidget() {
  const { items, total, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "#0f1724",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        Coș ({items.reduce((s, i) => s + (i.quantity ?? 1), 0)})
      </button>

      {open && (
        <div
          style={{
            width: 360,
            maxHeight: "70vh",
            overflow: "auto",
            background: "#fff",
            color: "#000",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            marginTop: 8,
            padding: 12,
          }}
        >
          <h3>Coș</h3>
          {items.length === 0 && <div>Coșul este gol</div>}
          {items.map((it) => (
            <div key={it.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div>
                {it.width} x {it.height} cm — {it.price.toFixed(2)} {it.currency} × {it.quantity}
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => removeItem(it.id)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 8px", borderRadius: 6 }}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 10, fontWeight: 700 }}>Total: {total.toFixed(2)} RON</div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              onClick={() => {
                // pentru moment: simulare checkout
                alert("Checkout simulat — implementăm Stripe în pasul următor");
                console.log("Checkout items:", items);
              }}
              style={{ flex: 1, padding: "8px 10px", background: "#0ea5a4", color: "#fff", border: "none", borderRadius: 6 }}
            >
              Checkout
            </button>
            <button
              onClick={() => clearCart()}
              style={{ padding: "8px 10px", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6 }}
            >
              Golește
            </button>
          </div>
        </div>
      )}
    </div>
  );
}