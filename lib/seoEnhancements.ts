// lib/seoEnhancements.ts
// Utilitare pentru îmbunătățirea SEO-ului pe site

export interface EnhancedSEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  structuredData?: any;
  canonical?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export function generateEnhancedMetadata(config: EnhancedSEOConfig) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(", "),
    alternates: {
      canonical: config.canonical ? `${baseUrl}${config.canonical}` : undefined
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
      siteName: "Prynt.ro",
      locale: config.locale || "ro_RO",
      type: "website",
      images: [
        {
          url: config.ogImage || `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      authors: config.author ? [config.author] : undefined,
      section: config.section,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [config.ogImage || `${baseUrl}/logo.png`],
      creator: "@prynt_ro",
      site: "@prynt_ro",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Generare structured data pentru produse
export function generateProductStructuredData(product: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.map((img: string) => `${baseUrl}${img}`) || [`${baseUrl}/logo.png`],
    "brand": {
      "@type": "Brand",
      "name": "Prynt.ro"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Prynt.ro"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "RON",
      "price": product.startingPrice || "50.00",
      "url": `${baseUrl}/${product.category}/${product.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "Prynt.ro"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  };
}

// Structured data pentru organizație
export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  return {
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
      }
    ]
  };
}

// Website structured data
export function generateWebsiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  return {
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
}

// Keywords pentru diferite categorii
export const SEO_KEYWORDS = {
  banner: [
    "bannere publicitare",
    "banner PVC",
    "bannere outdoor", 
    "bannere personalizate",
    "tipar bannere",
    "bannere rezistente",
    "publicitate exterior"
  ],
  afise: [
    "afișe publicitare",
    "postere personalizate",
    "tipar afișe",
    "afișe A4 A3 A2 A1",
    "print postere",
    "afișe evenimente",
    "materiale promoționale"
  ],
  canvas: [
    "tablouri canvas",
    "canvas personalizat",
    "print pe pânză",
    "tablouri foto",
    "canvas pe șasiu",
    "decorațiuni perete",
    "cadouri personalizate"
  ],
  autocolante: [
    "autocolante personalizate",
    "stickere vinyl",
    "etichete adezive",
    "decor autocolante",
    "autocolante rezistente",
    "stickere exterior"
  ],
  materiale: [
    "materiale rigide",
    "PVC Forex",
    "plexiglass",
    "alucobond",
    "panouri publicitare",
    "materiale outdoor"
  ]
} as const;