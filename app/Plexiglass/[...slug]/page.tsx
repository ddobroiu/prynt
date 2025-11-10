import React from "react";
import ConfiguratorPlexiglass from "../../../components/ConfiguratorPlexiglass";
import { parseProductSlug } from "@/utils/parseProductSlug";

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  const parsed = parseProductSlug(params.slug);
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorPlexiglass
        productSlug={params.slug}
        initialWidth={parsed.width_cm ?? undefined}
        initialHeight={parsed.height_cm ?? undefined}
      />
    </main>
  );
}