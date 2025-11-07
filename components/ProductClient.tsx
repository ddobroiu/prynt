"use client";
import React from "react";
import DimensionEditor from "./DimensionEditor";
import { Product } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  // Aici definim handler-ele interactive — sunt în client, deci ok
  function handleAddToCart(payload: { width: number; height: number; price: number }) {
    // Exemplu simplu: trimitem la un API sau la localStorage
    // fetch('/api/cart', { method: 'POST', body: JSON.stringify({ productId: product.id, ...payload }) })
    console.log("Add to cart (client):", { productId: product.id, ...payload });
    // poți afișa toast sau actualiza contextul de cart
    alert(`Produs adăugat: ${product.title} — ${payload.width}x${payload.height} cm — ${payload.price} ${product.currency}`);
  }

  return (
    <div>
      <h3>Personalizare (client)</h3>
      <DimensionEditor
        minWidth={product.minWidthCm}
        maxWidth={product.maxWidthCm}
        minHeight={product.minHeightCm}
        maxHeight={product.maxHeightCm}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}