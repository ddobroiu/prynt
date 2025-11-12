import React from "react";

export type QA = { question: string; answer: string };

/**
 * Renders FAQPage JSON-LD using provided Q&A pairs.
 */
export default function FaqJsonLd({ qa }: { qa: QA[] }) {
  if (!qa || qa.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  } as const;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
