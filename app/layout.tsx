import "./globals.css";
import Script from "next/script";
import Providers from "../components/Providers";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import GlobalStructuredData from "../components/GlobalStructuredData";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import DynamicStylesLoader from "../components/DynamicStylesLoader";

export const metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "")
  ),
  title: {
    default: "Prynt.ro | Tipar digital & producție publicitară",
    template: "%s | Prynt.ro",
  },
  description:
    "Tipar digital profesional în România: bannere PVC, afișe, canvas personalizat, autocolante, materiale rigide. Configuratoare online cu prețuri instant și livrare rapidă.",
  keywords: [
    "tipar digital",
    "bannere publicitare",
    "afișe personalizate", 
    "canvas pe pânză",
    "autocolante vinyl",
    "materiale rigide",
    "publicitate outdoor",
    "print online România",
    "configurator preț instant"
  ],
  openGraph: {
    title: "Prynt.ro | Tipar digital & producție publicitară",
    description:
      "Tipar digital profesional în România: bannere PVC, afișe, canvas personalizat, autocolante, materiale rigide. Configuratoare online cu prețuri instant și livrare rapidă.",
    url: "/",
    siteName: "Prynt.ro",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Prynt.ro - Tipar digital profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prynt.ro | Tipar digital & producție publicitară",
    description:
      "Tipar digital profesional în România: bannere PVC, afișe, canvas personalizat, autocolante, materiale rigide. Configuratoare online cu prețuri instant.",
    images: ["/logo.jpg"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" data-theme="light">
      <head>
        <link rel="icon" href="/simbol.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/simbol.jpg" />
        
        <GlobalStructuredData />
        <LocalBusinessSchema />
        
        {/* DNS Prefetch și Preconnect pentru servicii externe */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        
        {/* Critical CSS inline pentru LCP rapid - extins pentru above-the-fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root{--bg:#ffffff;--surface:#f8fafc;--card-bg:#ffffff;--text:#0b1220;--muted:rgba(0,0,0,0.65);--accent:#4f46e5;--accent-600:#4338ca;--border:rgba(15,23,42,0.08);--success:#059669;color-scheme:light dark}
            *,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}
            body{background-color:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5}
            html,body{max-width:100%;overflow-x:hidden}
            h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin:0}
            p{margin:0}
            a{color:inherit;text-decoration:inherit}
            img,svg{display:block;vertical-align:middle;max-width:100%;height:auto}
            button{font-family:inherit;cursor:pointer}
            .btn-primary{display:inline-flex;align-items:center;justify-content:center;border-radius:0.5rem;padding:0.5rem 1rem;font-size:0.875rem;font-weight:600;transition:all 0.2s;background-color:var(--accent);color:white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);border:none}
            .container{width:100%;margin:0 auto;padding-left:1rem;padding-right:1rem}
            @media(min-width:640px){.container{max-width:640px}}
            @media(min-width:768px){.container{max-width:768px}}
            @media(min-width:1024px){.container{max-width:1024px}}
            @media(min-width:1280px){.container{max-width:1280px}}
            .flex{display:flex}
            .items-center{align-items:center}
            .justify-center{justify-content:center}
            .gap-2{gap:0.5rem}
            .gap-4{gap:1rem}
            .rounded-lg{border-radius:0.5rem}
            .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
            .text-white{color:#fff}
            .bg-white{background-color:#fff}
            .sticky{position:sticky}
            .fixed{position:fixed}
            .relative{position:relative}
            .z-50{z-index:50}
          `
        }} />
        
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Prynt Blog" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "") + "/#organization",
              name: "Prynt.ro",
              legalName: "Prynt - Tipar Digital & Productie Publicitara",
              url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, ""),
              logo: new URL("/logo.jpg", (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro")).toString(),
              description: "Tipar digital, bannere publicitare, autocolante personalizate, pliante, canvas si materiale rigide. Configurare online cu pret instant.",
              priceRange: "$$",
              image: new URL("/logo.jpg", (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro")).toString(),
              telephone: "+40 750 473 111",
              email: "contact@prynt.ro",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RO",
                addressLocality: "Romania",
              },
              geo: {
                "@type": "GeoCoordinates",
                addressCountry: "RO"
              },
              areaServed: {
                "@type": "Country",
                name: "Romania"
              },
              contactPoint: [{
                "@type": "ContactPoint",
                telephone: "+40 750 473 111",
                contactType: "customer service",
                email: "contact@prynt.ro",
                areaServed: "RO",
                availableLanguage: ["Romanian"],
                contactOption: "TollFree"
              }],
              sameAs: [
                "https://www.facebook.com/prynt.ro",
                "https://www.instagram.com/prynt.ro"
              ],
              openingHoursSpecification: [{
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00"
              }],
              paymentAccepted: "Cash, Card, Bank Transfer",
              currenciesAccepted: "RON"
            }),
          }}
        />
        {/* Google Analytics - încărcat după LCP */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-VG21Z7L33S"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VG21Z7L33S');
            `,
          }}
        />
        
        <Script
          id="tiktok-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('D4968URC77U6M9K6R1S0');
  ttq.page();
}(window, document, 'ttq');`,
          }}
        />
      </head>

      <body className="bg-white text-black antialiased">
        <DynamicStylesLoader />
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}