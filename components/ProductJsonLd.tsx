import React from "react";
import { Product } from "../lib/products";

type Props = { product: Product; url: string };

export default function ProductJsonLd({ product, url }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Magazin" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: product.priceBase.toString(),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      // server component: safe to inject
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}