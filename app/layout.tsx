import "./globals.css";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import ContactButton from "../components/ContactButton";

// Cart provider + widget (client components)
import { CartProvider } from "../components/CartContext";
import CartWidget from "../components/CartWidget";

export const metadata = {
  title: "Prynt.ro | Tipar digital & producție publicitară",
  description:
    "Bannere, flayere, canvas, autocolante, materiale rigide. Configurează online și vezi prețul în timp real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
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

      <body className="bg-[#0b0f19] text-white antialiased">
        <Providers>
          <Header />

          {/* CartProvider trebuie să învăluie părțile care folosesc useCart */}
          <CartProvider>
            <main>{children}</main>

            {/* CartWidget folosește useCart, deci trebuie în interiorul CartProvider */}
            <CartWidget />
          </CartProvider>

          <Footer />
          <ContactButton />
        </Providers>
      </body>
    </html>
  );
}