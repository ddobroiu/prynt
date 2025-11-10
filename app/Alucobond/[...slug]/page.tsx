import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";

type Props = {
  params: {
    slug?: string[];
  };
};

function parseDimsFromSlug(slug?: string[]): { width?: number; height?: number; productSlug?: string } {
  if (!slug || slug.length === 0) return {};
  // Try to find a segment like "100x200" or "100X200"
  for (const seg of slug) {
    const m = seg.match(/^(\d{1,5})[xX](\d{1,5})$/);
    if (m) {
      return { width: parseInt(m[1], 10), height: parseInt(m[2], 10), productSlug: slug.join("/") };
    }
  }
  // If no WxH found, return productSlug as joined slug (useful to map to DB)
  return { productSlug: slug.join("/") };
}

export default function BannerVersoCatchAllPage({ params }: Props) {
  const { width, height, productSlug } = parseDimsFromSlug(params.slug);

  return (
    <div>
      <BannerVersoConfigurator
        productSlug={productSlug ?? "banner-verso"}
        initialWidth={width}
        initialHeight={height}
      />
    </div>
  );
}