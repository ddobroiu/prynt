"use client";
import Image from "next/image";
import { useState } from "react";

type GalleryImage = { src: string; alt?: string };

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);
  const safe = images.length ? images : [{ src: "/products/banner/1.jpg", alt: "Banner" }];

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src={safe[current].src}
          alt={safe[current].alt || "Product image"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {safe.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {safe.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                current === i ? "border-white" : "border-white/10"
              } hover:border-white/40`}
              aria-label={`Imagine ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt || `Thumb ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
