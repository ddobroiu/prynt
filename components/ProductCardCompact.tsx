"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product as LibProduct } from "@/lib/products";

type Product = LibProduct & { category?: string };

export default function ProductCardCompact({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  
  // LOGICA IMAGINE: Încearcă .jpg pentru produs specific, fallback la .webp configurator
  const slugKey = String(product.slug ?? (product as any).routeSlug ?? product.id ?? "").toLowerCase();
  const categoryPath = String((product.metadata as any)?.category ?? product.category ?? "banner").toLowerCase();
  
  const productSpecificImageJpg = `/products/${categoryPath}/${slugKey}.jpg`;
  const configuratorImageWebp = `/products/${categoryPath}/1.webp`;
  
  let img = productSpecificImageJpg; // Încearcă mai întâi .jpg specific produsului
  const finalImg = imgError ? configuratorImageWebp : img;

  const isBanner = String((product.metadata as any)?.category ?? product.category ?? "").toLowerCase() === "bannere";
  const priceDisplay = isBanner ? "De la 50 RON" : "Detalii";
  const href = isBanner ? `/banner/${product.slug}` : `/product/${product.slug}`;

  return (
    <article className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-slate-900/60">
      <Link href={href} className="block group" aria-label={`Configurează ${product.title}`}>
        <div className="relative aspect-square">
          <img
            src={finalImg}
            alt={product.title ?? "Imagine produs"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {/* top subtle gradient */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-transparent" />
          {/* bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="rounded-xl bg-linear-to-br from-indigo-700/90 to-fuchsia-600/90 p-px">
              <div className="rounded-[10px] bg-slate-900/80 px-4 py-3 backdrop-blur-sm flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-white text-base font-semibold truncate">{product.title}</h3>
                  <p className="text-indigo-200 text-sm mt-0.5">{priceDisplay}</p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 text-white text-sm font-semibold shadow-md">
                  Configurează
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
