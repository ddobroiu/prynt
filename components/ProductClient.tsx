"use client";
import React from "react";
import DimensionEditor from "./DimensionEditor";
import { Product } from "@/lib/products";
import { useCart } from "./CartContext";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const { addItem } = useCart();

  function handleAddToCart(payload: { width: number; height: number; price: number }) {
    const id = `${product.id}-${payload.width}x${payload.height}`;
    addItem({
      id,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      width: payload.width,
      height: payload.height,
      price: payload.price,
      quantity: 1,
      currency: product.currency,
    });
    // feedback vizual
    alert(`Produs adăugat în coș: ${product.title} — ${payload.width}x${payload.height} cm — ${payload.price} ${product.currency}`);
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