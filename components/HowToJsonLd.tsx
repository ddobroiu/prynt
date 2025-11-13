import React from "react";

type HowToStep = { name: string; text: string };

export default function HowToJsonLd({ name, steps }: { name: string; steps: HowToStep[] }) {
  if (!steps?.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  } as const;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
