"use client";
import React from "react";
import type { Product } from "@/lib/products";

export default function ProductJsonLd({ product, url }: { product: Product; url: string }) {
  const offers = {
    "@type": "Offer",
    url,
    priceCurrency: product.currency || "RON",
    price: product.priceBase ? String(product.priceBase) : "0",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images || [],
    description: product.description,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: "Prynt" },
    offers,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}