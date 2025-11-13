import React from "react";

type Props = {
  name: string; // ex: "Bannere publicitare"
  url: string; // absolute URL to the service page
  serviceType?: string; // ex: "Servicii de publicitate / Print digital"
};

export default function ServiceJsonLd({ name, url, serviceType }: Props) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: serviceType || "Servicii de publicitate / Print digital",
    url,
    areaServed: "RO",
    provider: {
      "@type": "LocalBusiness",
      name: "Prynt.ro",
      url: siteUrl,
      telephone: "+40 734 123 456",
      areaServed: "RO",
    },
  } as const;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
