import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    price: number;
    images?: string[];
    category?: string;
    tags?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // LOGICA DE RUTARE: Determinăm link-ul corect bazat pe categorie
  const category = (product.category || "").toLowerCase();
  
  let href = `/product/${product.slug}`; // Fallback

  if (category === "bannere" || category === "banner") {
    href = `/banner/${product.slug}`;
  } else if (category === "banner-verso") {
     href = `/banner-verso/${product.slug}`;
  } else if (category === "afise") {
    href = `/afise/${product.slug}`;
  } else if (category === "autocolante") {
    href = `/autocolante/${product.slug}`;
  } else if (category === "flayere" || category === "flyere") {
    href = `/flayere/${product.slug}`;
  } else if (category === "pliante") {
    href = `/pliante/${product.slug}`;
  } else if (category === "canvas") {
    href = `/canvas/${product.slug}`;
  } else if (category === "tapet") {
    href = `/tapet/${product.slug}`;
  } else if (category === "carton") {
    href = `/materiale/carton/${product.slug}`;
  } else if (category === "plexiglass" || category === "plexiglas") {
    href = `/materiale/plexiglass/${product.slug}`;
  } else if (category === "alucobond") {
    href = `/materiale/alucobond/${product.slug}`;
  } else if (category === "polipropilena") {
    href = `/materiale/polipropilena/${product.slug}`;
  } else if (category === "pvc-forex") {
    href = `/materiale/pvc-forex/${product.slug}`;
  } else if (category === "fonduri-eu" || category === "fonduri-pnrr") {
    href = `/fonduri-eu`; // Link general către configurator
  }

  // LOGICA IMAGINE ROBUSTĂ
  const slugKey = String(product.slug ?? product.id ?? "").toLowerCase();
  const genericSet = new Set<string>(["/products/banner/1.webp","/products/banner/2.webp","/products/banner/3.webp","/products/banner/4.webp","/placeholder.png"]);
  const imgs = product.images ?? [];
  let img = imgs.find((x) => !!x && slugKey && x.toLowerCase().includes(slugKey));
  if (!img) img = imgs.find((x) => !!x && !genericSet.has(x.toLowerCase())) ?? imgs[0] ?? "/products/banner/1.webp";

  return (
    <Link 
      href={href}
      className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 h-full"
    >
      {/* Imagine */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={img}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          unoptimized={img.startsWith('http')}
        />
        {/* Badge Preț */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm z-10">
            De la {product.price} RON
        </div>
      </div>

      {/* Conținut */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-auto">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider">
                {product.category || "Produs"}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 transition-colors">
            {product.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {product.description || "Materiale publicitare de înaltă calitate."}
            </p>
        </div>

        {/* Footer Card */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 group-hover:underline">
                Configurează
            </span>
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRight size={16} />
            </div>
        </div>
      </div>
    </Link>
  );
}