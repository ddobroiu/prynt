import React from "react";
import ConfiguratorCarton from "../../../components/ConfiguratorCarton";

type Props = { params: { slug?: string[] | string } };

function parseDimsFromSlug(slug?: string[] | string): { width?: number; height?: number; productSlug?: string } {
  if (!slug) return {};
  const parts = Array.isArray(slug) ? slug : String(slug).split("/").map((s) => s.trim()).filter(Boolean);

  const dimExact = /^(\d{1,5})[xX×-](\d{1,5})$/;
  const dimAnywhere = /(\d{1,5})[xX×-](\d{1,5})/;

  let width: number | undefined;
  let height: number | undefined;
  const remaining: string[] = [];

  for (const seg of parts) {
    const mExact = seg.match(dimExact);
    if (mExact && width === undefined && height === undefined) {
      width = Number(mExact[1]);
      height = Number(mExact[2]);
      continue; // skip exact-dimension segment
    }

    const mAny = seg.match(dimAnywhere);
    if (mAny && width === undefined && height === undefined) {
      width = Number(mAny[1]);
      height = Number(mAny[2]);
      const cleaned = seg.replace(mAny[0], "").replace(/(^[-_]+|[-_]+$)/g, "").trim();
      if (cleaned) remaining.push(cleaned);
      continue;
    }

    remaining.push(seg);
  }

  const productSlug = remaining.length ? remaining.join("/") : parts.join("/");
  const out: { width?: number; height?: number; productSlug?: string } = {};
  if (width !== undefined && !Number.isNaN(width)) out.width = width;
  if (height !== undefined && !Number.isNaN(height)) out.height = height;
  out.productSlug = productSlug || undefined;
  return out;
}

export default function Page({ params }: Props) {
  const parsed = parseDimsFromSlug(params.slug);
  const productSlug = parsed.productSlug ?? (Array.isArray(params.slug) ? params.slug.join("/") : params.slug ?? "carton");

  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorCarton
        productSlug={productSlug}
        initialWidth={parsed.width ?? undefined}
        initialHeight={parsed.height ?? undefined}
      />
    </main>
  );
}