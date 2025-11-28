"use client";
import Script from 'next/script';

export default function GlobalStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Prynt.ro",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Tipar digital profesional - bannere, afișe, canvas, autocolante și materiale publicitare",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO",
      "addressLocality": "România"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@prynt.ro",
      "availableLanguage": "Romanian"
    },
    "sameAs": [
      "https://www.facebook.com/prynt.ro",
      "https://www.instagram.com/prynt.ro"
    ],
    "service": [
      {
        "@type": "Service",
        "name": "Bannere publicitare",
        "description": "Print bannere PVC outdoor și indoor"
      },
      {
        "@type": "Service", 
        "name": "Afișe și postere",
        "description": "Tipărire afișe A4, A3, A2, A1, A0"
      },
      {
        "@type": "Service",
        "name": "Canvas personalizat",
        "description": "Tablouri canvas pe pânză întinsă pe șasiu"
      },
      {
        "@type": "Service",
        "name": "Autocolante vinyl",
        "description": "Autocolante personalizate rezistente"
      },
      {
        "@type": "Service",
        "name": "Materiale rigide",
        "description": "PVC Forex, Plexiglass, Alucobond"
      }
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Prynt.ro",
    "url": baseUrl,
    "description": "Tipar digital și producție publicitară online cu configuratoare instant",
    "publisher": {
      "@type": "Organization",
      "name": "Prynt.ro"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
    </>
  );
}