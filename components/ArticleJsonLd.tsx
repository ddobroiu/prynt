import React from "react";

export type ArticleMeta = {
  headline: string;
  description: string;
  datePublished: string; // ISO
  dateModified?: string; // ISO
  author?: string;
  image?: string;
  url: string; // absolute
};

export default function ArticleJsonLd({ meta }: { meta: ArticleMeta }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.headline,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified || meta.datePublished,
    author: meta.author ? { "@type": "Person", name: meta.author } : undefined,
    image: meta.image,
    mainEntityOfPage: meta.url,
    url: meta.url,
    publisher: {
      "@type": "Organization",
      name: "Prynt",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
