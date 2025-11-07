import React from "react";
import type { Product } from "@/lib/products";

export default function ProductJsonLd({ product, url }: { product: Product; url: string }) {
  const sku = product.sku ?? product.id;
  const json = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.priceBase,
      availability: "https://schema.org/InStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}