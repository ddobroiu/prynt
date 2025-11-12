import "./globals.css";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import ContactButton from "../components/ContactButton";
import AssistantWidget from "../components/AssistantWidget";

// Cart provider + widget (client components)
import { CartProvider } from "../components/CartContext";
import CartWidget from "../components/CartWidget";

export const metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "")
  ),
  title: {
    default: "Prynt.ro | Tipar digital & producție publicitară",
    template: "%s | Prynt.ro",
  },
  description:
    "Bannere, flayere, canvas, autocolante, materiale rigide. Configurează online și vezi prețul în timp real.",
  openGraph: {
    title: "Prynt.ro | Tipar digital & producție publicitară",
    description:
      "Bannere, flayere, canvas, autocolante, materiale rigide. Configurează online și vezi prețul în timp real.",
    url: "/",
    siteName: "Prynt.ro",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Prynt.ro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prynt.ro | Tipar digital & producție publicitară",
    description:
      "Bannere, flayere, canvas, autocolante, materiale rigide. Configurează online și vezi prețul în timp real.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        {/* Organization & WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Prynt.ro",
              url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, ""),
              logo: new URL("/logo.png", (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro")).toString(),
              sameAs: [
                // Adaugă dacă există: Facebook, Instagram, LinkedIn etc.
              ],
              contactPoint: [{
                "@type": "ContactPoint",
                telephone: "+40 734 123 456",
                contactType: "customer service",
                areaServed: "RO",
                availableLanguage: ["ro", "en"],
              }],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Prynt.ro",
              url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, ""),
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "") + "/shop?q={search_term_string}",
                },
                queryInput: "required name=search_term_string",
              },
            }),
          }}
        />
        {/* TikTok Pixel: load after the page is interactive */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
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

  <body className="bg-ui text-ui antialiased">
        <Providers>
          <Header />

          {/* CartProvider trebuie să învăluie părțile care folosesc useCart */}
          <CartProvider>
            <main>{children}</main>

            {/* CartWidget folosește useCart, deci trebuie în interiorul CartProvider */}
            <CartWidget />
          </CartProvider>

          <Footer />
          <AssistantWidget />
          <ContactButton />
        </Providers>
      </body>
    </html>
  );
}