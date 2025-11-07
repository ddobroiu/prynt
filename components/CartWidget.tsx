"use client";
import React, { useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartWidget() {
  const { items, total, removeItem, clearCart } = useCart();

  useEffect(() => {
    console.log("[CartWidget] items changed", items, "total", total);
  }, [items, total]);

  return (
    <div style={{ position: "fixed", right: 20, bottom: 88, zIndex: 9999 }}>
      <button
        onClick={() => {
          const el = document.getElementById("cart-panel");
          if (el) el.style.display = el.style.display === "block" ? "none" : "block";
        }}
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

      <div
        id="cart-panel"
        style={{
          display: "none",
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
        {items.map((it) => {
          const width = typeof it.width === "number" ? it.width : 0;
          const height = typeof it.height === "number" ? it.height : 0;
          const price = typeof it.price === "number" ? it.price : 0;
          return (
            <div key={it.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 600 }}>{it.title ?? "Produs"}</div>
              <div>
                {width > 0 && height > 0 ? `${width} x ${height} cm` : "Dimensiune: -"}
                {" — "}
                {price.toFixed(2)} {it.currency ?? "RON"} × {it.quantity ?? 1}
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
          );
        })}

        <div style={{ marginTop: 10, fontWeight: 700 }}>Total: {total.toFixed(2)} RON</div>

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            onClick={() => {
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
    </div>
  );
}