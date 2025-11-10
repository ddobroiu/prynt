import React from "react";
import ConfiguratorPVCForex from "../../../components/ConfiguratorPVCForex";
import { parseProductSlug } from "@/utils/parseProductSlug";

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  const parsed = parseProductSlug(params.slug);
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorPVCForex
        productSlug={params.slug}
        initialWidth={parsed.width_cm ?? undefined}
        initialHeight={parsed.height_cm ?? undefined}
      />
    </main>
  );
}