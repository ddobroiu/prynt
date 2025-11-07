"use client";
import React, { useEffect } from "react";
import { useCart } from "./CartContext";
import { ShoppingCart } from "lucide-react";

export default function CartWidget() {
  const { items, total, removeItem, clearCart } = useCart();

  useEffect(() => {
    console.log("[CartWidget] items changed", items, "total", total);
  }, [items, total]);

  const count = items.reduce((s, i) => s + (i.quantity ?? 1), 0);

  const togglePanel = () => {
    const el = document.getElementById("cart-panel");
    if (el) el.style.display = el.style.display === "block" ? "none" : "block";
  };

  return (
    <>
      {/* Floating circular icon above contact button */}
      <div style={{ position: "fixed", right: 20, bottom: 150, zIndex: 10001 }}>
        <button
          onClick={togglePanel}
          aria-label="Deschide coș"
          title="Coș"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 54,
            height: 54,
            borderRadius: 12,
            background: "linear-gradient(180deg,#0ea5a4,#0b9489)",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 20px rgba(2,6,23,0.6)",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <ShoppingCart size={22} />
          {count > 0 && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                minWidth: 18,
                height: 18,
                padding: "0 5px",
                borderRadius: 9,
                background: "#ef4444",
                color: "#fff",
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      {/* cart panel (kept unchanged) */}
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
          position: "fixed",
          right: 20,
          bottom: 88,
          zIndex: 10000,
        }}
      >
        <h3>Coș</h3>
        {items.length === 0 && <div>Coșul este gol</div>}
        {items.map((it) => (
          <div key={it.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 600 }}>{it.title}</div>
            <div>
              {it.width ?? "—"} x {it.height ?? "—"} cm — {(Number(it.price) || 0).toFixed(2)}{" "}
              {it.currency ?? "RON"} × {it.quantity ?? 1}
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
        <div style={{ marginTop: 10, fontWeight: 700 }}>Total: {(Number(total) || 0).toFixed(2)} RON</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            onClick={() => {
              alert("Checkout simulat");
              console.log("Checkout items:", items);
            }}
            style={{ flex: 1, padding: "8px 10px", background: "#0ea5a4", color: "#fff", border: "none", borderRadius: 6 }}
          >
            Checkout
          </button>
          <button onClick={() => clearCart()} style={{ padding: "8px 10px", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6 }}>
            Golește
          </button>
        </div>
      </div>
    </>
  );
}