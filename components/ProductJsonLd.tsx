"use client";
import React from "react";
import type { Product } from "@/lib/products";

type Props = {
  product?: Product;
  url?: string;
  name?: string;
  description?: string;
  image?: string | string[];
  price?: string | number;
  currency?: string;
  brand?: string;
  availability?: string;
};

export default function ProductJsonLd({ 
  product, 
  url,
  name,
  description,
  image,
  price,
  currency,
  brand,
  availability 
}: Props) {
  // Determinăm valorile: prioritate au cele trimise manual, apoi cele din obiectul product
  const finalName = name || product?.title || "Produs Prynt";
  const finalDesc = description || product?.description || "";
  const finalImage = image || product?.images || [];
  const finalPrice = price || (product?.priceBase ? String(product.priceBase) : "0");
  const finalCurrency = currency || product?.currency || "RON";
  
  // URL-ul este important pentru Google
  const finalUrl = url || (product?.slug ? `https://www.prynt.ro/${product.slug}` : "https://www.prynt.ro");

  const offers = {
    "@type": "Offer",
    url: finalUrl,
    priceCurrency: finalCurrency,
    price: finalPrice,
    availability: availability || "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: finalName,
    image: finalImage,
    description: finalDesc,
    sku: product?.sku ?? product?.slug ?? "custom-print",
    brand: { "@type": "Brand", name: brand || "Prynt" },
    offers,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}