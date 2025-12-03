import Image from "next/image";
import React from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Component optimizat pentru imagini cu SEO și performance
 * - Alt text obligatoriu pentru SEO
 * - Lazy loading implicit
 * - Dimensiuni explicit pentru CLS (Cumulative Layout Shift)
 * - Quality optimizat default 85
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  
  // Validare: alt text nu poate fi gol pentru SEO
  if (!alt || alt.trim() === "") {
    console.warn(`⚠️ SEO Warning: Image ${src} is missing alt text`);
  }

  const commonProps = {
    alt,
    className,
    quality,
    priority,
  };

  if (fill) {
    return (
      <Image
        {...commonProps}
        src={src}
        fill
        sizes={sizes || "100vw"}
      />
    );
  }

  if (!width || !height) {
    console.warn(`⚠️ Performance Warning: Image ${src} is missing width/height - may cause CLS`);
  }

  return (
    <Image
      {...commonProps}
      src={src}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
    />
  );
}
