import React from "react";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.prynt.ro/#organization",
    "name": "Prynt - Tipografie Digitală",
    "description": "Servicii profesionale de tipar digital: bannere, afișe, autocolante, canvas, materiale rigide. Configurare online, prețuri instant, livrare rapidă în toată România.",
    "url": "https://www.prynt.ro",
    "logo": "https://www.prynt.ro/logo.jpg",
    "image": "https://www.prynt.ro/og-image.jpg",
    "telephone": "+40-XXX-XXX-XXX", // TODO: Adaugă numărul real
    "email": "contact@prynt.ro",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Strada Exemplu 123", // TODO: Adaugă adresa reală
      "addressLocality": "București",
      "addressRegion": "București",
      "postalCode": "010101", // TODO: Adaugă codul postal real
      "addressCountry": "RO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.4268", // TODO: Coordonate București - actualizează cu locația ta
      "longitude": "26.1025"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "RON",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": {
      "@type": "Country",
      "name": "Romania"
    },
    "sameAs": [
      // TODO: Adaugă link-uri reale către social media
      // "https://www.facebook.com/prynt",
      // "https://www.instagram.com/prynt",
      // "https://www.linkedin.com/company/prynt"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicii Print Digital",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Bannere Publicitare",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Bannere Outdoor",
                "description": "Bannere personalizate rezistente la exterior"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Materiale Promoționale",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Afișe & Postere",
                "description": "Print HD pe hârtie foto"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Autocolante Personalizate",
                "description": "Autocolante vinyl cu decupaj pe contur"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Decor Interior",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Tablouri Canvas",
                "description": "Print pe pânză întinsă pe șasiu lemn"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Tapet Personalizat",
                "description": "Fototapet la dimensiuni personalizate"
              }
            }
          ]
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
